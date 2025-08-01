import { writable, derived } from 'svelte/store';
import { trackFieldAbandonment, trackFormInteraction } from '$lib/utils/api';

/**
 * Analytics store for field-level tracking
 */
function createAnalyticsStore() {
  const { subscribe, set, update } = writable({
    sessionId: crypto.randomUUID(),
    formStartTime: null,
    fieldInteractions: {},
    abandonedFields: new Set(),
    completedSteps: [],
    lastInteractionTime: null
  });

  return {
    subscribe,
    
    // Track when form starts
    startForm() {
      update(state => ({
        ...state,
        formStartTime: new Date(),
        lastInteractionTime: new Date()
      }));
      trackFormInteraction('form_started');
    },
    
    // Track field focus
    trackFieldFocus(fieldName, stepNumber) {
      update(state => {
        const interactions = state.fieldInteractions[fieldName] || {
          focusCount: 0,
          totalTime: 0,
          firstFocus: null,
          lastBlur: null
        };
        
        return {
          ...state,
          fieldInteractions: {
            ...state.fieldInteractions,
            [fieldName]: {
              ...interactions,
              focusCount: interactions.focusCount + 1,
              firstFocus: interactions.firstFocus || new Date(),
              currentFocus: new Date()
            }
          },
          lastInteractionTime: new Date()
        };
      });
    },
    
    // Track field blur (potential abandonment)
    trackFieldBlur(fieldName, stepNumber, isEmpty) {
      update(state => {
        const interactions = state.fieldInteractions[fieldName];
        if (!interactions || !interactions.currentFocus) return state;
        
        const timeSpent = Date.now() - new Date(interactions.currentFocus).getTime();
        
        // If field is empty and user spent time on it, track as abandoned
        if (isEmpty && timeSpent > 1000) {
          state.abandonedFields.add(fieldName);
          trackFieldAbandonment(fieldName, stepNumber);
        }
        
        return {
          ...state,
          fieldInteractions: {
            ...state.fieldInteractions,
            [fieldName]: {
              ...interactions,
              totalTime: interactions.totalTime + timeSpent,
              lastBlur: new Date(),
              currentFocus: null
            }
          },
          lastInteractionTime: new Date()
        };
      });
    },
    
    // Track step completion
    completeStep(stepNumber) {
      update(state => ({
        ...state,
        completedSteps: [...state.completedSteps, stepNumber],
        lastInteractionTime: new Date()
      }));
    },
    
    // Get field completion rate
    getFieldMetrics() {
      return derived(this, $state => {
        const totalFields = Object.keys($state.fieldInteractions).length;
        const abandonedCount = $state.abandonedFields.size;
        const completionRate = totalFields > 0 
          ? ((totalFields - abandonedCount) / totalFields) * 100 
          : 0;
        
        return {
          totalFields,
          abandonedCount,
          completionRate,
          averageTimePerField: calculateAverageTime($state.fieldInteractions),
          problematicFields: identifyProblematicFields($state.fieldInteractions)
        };
      });
    },
    
    // Reset analytics for new form session
    reset() {
      set({
        sessionId: crypto.randomUUID(),
        formStartTime: null,
        fieldInteractions: {},
        abandonedFields: new Set(),
        completedSteps: [],
        lastInteractionTime: null
      });
    }
  };
}

// Helper functions
function calculateAverageTime(fieldInteractions) {
  const times = Object.values(fieldInteractions)
    .map(interaction => interaction.totalTime)
    .filter(time => time > 0);
  
  return times.length > 0 
    ? times.reduce((a, b) => a + b, 0) / times.length 
    : 0;
}

function identifyProblematicFields(fieldInteractions) {
  return Object.entries(fieldInteractions)
    .filter(([_, interaction]) => {
      // Flag fields with high focus count or long time spent
      return interaction.focusCount > 3 || interaction.totalTime > 30000;
    })
    .map(([fieldName]) => fieldName);
}

export const formAnalytics = createAnalyticsStore();