import React, { createContext, useState } from "react";

export const GrapheneContext = createContext();

export const GrapheneProvider = ({ children }) => {
  const [visible, setVisible] = useState(true);

  return (
    <GrapheneContext.Provider value={{ visible, setVisible }}>
      {children}
    </GrapheneContext.Provider>
  );
};
