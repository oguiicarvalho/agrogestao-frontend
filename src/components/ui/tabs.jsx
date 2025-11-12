import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext(null);

export const Tabs = ({ children, defaultValue, ...props }) => {
  const [value, setValue] = useState(defaultValue || null);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = '', style = {}, ...props }) => (
  <div className={className} style={style} {...props}>{children}</div>
);

export const TabsTrigger = ({ value, children, className = '', style = {}, ...props }) => {
  const ctx = useContext(TabsContext);
  return (
    <button type="button" onClick={() => ctx.setValue(value)} className={className} style={style} {...props}>
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, ...props }) => {
  const ctx = useContext(TabsContext);
  return ctx.value === value ? <div {...props}>{children}</div> : null;
};

export default Tabs;
