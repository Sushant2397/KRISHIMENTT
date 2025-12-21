import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../utils/constants';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { BasicDetailsStep } from '../components/auth/signup/BasicDetailsStep';
import { AadhaarVerificationStep } from '../components/auth/signup/AadhaarVerificationStep';
import { ProfileCompletionStep } from '../components/auth/signup/ProfileCompletionStep';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const Register = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [basicData, setBasicData] = useState(null);
  const [aadhaarData, setAadhaarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const handleBasicNext = (data) => {
    setBasicData(data);
    setStep(2);
    setSubmitError('');
  };

  const handleAadhaarNext = (data) => {
    setAadhaarData(data);
    setStep(3);
    setSubmitError('');
  };

  const handleFinalSubmit = async (profileData) => {
    setLoading(true);
    setSubmitError('');

    try {
      const finalPayload = {
        username: basicData.username,
        email: basicData.email,
        name: basicData.name,
        phone: basicData.phone,
        password: basicData.password,
        confirm_password: basicData.confirmPassword,
        role: profileData.role,
        // Aadhaar data is stored but not sent to backend (demo only)
        aadhaarNumber: aadhaarData?.aadhaarNumber,
      };

      const result = await registerUser(finalPayload);

      if (result.error) {
        setSubmitError(result.error);
        setLoading(false);
        return;
      }

      if (result.user) {
        // Redirect based on role after successful registration
        const role = result.user.role?.toLowerCase();
        navigate(`/${role === USER_ROLES.FARMER ? 'farmer' : 'labour'}-dashboard`);
      } else {
        setSubmitError(t('Registration successful but user data is missing. Please try again.'));
        setLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError(t('An error occurred during registration. Please try again.'));
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: t('Basic Details') },
    { number: 2, label: t('Verification') },
    { number: 3, label: t('Profile') },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/signup-hero.png" 
            alt="Agricultural Innovation - Technology meets farming" 
            className="w-full h-full object-cover"
            loading="eager"
            style={{ display: 'block' }}
            onLoad={() => console.log('Signup image loaded successfully')}
            onError={(e) => {
              console.error('Failed to load signup image. Path:', e.target.src);
              console.error('Make sure the image exists at: public/images/signup-hero.png');
            }}
          />
        </div>
        
        {/* Subtle overlay for better visual integration */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-indigo-600/10 via-purple-700/5 to-pink-800/10 pointer-events-none"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('Create Your Account')}
            </h1>
            <p className="text-gray-600">
              {t('Join us and start your journey')}
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => (
                <React.Fragment key={stepItem.number}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                        step >= stepItem.number
                          ? stepItem.number === 1 && step === 1
                            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg scale-110'
                            : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg scale-110'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step > stepItem.number ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        stepItem.number
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium transition-colors ${
                        step >= stepItem.number 
                          ? stepItem.number === 1 && step === 1
                            ? 'text-green-600'
                            : 'text-indigo-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {stepItem.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                        step > stepItem.number
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8"
          >
            {submitError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2"
                role="alert"
              >
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">{submitError}</span>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BasicDetailsStep onNext={handleBasicNext} />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AadhaarVerificationStep
                    onNext={handleAadhaarNext}
                    onBack={() => setStep(1)}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfileCompletionStep
                    onSubmit={handleFinalSubmit}
                    onBack={() => setStep(2)}
                    loading={loading}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sign In Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600">
              {t('Already have an account?')}{' '}
              <Link
                to="/login"
                className="font-semibold text-green-600 hover:text-green-700 transition-colors inline-flex items-center gap-1 group"
              >
                {t('Sign in')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-xs text-gray-500"
          >
            <p>© 2025 Smart Agriculture Platform. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
