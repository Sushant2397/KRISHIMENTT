import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '../Common/ui/input';
import { cn } from '@/lib/utils';

export const BoltInput = React.forwardRef(({ label, icon, error, className, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-gray-700 block">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200 z-10">
            {icon}
          </div>
        )}
        <Input
          ref={ref}
          className={cn(
            icon && 'pl-10 pr-4',
            error 
              ? 'border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500' 
              : 'border-gray-300 focus-visible:border-blue-500 focus-visible:ring-blue-500',
            'transition-all duration-200 hover:border-gray-400 focus-visible:shadow-md',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
    </div>
  );
});

BoltInput.displayName = 'BoltInput';

