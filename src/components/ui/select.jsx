import React, { createContext, useContext } from 'react';

const SelectContext = createContext(null);

export const Select = ({ children, value, onValueChange }) => {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      <div>{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export const SelectContent = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export const SelectItem = ({ value, children }) => {
  const ctx = useContext(SelectContext);
  return (
    <button type="button" onClick={() => ctx.onValueChange && ctx.onValueChange(value)}>
      {children}
    </button>
  );
};

export const SelectValue = ({ placeholder }) => {
  const ctx = useContext(SelectContext);
  const current = ctx?.value;
  return <span>{current || placeholder || ''}</span>;
};

export default Select;
