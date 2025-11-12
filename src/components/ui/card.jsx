import React from 'react';

export const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`} {...props}>{children}</div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-4 py-3 border-b ${className}`} {...props}>{children}</div>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props}>{children}</div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={className} {...props}>{children}</h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={className} {...props}>{children}</p>
);

export default Card;
