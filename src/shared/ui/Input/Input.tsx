import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input = ({ className = '', ...props }: InputProps) => {
  return (
    <input
      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none ${className}`}
      {...props}
    />
  );
};
