import { useEffect } from "react";

const useDelayedClickEffect = (setter, value, delay) => {
  useEffect(() => {
    let timer;

    if (value) {
      timer = setTimeout(() => {
        setter(value);
      }, delay);
    } else {
      setter(value);
    }

    return () => clearTimeout(timer);
  }, [setter, value, delay]);
};

export default useDelayedClickEffect;
