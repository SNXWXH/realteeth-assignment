import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export const Card = ({ children, className = '', onClick }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 transition-all  ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
