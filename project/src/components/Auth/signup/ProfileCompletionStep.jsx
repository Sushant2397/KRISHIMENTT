import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { BoltInput } from '../BoltInput';
import { BoltButton } from '../BoltButton';
import { ArrowLeft, User } from 'lucide-react';
import { USER_ROLES } from '../../../utils/constants';

const profileSchema = z.object({
  role: z.enum([USER_ROLES.FARMER, USER_ROLES.LABOUR], {
    required_error: 'Please select a role',
  }),
});

export function ProfileCompletionStep({ onSubmit, onBack, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      role: USER_ROLES.FARMER,
    },
  });

  const selectedRole = watch('role');

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-5"
    >
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-4 block">
          I am a:
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <motion.label
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative border-2 rounded-xl p-5 flex flex-col cursor-pointer transition-all duration-200 ${
              selectedRole === USER_ROLES.FARMER
                ? 'ring-2 ring-indigo-500 border-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-lg'
                : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center mb-2">
              <input
                type="radio"
                value={USER_ROLES.FARMER}
                {...register('role')}
                className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
              />
              <span className={`ml-3 block text-sm font-semibold transition-colors ${
                selectedRole === USER_ROLES.FARMER ? 'text-indigo-700' : 'text-gray-700'
              }`}>
                Farmer
              </span>
            </div>
            <p className={`text-xs transition-colors ${
              selectedRole === USER_ROLES.FARMER ? 'text-indigo-600' : 'text-gray-500'
            }`}>
              Looking to hire workers and manage your farm
            </p>
          </motion.label>

          <motion.label
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative border-2 rounded-xl p-5 flex flex-col cursor-pointer transition-all duration-200 ${
              selectedRole === USER_ROLES.LABOUR
                ? 'ring-2 ring-indigo-500 border-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-lg'
                : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center mb-2">
              <input
                type="radio"
                value={USER_ROLES.LABOUR}
                {...register('role')}
                className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
              />
              <span className={`ml-3 block text-sm font-semibold transition-colors ${
                selectedRole === USER_ROLES.LABOUR ? 'text-indigo-700' : 'text-gray-700'
              }`}>
                Agricultural Worker
              </span>
            </div>
            <p className={`text-xs transition-colors ${
              selectedRole === USER_ROLES.LABOUR ? 'text-indigo-600' : 'text-gray-500'
            }`}>
              Looking for farming jobs and opportunities
            </p>
          </motion.label>
        </div>
        {errors.role && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.role.message}
          </motion.p>
        )}
      </div>

      <div className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all"
        />
        <label htmlFor="terms" className="ml-3 text-sm text-gray-700 cursor-pointer">
          I agree to the{' '}
          <a href="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
            Privacy Policy
          </a>
        </label>
      </div>

      <div className="flex gap-3">
        <BoltButton
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={loading}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </BoltButton>
        <BoltButton
          type="submit"
          variant="primary"
          className="flex-1"
          loading={loading}
        >
          Create Account
        </BoltButton>
      </div>
    </motion.form>
  );
}

