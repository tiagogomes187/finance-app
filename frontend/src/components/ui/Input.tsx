import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:    string;
  error?:    string;
  leftIcon?: React.ReactNode;
}

// forwardRef permite que o react-hook-form acesse o input diretamente
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, type, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="label">
            {label}
          </label>
        )}

        {/* Campo */}
        <div className="relative">
          {/* Ícone esquerdo */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            className={`
              input
              ${leftIcon ? 'pl-10' : ''}
              ${isPassword ? 'pr-10' : ''}
              ${error ? 'border-red-400 focus:ring-red-400' : ''}
              ${className}
            `}
            {...props}
          />

          {/* Botão mostrar/esconder senha */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {/* Mensagem de erro */}
        {error && (
          <p className="mt-1.5 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;