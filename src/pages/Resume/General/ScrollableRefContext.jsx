import React, { createContext, useContext, useRef } from "react";

// Context for sharing the scrollable div ref across components
const ScrollableRefContext = createContext(null);

export const ScrollableRefProvider = ({ children }) => {
    const scrollableRef = useRef(null);

    return (
        <ScrollableRefContext.Provider value={scrollableRef}>
            {children}
        </ScrollableRefContext.Provider>
    );
};

export const useScrollableRef = () => {
    const ref = useContext(ScrollableRefContext);
    if (ref === null) {
        // Return a fallback ref if used outside provider
        return { current: null };
    }
    return ref;
};

export default ScrollableRefContext;
