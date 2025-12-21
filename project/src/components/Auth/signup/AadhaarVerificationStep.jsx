import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { BoltInput } from '../BoltInput';
import { BoltButton } from '../BoltButton';
import { CreditCard, ArrowLeft } from 'lucide-react';

const aadhaarSchema = z.object({
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Aadhaar number must be 12 digits'),
});

export function AadhaarVerificationStep({ onNext, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(aadhaarSchema),
  });

  const onSubmit = (data) => {
    // DEMO ONLY - In production, this would verify with Aadhaar API
    console.log('Aadhaar verification (DEMO):', data);
    onNext(data);
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Demo Mode:</strong> Aadhaar verification is simulated. In production, this would connect to the official Aadhaar verification API.
        </p>
      </div>

      <BoltInput
        label="Aadhaar Number"
        type="text"
        icon={<CreditCard size={20} />}
        error={errors.aadhaarNumber?.message}
        placeholder="Enter 12-digit Aadhaar number"
        maxLength={12}
        {...register('aadhaarNumber')}
      />

      <div className="flex gap-3">
        <BoltButton
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </BoltButton>
        <BoltButton type="submit" variant="primary" className="flex-1">
          Verify & Continue
        </BoltButton>
      </div>
    </motion.form>
  );
}

