import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const inputClasses = `
      input-field
      ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-100' : ''}
      ${className}
    `.trim();

    return (
      <div className="w-full">
        {label && (
          <label className="label-text">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {error && (
          <p className="mt-1 text-sm text-error-600">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;