import React from 'react';

export const Button = ({ children, className = '', size = 'md', variant = 'default', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeMap = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantMap = {
    default: 'bg-slate-900 text-white hover:bg-slate-800',
    outline: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-900 hover:bg-slate-100',
  };

  const sizeClass = sizeMap[size] || sizeMap.md;
  const variantClass = variantMap[variant] || variantMap.default;

  return (
    <button className={`${base} ${sizeClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
