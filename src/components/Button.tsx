import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'black';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'px-6 py-3 font-semibold text-sm uppercase tracking-wide transition-colors duration-200';
  
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'bg-green-600 text-white hover:bg-green-700',
    outline: 'bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50',
    black: 'bg-black text-white hover:bg-gray-900'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

