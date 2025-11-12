import React, { createContext, useContext, useState } from 'react';

const DialogContext = createContext(null);

export const Dialog = ({ children, open: controlledOpen, onOpenChange, ...props }) => {
  const [open, setOpen] = useState(false);
  const isControlled = typeof controlledOpen !== 'undefined';
  const value = isControlled ? controlledOpen : open;

  const setValue = (v) => {
    if (isControlled) {
      onOpenChange && onOpenChange(v);
    } else {
      setOpen(v);
    }
  };

  return (
    <DialogContext.Provider value={{ open: value, setOpen: setValue }}>
      <div {...props}>{children}</div>
    </DialogContext.Provider>
  );
};

export const DialogTrigger = ({ children, onClick, ...props }) => {
  const ctx = useContext(DialogContext);
  const child = React.Children.only(children);
  const handle = (e) => {
    ctx?.setOpen(true);
    onClick && onClick(e);
    if (child.props.onClick) child.props.onClick(e);
  };

  // clone child and merge props so attributes like className are preserved
  return React.cloneElement(child, { onClick: handle, ...props });
};

export const DialogContent = ({ children, className = '' }) => {
  const ctx = useContext(DialogContext);
  if (!ctx.open) return null;
  return <div className={className}>{children}</div>;
};

export const DialogHeader = ({ children, className = '' }) => <div className={className}>{children}</div>;
export const DialogTitle = ({ children, className = '' }) => <h3 className={className}>{children}</h3>;

export default Dialog;
