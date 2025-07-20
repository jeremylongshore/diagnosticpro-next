import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
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
        <p className="text-gray-600 mb-8">
          Your analysis will be delivered within 30 minutes. Check your email for updates.
        </p>
        <Link href="/">
          <button className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Return to Home
          </button>
        </Link>
      </motion.div>
    </div>
  );
}