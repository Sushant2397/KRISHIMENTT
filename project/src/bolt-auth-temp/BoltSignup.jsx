import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// STEP COMPONENTS (your existing ones)
import { BasicDetailsStep } from "../components/auth/signup/BasicDetailsStep";
import { AadhaarVerificationStep } from "../components/auth/signup/AadhaarVerificationStep";
import { ProfileCompletionStep } from "../components/auth/signup/ProfileCompletionStep";

export default function Register() {
  const [step, setStep] = useState(1);

  const [basicData, setBasicData] = useState(null);
  const [aadhaarData, setAadhaarData] = useState(null);
  const [loading, setLoading] = useState(false);

  // STEP HANDLERS
  const handleBasicNext = (data) => {
    setBasicData(data);
    setStep(2);
  };

  const handleAadhaarNext = (data) => {
    setAadhaarData(data);
    setStep(3);
  };

  const handleFinalSubmit = async (profileData) => {
    setLoading(true);

    const finalPayload = {
      ...basicData,
      ...aadhaarData,
      ...profileData,
    };

    console.log("FINAL SIGNUP DATA:", finalPayload);

    // 👉 Call your backend / supabase signup here

    setTimeout(() => {
      setLoading(false);
      alert("Signup completed successfully!");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 md:p-8">

        {/* TITLE */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Step {step} of 3
          </p>
        </div>

        {/* STEP CONTENT */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1">
              <BasicDetailsStep onNext={handleBasicNext} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2">
              <AadhaarVerificationStep
                onNext={handleAadhaarNext}
                onBack={() => setStep(1)}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3">
              <ProfileCompletionStep
                onSubmit={handleFinalSubmit}
                onBack={() => setStep(2)}
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
