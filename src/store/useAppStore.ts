import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AppState, FormData, ServiceType, ValidationErrors } from '../types';

interface AppStore extends AppState {
  // Actions
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<FormData>) => void;
  setErrors: (errors: ValidationErrors) => void;
  clearErrors: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setRecording: (isRecording: boolean) => void;
  selectService: (service: ServiceType) => void;
  addFile: (file: File) => void;
  removeFile: (fileName: string) => void;
  setAudioRecording: (recording: Blob) => void;
  resetForm: () => void;
}

const initialState: AppState = {
  currentStep: 0,
  formData: {
    files: [],
  },
  errors: {},
  isSubmitting: false,
  isRecording: false,
};

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setCurrentStep: (step) => 
        set({ currentStep: step }, false, 'setCurrentStep'),

      updateFormData: (data) =>
        set(
          (state) => ({
            formData: { ...state.formData, ...data },
          }),
          false,
          'updateFormData'
        ),

      setErrors: (errors) => 
        set({ errors }, false, 'setErrors'),

      clearErrors: () => 
        set({ errors: {} }, false, 'clearErrors'),

      setSubmitting: (isSubmitting) => 
        set({ isSubmitting }, false, 'setSubmitting'),

      setRecording: (isRecording) => 
        set({ isRecording }, false, 'setRecording'),

      selectService: (service) =>
        set(
          (state) => ({
            formData: { ...state.formData, selectedService: service },
          }),
          false,
          'selectService'
        ),

      addFile: (file) =>
        set(
          (state) => ({
            formData: {
              ...state.formData,
              files: [...(state.formData.files || []), file],
            },
          }),
          false,
          'addFile'
        ),

      removeFile: (fileName) =>
        set(
          (state) => ({
            formData: {
              ...state.formData,
              files: (state.formData.files || []).filter(
                (file) => file.name !== fileName
              ),
            },
          }),
          false,
          'removeFile'
        ),

      setAudioRecording: (recording) =>
        set(
          (state) => ({
            formData: { ...state.formData, audioRecording: recording },
          }),
          false,
          'setAudioRecording'
        ),

      resetForm: () => 
        set(initialState, false, 'resetForm'),
    }),
    {
      name: 'diagnostic-pro-store',
    }
  )
);