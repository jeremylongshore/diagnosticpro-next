import { motion } from 'framer-motion';
import ShieldIcon from '../icons/ShieldIcon';
import { ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';

const TermsOfService = () => {
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
            <h1 className="text-4xl font-black mb-4">Terms of Service</h1>
            <p className="text-xl text-white/90">Legal terms and conditions for using our diagnostic services</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            onClick={() => window.history.back()}
            variant="secondary"
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to DiagnosticPro
          </Button>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="font-semibold text-blue-900">Last updated: July 19, 2025</div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Terms of Service</h2>
            <p>These Terms of Service govern your use of the website located at diagnosticpro.io and any related services provided by DiagnosticPro.</p>

            <p>By accessing diagnosticpro.io, you agree to abide by these Terms of Service and to comply with all applicable laws and regulations. If you do not agree with these Terms of Service, you are prohibited from using or accessing this website or using any other services provided by DiagnosticPro.</p>

            <p>We, DiagnosticPro, reserve the right to review and amend any of these Terms of Service at our sole discretion. Upon doing so, we will update this page. Any changes to these Terms of Service will take effect immediately from the date of publication.</p>

            <h3>Service Description</h3>
            <p>DiagnosticPro provides expert automotive and equipment diagnostic analysis services. Our services include:</p>
            <ul>
              <li>Equipment diagnosis and problem identification</li>
              <li>Repair quote verification and analysis</li>
              <li>Emergency diagnostic consultation</li>
              <li>Expert recommendations and guidance</li>
            </ul>

            <h3>Limitations of Use</h3>
            <p>By using this website, you warrant that you will not:</p>
            <ul>
              <li>modify, copy, prepare derivative works of, decompile, or reverse engineer any materials and software contained on this website;</li>
              <li>remove any copyright or other proprietary notations from any materials and software on this website;</li>
              <li>use this website or its associated services to transmit or publish any harassing, indecent, obscene, fraudulent, or unlawful material;</li>
              <li>use this website or its associated services in violation of any applicable laws or regulations;</li>
              <li>use this website in conjunction with sending unauthorized advertising or spam;</li>
            </ul>

            <h3>Payment and Refunds</h3>
            <p>All payments are processed securely through Stripe. We offer a 100% money-back guarantee if you are not satisfied with our diagnostic analysis.</p>

            <h3>Intellectual Property</h3>
            <p>The intellectual property in the materials contained in this website are owned by or licensed to DiagnosticPro and are protected by applicable copyright and trademark law.</p>

            <h3>Liability</h3>
            <p>Our website and diagnostic services are provided on an 'as is' basis. To the extent permitted by law, DiagnosticPro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.</p>

            <p>DiagnosticPro provides diagnostic analysis and recommendations based on the information provided. Final repair decisions should always be made in consultation with qualified mechanics or technicians.</p>

            <h3>SMS/MMS Communications</h3>
            <p>DiagnosticPro may send SMS and/or MMS communications for conversational and informational purposes, but only with the prior express consent of the recipient.</p>

            <h4>Consent to Communications</h4>
            <p>When you opt-in to receive SMS/MMS communications from DiagnosticPro, you expressly consent to receiving messages for service updates and diagnostic results.</p>

            <h4>Opting Out</h4>
            <p>To opt out of SMS communications at any time, reply with "STOP" or "UNSUBSCRIBE" to any message we send you. For assistance, contact us at support@diagnosticpro.io.</p>

            <h3>Governing Law</h3>
            <p>These Terms of Service are governed by and construed in accordance with the laws of Alabama, USA.</p>

            <h3>Contact Information</h3>
            <p>For questions about these Terms of Service, please contact us at:</p>
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

export default TermsOfService;