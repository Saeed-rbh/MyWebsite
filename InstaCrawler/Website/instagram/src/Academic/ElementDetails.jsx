import { useState, useEffect } from "react";

export function ElementDetails(ref) {
  const [ElementSize, setSize] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const { clientHeight, clientWidth } = ref.current;
      const { top } = ref.current.getBoundingClientRect();
      setSize({ width: clientWidth, height: clientHeight, top });
    }
  }, [ref]);

  return ElementSize.height > 0 ? ElementSize : 0;
}
