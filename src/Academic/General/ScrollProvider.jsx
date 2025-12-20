import React, { createContext, useContext } from "react";

const ScrollContext = createContext(0);

export const useScroll = () => useContext(ScrollContext);

export const ScrollProvider = ({ children, scrollPosition }) => (
  <ScrollContext.Provider value={scrollPosition}>
    {children}
  </ScrollContext.Provider>
);
