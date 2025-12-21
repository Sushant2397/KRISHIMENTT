import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { BoltInput } from '../BoltInput';
import { BoltButton } from '../BoltButton';
import { Mail, Lock, User, Phone } from 'lucide-react';

const basicDetailsSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  name: z.string().min(1, 'Full name is required'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function BasicDetailsStep({ onNext }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(basicDetailsSchema),
  });

  const onSubmit = (data) => {
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <BoltInput
          label="Username"
          type="text"
          icon={<User size={20} />}
          error={errors.username?.message}
          {...register('username')}
        />
        <BoltInput
          label="Email Address"
          type="email"
          icon={<Mail size={20} />}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <BoltInput
          label="Full Name"
          type="text"
          icon={<User size={20} />}
          error={errors.name?.message}
          {...register('name')}
        />
        <BoltInput
          label="Phone Number"
          type="tel"
          icon={<Phone size={20} />}
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <BoltInput
        label="Password"
        type="password"
        icon={<Lock size={20} />}
        error={errors.password?.message}
        {...register('password')}
      />

      <BoltInput
        label="Confirm Password"
        type="password"
        icon={<Lock size={20} />}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <BoltButton type="submit" variant="primary" fullWidth>
        Continue
      </BoltButton>
    </motion.form>
  );
}

