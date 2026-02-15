import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
};

export const Button = ({ children, className = '', ...props }: ButtonProps) => {
  return (
    <button
      className={`flex items-center gap-1.5 bg-transparent text-gray-700 transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
