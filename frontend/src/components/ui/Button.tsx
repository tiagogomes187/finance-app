import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  'primary' | 'secondary' | 'danger' | 'ghost';
  size?:     'sm' | 'md' | 'lg';
  loading?:  boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

export default function Button({
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  fullWidth = false,
  leftIcon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {

  const variants = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    danger:    'btn-danger',
    ghost:     'hover:bg-gray-100 text-gray-700 font-medium py-2.5 px-4 rounded-xl transition-colors duration-200',
  };

  const sizes = {
    sm: 'text-sm py-1.5 px-3',
    md: 'text-sm py-2.5 px-4',
    lg: 'text-base py-3 px-6',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        inline-flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {/* Spinner de loading */}
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        leftIcon && <span>{leftIcon}</span>
      )}
      {children}
    </button>
  );
}