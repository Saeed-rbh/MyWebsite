import { useEffect, useState } from "react";
import gsap from "gsap";
import { useNavigate, useLocation } from "react-router-dom";

const ScrollToNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    const handleWheel = (event) => {
      if (event.deltaY > 50 && location.pathname === "/") {
        gsap.to("body", {
          duration: 0.5,
          onComplete: () => navigate("/AcademicCV"),
        });
      } else if (event.deltaY < -50 && location.pathname === "/AcademicCV") {
        gsap.to("body", {
          duration: 0.5,
          onComplete: () => navigate("/"),
        });
      }
    };

    const handleTouchStart = (event) => {
      setStartY(event.touches[0].clientY);
    };

    const handleTouchMove = (event) => {
      const endY = event.touches[0].clientY;
      if (startY - endY > 50 && location.pathname === "/") {
        gsap.to("body", {
          duration: 0.5,
          onComplete: () => navigate("/AcademicCV"),
        });
      } else if (endY - startY > 50 && location.pathname === "/AcademicCV") {
        gsap.to("body", {
          duration: 0.5,
          onComplete: () => navigate("/"),
        });
      }
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [navigate, location, startY]);

  return null;
};

export default ScrollToNavigate;
