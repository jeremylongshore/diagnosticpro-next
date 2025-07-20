'use client';

import { motion } from 'framer-motion';
import ShieldIcon from '../../src/components/icons/ShieldIcon';
import { ArrowLeft } from 'lucide-react';
import Button from '../../src/components/ui/Button';
import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-bg text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <ShieldIcon className="w-24 h-24 mx-auto" />
            </div>
            <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
            <p className="text-xl text-white/90">How we protect your data and vehicle information</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/">
            <Button
              variant="secondary"
              className="mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to DiagnosticPro
            </Button>
          </Link>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="font-semibold text-blue-900">Last updated: July 19, 2025</div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Privacy Policy</h2>
            <p>Your privacy is important to us. It is DiagnosticPro's policy to respect your privacy and comply with any applicable law and regulation regarding any personal information we may collect about you, including across our website, diagnosticpro.io, and other sites we own and operate.</p>

            <p>Personal information is any information about you which can be used to identify you. This includes information about you as a person (such as name, address, and date of birth), your devices, payment details, and even information about how you use a website or online service.</p>

            <p>In the event our site contains links to third-party sites and services, please be aware that those sites and services have their own privacy policies. After following a link to any third-party content, you should read their posted privacy policy information about how they collect and use personal information. This Privacy Policy does not apply to any of your activities after you leave our site.</p>

            <p>This policy is effective as of July 19, 2025</p>

            <h3>Information We Collect</h3>
            <p>Information we collect falls into one of two categories: "voluntarily provided" information and "automatically collected" information.</p>

            <p>"Voluntarily provided" information refers to any information you knowingly and actively provide us when using or participating in any of our services and promotions.</p>

            <p>"Automatically collected" information refers to any information automatically sent by your devices in the course of accessing our products and services.</p>

            <h4>Personal Information</h4>
            <p>We may ask for personal information - for example, when you submit content to us, when you participate in any of our giveaways, sweepstakes, or promotions, when you register an account or when you contact us — which may include one or more of the following:</p>

            <ul>
              <li>Name</li>
              <li>Email</li>
              <li>Phone/mobile number</li>
              <li>Vehicle/equipment information</li>
              <li>Problem descriptions and diagnostic data</li>
            </ul>

            <h4>User-Generated Content</h4>
            <p>We consider "user-generated content" to be materials (text, image and/or video content) voluntarily supplied to us by our users for the purpose of diagnostic analysis. All user-generated content is associated with the account or email address used to submit the materials.</p>

            <h3>How We Use Information</h3>
            <p>We may collect, hold, use, and disclose information for the following purposes, and personal information will not be further processed in a manner that is incompatible with these purposes:</p>

            <ul>
              <li>to provide you with our diagnostic analysis services</li>
              <li>to process payments and deliver services</li>
              <li>for internal record keeping and administrative purposes</li>
              <li>to improve our services and customer experience</li>
              <li>to comply with our legal obligations and resolve any disputes</li>
            </ul>

            <h3>Security of Your Personal Information</h3>
            <p>When we collect and process personal information, and while we retain this information, we will protect it within commercially acceptable means to prevent loss and theft, as well as unauthorised access, disclosure, copying, use or modification.</p>

            <p>Although we will do our best to protect the personal information you provide to us, we advise that no method of electronic transmission or storage is 100% secure and no one can guarantee absolute data security.</p>

            <h3>Third Parties We Use</h3>
            <p>Third parties we currently use include:</p>
            <ul>
              <li>Stripe Payments (payment processing)</li>
              <li>Make.com (workflow automation)</li>
            </ul>

            <h3>Your Rights</h3>
            <p><strong>Access:</strong> You may request details of the personal information that we hold about you.</p>
            <p><strong>Correction:</strong> If you believe that any information we hold about you is inaccurate, out of date, incomplete, irrelevant, or misleading, please contact us.</p>
            <p><strong>Deletion:</strong> You may request that we delete personal information about you.</p>

            <h3>Contact Us</h3>
            <p>For any questions or concerns regarding your privacy, you may contact us using the following details:</p>
            <p>
              <strong>DiagnosticPro Support</strong><br />
              <a href="mailto:support@diagnosticpro.io" className="text-primary-600">support@diagnosticpro.io</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;