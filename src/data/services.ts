import type { ServiceType } from '../types';

export const services: ServiceType[] = [
  {
    id: 'diagnosis',
    name: 'Equipment Diagnosis',
    price: 14.99,
    icon: 'diagnosis',
    description: 'AI-powered analysis to identify what\'s wrong. Get expert diagnosis in 30 minutes with repair recommendations.',
    url: 'https://buy.stripe.com/4gMbJ2g8MeU27M1h2hgYU00',
    features: [
      'Complete diagnostic analysis',
      'Repair cost estimation',
      'Part recommendations',
      '30-minute response time'
    ]
  },
  {
    id: 'quote-verification',
    name: 'Quote Verification',
    price: 14.99,
    icon: 'shield',
    description: 'Already have a repair quote? We\'ll verify if it\'s legit and give you questions to ask the shop.',
    url: 'https://buy.stripe.com/dRmcN66yc6nw5DT8vLgYU02',
    features: [
      'Quote accuracy check',
      'Price comparison',
      'Questions to ask mechanic',
      'Red flag identification'
    ]
  },
  {
    id: 'emergency',
    name: 'EMERGENCY - I\'m At The Shop',
    price: 29.99,
    icon: 'emergency',
    description: 'Get expert analysis INSTANTLY. We\'ll tell you exactly what to say RIGHT NOW.',
    url: 'https://buy.stripe.com/8x2aEY4q4aDM4zPaDTgYU01',
    features: [
      'Instant response',
      'Live chat support',
      'Negotiation scripts',
      'Priority analysis'
    ]
  }
];

export const equipmentTypes = [
  { value: 'automotive', label: 'Automotive (Cars, Trucks, SUVs)' },
  { value: 'marine', label: 'Marine (Boats, Jet Skis, Outboards)' },
  { value: 'heavy-equipment', label: 'Heavy Equipment (Construction, Mining)' },
  { value: 'motorcycles', label: 'Motorcycles/ATVs/UTVs' },
  { value: 'hvac', label: 'HVAC (Heating, Cooling, Refrigeration)' },
  { value: 'industrial', label: 'Industrial Equipment' },
  { value: 'agricultural', label: 'Agricultural (Tractors, Harvesters)' },
  { value: 'generators', label: 'Generators/Power Equipment' },
  { value: 'other', label: 'Other Equipment' }
];