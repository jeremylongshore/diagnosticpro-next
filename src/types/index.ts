export interface ServiceType {
  id: string;
  name: string;
  price: number;
  icon: string;
  description: string;
  url: string;
  features: string[];
}

export interface FormData {
  // Equipment Info
  equipmentType: string;
  year: number;
  make: string;
  model: string;
  serial?: string;
  mileage?: string;
  
  // Problem Details
  errorCodes?: string;
  problemDescription: string;
  shopQuote?: string;
  
  // Contact Info
  fullName: string;
  email: string;
  phone?: string;
  
  // Service Selection
  selectedService?: ServiceType;
  
  // Files
  files: File[];
  audioRecording?: Blob;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface AppState {
  currentStep: number;
  formData: Partial<FormData>;
  errors: ValidationErrors;
  isSubmitting: boolean;
  isRecording: boolean;
}