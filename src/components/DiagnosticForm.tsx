'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Upload, 
  Mic, 
  MicOff, 
  X, 
  FileText, 
  Image as ImageIcon,
  CheckCircle,
  Loader2,
  CreditCard,
  Lock
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { equipmentTypes } from '../data/services';
import Button from './ui/Button';
import Input from './ui/Input';

// Form validation schema
const diagnosticSchema = z.object({
  equipmentType: z.string().min(1, 'Please select equipment type'),
  year: z.number().min(1900, 'Invalid year').max(2030, 'Invalid year'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  serial: z.string().optional(),
  mileage: z.string().optional(),
  errorCodes: z.string().optional(),
  problemDescription: z.string().min(10, 'Please provide a detailed description'),
  shopQuote: z.string().optional(),
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
});

type DiagnosticFormData = z.infer<typeof diagnosticSchema>;

interface DiagnosticFormProps {
  onSubmit: (data: DiagnosticFormData & { files: File[]; audioRecording?: Blob }) => void;
}

const DiagnosticForm = ({ onSubmit }: DiagnosticFormProps) => {
  const { formData, isSubmitting } = useAppStore();
  const [files, setFiles] = useState<File[]>([]);
  const [audioRecording, setAudioRecording] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<DiagnosticFormData>({
    resolver: zodResolver(diagnosticSchema),
    defaultValues: {
      fullName: formData.fullName || '',
      email: formData.email || '',
    }
  });

  // File upload handling
  const handleFileUpload = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return;

    const newFiles = Array.from(uploadedFiles).filter(file => {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert(`File type not allowed: ${file.name}`);
        return false;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }

      return true;
    });

    setFiles(prev => [...prev, ...newFiles].slice(0, 3)); // Max 3 files
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioRecording(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 300) { // 5 minutes max
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      alert('Microphone access denied. You can type your description instead.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const onFormSubmit = (data: DiagnosticFormData) => {
    console.log('Form data:', data);
    console.log('Form errors:', errors);
    onSubmit({ ...data, files, audioRecording: audioRecording || undefined });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-hover rounded-2xl p-8 shadow-lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        
        {/* Debug: Show validation errors */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-error-50 border border-error-200 rounded-xl p-4">
            <h4 className="text-error-800 font-semibold mb-2">Please fix the following errors:</h4>
            <ul className="text-error-700 text-sm space-y-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>• {field}: {error?.message}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Equipment Information */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Equipment Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-text">Equipment Type *</label>
              <select {...register('equipmentType')} className="input-field">
                <option value="">Select Equipment Type</option>
                {equipmentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.equipmentType && (
                <p className="text-error-600 text-sm mt-1">{errors.equipmentType.message}</p>
              )}
            </div>

            <Input
              label="Year"
              type="number"
              placeholder="e.g., 2018"
              {...register('year', { valueAsNumber: true })}
              error={errors.year?.message}
              required
            />

            <Input
              label="Make/Manufacturer"
              placeholder="e.g., Ford, Caterpillar, Carrier"
              {...register('make')}
              error={errors.make?.message}
              required
            />

            <Input
              label="Model"
              placeholder="e.g., F-150, 320D, 25HCB"
              {...register('model')}
              error={errors.model?.message}
              required
            />

            <Input
              label="VIN/Hull ID/Serial Number"
              placeholder="Enter if available"
              {...register('serial')}
            />

            <Input
              label="Hours/Mileage"
              placeholder="e.g., 85,000 miles or 1,200 hours"
              {...register('mileage')}
            />
          </div>
        </div>

        {/* Problem & Quote Details */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Problem & Quote Details</h3>
          
          <div className="space-y-6">
            <Input
              label="Error/DTC Codes"
              placeholder="Enter any error codes (P0420, E15, etc.) or 'NONE'"
              {...register('errorCodes')}
            />

            <div>
              <label className="label-text">Problem Description *</label>
              <textarea
                {...register('problemDescription')}
                className="input-field min-h-[120px]"
                placeholder="Describe symptoms, when it started, conditions when it happens. Be detailed - our AI analyzes everything."
              />
              {errors.problemDescription && (
                <p className="text-error-600 text-sm mt-1">{errors.problemDescription.message}</p>
              )}
            </div>

            <div>
              <label className="label-text">Shop Quote/Diagnosis (If You Have One)</label>
              <textarea
                {...register('shopQuote')}
                className="input-field min-h-[120px]"
                placeholder="Copy/paste what the mechanic told you, their diagnosis, parts they want to replace, labor costs, total estimate, etc."
              />
            </div>

            {/* Voice Recording */}
            <div>
              <label className="label-text">What Did The Mechanic Say? (Voice Message)</label>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="mb-4">
                  {!isRecording && !audioRecording && (
                    <button 
                      onClick={startRecording}
                      className="inline-flex items-center justify-center px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
                    >
                      <Mic className="w-5 h-5 mr-2" />
                      Record What They Told You
                    </button>
                  )}
                  
                  {isRecording && (
                    <div className="space-y-4">
                      <button 
                        onClick={stopRecording}
                        className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors animate-pulse"
                      >
                        <MicOff className="w-5 h-5 mr-2" />
                        Stop Recording
                      </button>
                      <div className="text-lg font-semibold text-error-600">
                        Recording: {formatTime(recordingTime)}
                      </div>
                    </div>
                  )}

                  {audioRecording && !isRecording && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center text-success-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Recording saved! ({formatTime(recordingTime)})
                      </div>
                      <Button onClick={() => {
                        setAudioRecording(null);
                        setRecordingTime(0);
                      }} variant="ghost" size="sm">
                        Record Again
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm">
                  Tell us exactly what the mechanic said, what they're charging, and what they want to fix
                </p>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="label-text">Supporting Files</label>
              <div
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                  ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
                  ${files.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => files.length < 3 && fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  Upload repair quotes, photos, estimates
                </div>
                <div className="text-gray-500">
                  Photos, PDFs, repair estimates (Max 5MB each, {3 - files.length} remaining)
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        {file.type.startsWith('image/') ? (
                          <ImageIcon className="w-5 h-5 text-blue-500 mr-3" />
                        ) : (
                          <FileText className="w-5 h-5 text-red-500 mr-3" />
                        )}
                        <span className="text-gray-700 font-medium truncate">
                          {file.name}
                        </span>
                        <span className="text-gray-400 text-sm ml-2">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(file.name)}
                        className="text-error-500 hover:bg-error-50 p-2 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="Your full name"
                {...register('fullName')}
                error={errors.fullName?.message}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                {...register('email')}
                error={errors.email?.message}
                required
              />
            </div>
            
            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="(555) 123-4567"
              {...register('phone')}
              error={errors.phone?.message}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-8">
          <button
            type="submit"
            disabled={!formData.selectedService || isSubmitting}
            className="w-full py-5 px-8 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden"
          >
            <div className="flex items-center justify-center relative z-10">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-6 h-6 mr-3" />
                  Get {formData.selectedService?.name || 'Expert Analysis'} — ${formData.selectedService?.price || '14.99'}
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
          </button>

          <div className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-1">
            <Lock className="w-4 h-4" />
            Secure payment processing by Stripe • 100% money-back guarantee
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default DiagnosticForm;