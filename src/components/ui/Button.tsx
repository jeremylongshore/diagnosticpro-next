import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    children, 
    fullWidth = false,
    className = '',
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed relative';
    
    const variants = {
      primary: 'btn-primary text-white',
      secondary: 'btn-secondary',
      ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-200 rounded-xl',
      danger: 'bg-gradient-to-r from-error-600 to-error-700 text-white shadow-lg hover:shadow-xl focus:ring-error-200 rounded-xl'
    };

    const sizes = {
      sm: 'text-sm',
      md: 'text-base', 
      lg: 'text-lg'
    };

    const classes = `
      ${baseClasses}
      ${variants[variant]}
      ${sizes[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim();

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;