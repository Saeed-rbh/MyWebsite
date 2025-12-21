import { useMemo } from "react";

/**
 * Custom hook to determine the cursor style based on the active state.
 *
 * @param {boolean} isActive - Determines if the cursor style should be 'none' or 'pointer'.
 * @returns {string} The cursor style.
 */
const useCursorStyle = (isActive) =>
  useMemo(() => (isActive ? "none" : "pointer"), [isActive]);

export default useCursorStyle;
