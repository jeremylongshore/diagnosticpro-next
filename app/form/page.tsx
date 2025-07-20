'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../src/store/useAppStore';
import DiagnosticForm from '../../src/components/DiagnosticForm';
import Button from '../../src/components/ui/Button';
import ShieldIcon from '../../src/components/icons/ShieldIcon';
import Link from 'next/link';

export default function FormPage() {
  const { formData, setSubmitting } = useAppStore();

  const handleFormSubmit = async (formSubmissionData: any) => {
    setSubmitting(true);
    
    try {
      // Store form data in sessionStorage
      const dataToStore = {
        ...formSubmissionData,
        serviceType: formData.selectedService?.id,
        servicePrice: formData.selectedService?.price,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        files: {
          fileCount: formSubmissionData.files?.length || 0,
          hasRecording: !!formSubmissionData.audioRecording
        }
      };
      
      sessionStorage.setItem('diagnosticFormData', JSON.stringify(dataToStore));
      
      // Redirect to payment immediately - no success message until actual payment
      if (formData.selectedService?.url) {
        window.location.href = formData.selectedService.url;
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="hero-bg-pattern"></div>
      <div className="glass-effect shadow-sm border-b border-white/20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              </Link>
              <div className="ml-6">
                <div className="flex items-center gap-2 text-2xl font-bold">
                <ShieldIcon className="w-8 h-8" />
                DiagnosticPro
              </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Selected Service:</div>
              <div className="font-semibold text-primary-600">
                {formData.selectedService?.name} - ${formData.selectedService?.price}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <DiagnosticForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}