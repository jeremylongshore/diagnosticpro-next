'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../src/store/useAppStore';
import { services } from '../src/data/services';
import HeroSection from '../src/components/HeroSection';
import ServiceCard from '../src/components/ServiceCard';
import Button from '../src/components/ui/Button';
import Input from '../src/components/ui/Input';
import { Check, Zap, ArrowRight } from 'lucide-react';
import ShieldIcon from '../src/components/icons/ShieldIcon';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const {
    formData,
    selectService,
    updateFormData,
  } = useAppStore();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

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

    router.push('/form');
  };

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
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the service that best fits your current situation
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
                  className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-white to-gray-50 border border-gray-100 hover:border-success-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-success-400 to-success-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="text-gray-800 font-semibold text-lg">{feature.text}</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" suppressHydrationWarning>
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
              <Link href="/privacy">
                <button
                  className="text-primary-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </Link>
              <Link href="/terms">
                <button
                  className="text-primary-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </Link>
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