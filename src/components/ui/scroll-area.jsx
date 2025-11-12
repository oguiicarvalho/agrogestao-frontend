import React from 'react';

export const ScrollArea = ({ children, className = '' }) => {
  return (
    <div className={className} style={{ overflow: 'auto' }}>
      {children}
    </div>
  );
};

export default ScrollArea;
