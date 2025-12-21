import React from 'react';
import { Button } from '../Common/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BoltButton = React.forwardRef(({ 
  children, 
  loading, 
  fullWidth, 
  variant = 'default',
  className,
  ...props 
}, ref) => {
  return (
    <Button
      ref={ref}
      variant={variant === 'primary' ? 'default' : variant}
      className={cn(
        fullWidth && 'w-full',
        'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
        variant === 'primary' && 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl text-white',
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );
});

BoltButton.displayName = 'BoltButton';

