import { useEffect, useState } from "react";

const useScrollOpacity = (isResumeClicked) => {
  const [scrollOpacity, setScrollOpacity] = useState(false);

  useEffect(() => {
    if (!isResumeClicked || window.location.pathname !== "/AcademicCV") return;

    const scrollableDiv = document.getElementById("AcademicCV-M");

    if (!scrollableDiv) return;

    const handleScroll = () => {
      const scrollPosition = scrollableDiv.scrollTop;
      const maxScroll = scrollableDiv.scrollHeight - scrollableDiv.clientHeight;
      setScrollOpacity(scrollPosition / maxScroll + 1 > 0.1);
    };

    scrollableDiv.addEventListener("scroll", handleScroll);

    return () => scrollableDiv.removeEventListener("scroll", handleScroll);
  }, [isResumeClicked]);

  return scrollOpacity;
};

export default useScrollOpacity;
