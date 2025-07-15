// Clean Badge component - DRY principle
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'blue' | 'green' | 'purple' | 'gray';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'blue', ...props }, ref) => {
    const variants = {
      blue: 'badge-blue',
      green: 'badge-green',
      purple: 'badge-purple',
      gray: 'bg-gray-100 text-gray-800',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, type BadgeProps };
