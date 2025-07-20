import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { services } from './data/services';
import HeroSection from './components/HeroSection';
import ServiceCard from './components/ServiceCard';
import DiagnosticForm from './components/DiagnosticForm';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsOfService from './components/pages/TermsOfService';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import { Check, Zap, ArrowRight, ChevronLeft } from 'lucide-react';
import ShieldIcon from './components/icons/ShieldIcon';

type Page = 'home' | 'form' | 'privacy' | 'terms' | 'success';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const {
    formData,
    selectService,
    updateFormData,
    setSubmitting
  } = useAppStore();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // Check for payment success on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      setCurrentPage('success');
      setShowSuccess(true);
    } else if (urlParams.get('payment') === 'cancelled') {
      alert('Payment was cancelled. You can try again anytime.');
    }
  }, []);

  const features = [
    { icon: Check, text: 'Stop getting ripped off — know what\'s really wrong.' },
    { icon: Check, text: 'Get specific questions to ask your mechanic.' },
    { icon: Check, text: 'Verify repair quotes before you authorize work.' },
    { icon: Check, text: '100% money-back guarantee if not satisfied.' }
  ];

  const handleServiceSelect = (service: typeof services[0]) => {
    selectService(service);
  };

  const handleGetStarted = () => {
    if (!formData.selectedService) {
      alert('Please select a service first!');
      return;
    }

    // Update form data with basic info
    updateFormData({
      email,
      fullName: name,
    });

    setCurrentPage('form');
    // Scroll to top when navigating to form page
    window.scrollTo(0, 0);
  };

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
      
      // Send form data to Make.com webhook BEFORE payment
      const webhookData = {
        email: formSubmissionData.email,
        fullName: formSubmissionData.fullName,
        equipmentType: formSubmissionData.equipmentType,
        year: formSubmissionData.year?.toString() || '',
        make: formSubmissionData.make || '',
        model: formSubmissionData.model || '',
        problemDescription: formSubmissionData.problemDescription || '',
        shopQuote: formSubmissionData.shopQuote || 'No quote provided',
        serviceType: formData.selectedService?.id || 'diagnosis',
        errorCodes: formSubmissionData.errorCodes || '',
        mileage: formSubmissionData.mileage || '',
        phone: formSubmissionData.phone || ''
      };

      // Send to Make.com webhook via Netlify function to avoid CORS
      await fetch('/.netlify/functions/submit-diagnostic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });
      
      // Redirect to payment after successful webhook
      if (formData.selectedService?.url) {
        // Scroll to top before redirecting
        window.scrollTo(0, 0);
        window.location.href = formData.selectedService.url;
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Success page
  if (currentPage === 'success' || showSuccess) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="hero-bg-pattern"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-effect rounded-2xl p-12 shadow-xl text-center max-w-md mx-auto relative z-10"
        >
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-success-400 to-success-600 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-4">
            <strong>Your expert analysis is on the way!</strong>
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-bold text-blue-900 mb-2">What happens next:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>✅ Your form data has been received</li>
              <li>🤖 Our AI is analyzing your information now</li>
              <li>📧 You'll receive your detailed report via email within 30 minutes</li>
              <li>💬 Check your spam folder if you don't see it</li>
            </ul>
          </div>
          <p className="text-gray-600 mb-8">
            Questions? Reply to the email or contact support@diagnosticpro.io
          </p>
          <Button onClick={() => navigateToPage('home')} fullWidth>
            Return to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  // Privacy Policy page
  if (currentPage === 'privacy') {
    return <PrivacyPolicy />;
  }

  // Terms of Service page
  if (currentPage === 'terms') {
    return <TermsOfService />;
  }

  // Diagnostic Form page
  if (currentPage === 'form') {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="hero-bg-pattern"></div>
        <div className="glass-effect shadow-sm border-b border-white/20 relative z-10">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  onClick={() => navigateToPage('home')}
                  variant="ghost"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <div className="ml-6">
                  <div className="flex items-center gap-2 text-2xl font-bold">
                  <ShieldIcon className="w-8 h-8" />
                  DiagnosticPro
                </div>
                </div>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-sm text-gray-500">Selected Service:</div>
                <div className="font-semibold text-primary-600">
                  {formData.selectedService?.name} - ${formData.selectedService?.price}
                </div>
              </div>
              <div className="md:hidden">
                <div className="text-sm text-gray-500 text-center">Service: {formData.selectedService?.name}</div>
                <div className="font-semibold text-primary-600 text-center">${formData.selectedService?.price}</div>
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

  // Home page (default)
  return (
    <div className="min-h-screen gradient-bg">
      <div className="hero-bg-pattern"></div>
      {/* Hero Section */}
      <HeroSection />

      {/* Service Selection */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Choose Your Protection Service
            </h2>
            <p className="text-xl text-gray-800 font-semibold max-w-2xl mx-auto mb-2">
              Select the service that best fits your current situation
            </p>
            <p className="text-lg text-red-600 font-bold max-w-2xl mx-auto">
              ⚠️ You MUST click on one of the cards below to select your service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={formData.selectedService?.id === service.id}
                onSelect={handleServiceSelect}
                index={index}
              />
            ))}
          </div>

          {/* Promotion Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card-hover bg-gradient-to-r from-warning-500 to-orange-500 text-white rounded-2xl p-6 text-center mb-12 shadow-xl pulse-cta"
          >
            <div className="flex items-center justify-center gap-2 text-xl font-bold">
              <Zap className="w-6 h-6" />
              First-Time Customers: 50% OFF - Use Code SAVE50
              <Zap className="w-6 h-6" />
            </div>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="card-hover rounded-2xl p-8 shadow-lg mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-white to-gray-50 border-2 border-blue-200 hover:border-success-300 hover:shadow-lg transition-all duration-300 shadow-md"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-success-400 to-success-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <span className="text-gray-900 font-bold text-lg">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="card-hover rounded-2xl p-8 shadow-lg max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Ready to Get Protected?
              </h3>
              <p className="text-gray-600">
                Enter your details and we'll get you started immediately
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                onClick={handleGetStarted}
                fullWidth
                size="lg"
                disabled={!formData.selectedService || !email || !name}
                className="text-lg"
              >
                Continue to Form
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-1">
                <ShieldIcon className="w-4 h-4" />
                Secure payment processing by Stripe
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-4">
            <ShieldIcon className="w-8 h-8" />
            DiagnosticPro
          </div>
          <p className="text-gray-400 mb-8">
            Professional automotive diagnostic analysis to protect you from unnecessary repairs
          </p>
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-wrap justify-center gap-8 mb-4">
              <button
                onClick={() => navigateToPage('privacy')}
                className="text-primary-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigateToPage('terms')}
                className="text-primary-400 hover:text-white transition-colors"
              >
                Terms of Service
              </button>
              <a href="mailto:support@diagnosticpro.io" className="text-primary-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
            <div className="text-sm text-gray-500">
              © 2025 DiagnosticPro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;