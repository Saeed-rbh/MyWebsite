import { useSpring, easings } from "react-spring";
import { useState, useEffect } from "react";

export function useCloseOpenStyles(
  CloseOpen,
  Data,
  MouseHover,
  MainElementSize
) {
  const widthoffser = Data.padding[1] + Data.padding[3];
  const [right, setRight] = useState(Data.iniRL);
  const [ElementWidth, setElementWidth] = useState(Data.width);

  useEffect(() => {
    if (MainElementSize.width > 0) {
      setElementWidth(
        ((100 - Data.iniRL) / 100) * MainElementSize.width - widthoffser
      );
      if (ElementWidth < Data.width) {
        setRight(0);
        setElementWidth(MainElementSize.width - widthoffser);
      } else if (ElementWidth > Data.width) {
        setRight(Data.iniRL);
        setElementWidth(
          ((100 - Data.iniRL) / 100) * MainElementSize.width - widthoffser
        );
      }
    }
  }, [MainElementSize.width]);

  const isActive = CloseOpen[1] === Data.title && CloseOpen[0];
  const isHovered = MouseHover[1] === Data.title && MouseHover[0];
  const TitleLength = Data.title.split("").length / 2;

  const textSpring = useSpring({
    background: "linear-gradient(to right, #d49d8194 0%, #ff550063 100%)",
    webkitBackgroundClip: "text",
    fontSize: isActive
      ? `${(ElementWidth / TitleLength) * 0.9}px`
      : `${(ElementWidth / TitleLength) * 1.05}px`,
    lineHeight: isActive
      ? `${(ElementWidth / TitleLength) * 0.8}px`
      : `${(ElementWidth / TitleLength) * 0.95}px`,
    opacity: isActive ? 0.5 : 0.2,
  });

  const qualiListSpring = useSpring({
    marginBottom: isActive ? "10px" : "50px",
    easing: easings.easeOutCubic,
  });

  const baseSpring = useSpring({
    padding: `${Data.padding[0]}px ${Data.padding[1]}px ${
      isActive ? 40 : Data.padding[2]
    }px ${Data.padding[3]}px`,
    backgroundColor: Data.background,
    cursor: isActive ? "default" : "pointer",
    width: `${ElementWidth}px`,
    minWidth: Data.width,
    right: `${right}%`,
    height: isActive ? "400px" : isHovered ? "190px" : `${Data.height}px`,
    top: isActive
      ? `${MainElementSize.height / 2.5 - Data.height}px`
      : isHovered
      ? `${Data.top - (MainElementSize.height / 2.5 - Data.height) / 2.5}px`
      : `${Data.top}px`,
    easing: easings.easeOutCubic,
  });

  const qualiSpring = useSpring({
    top: isActive ? "80px" : isHovered ? "70px" : "55px",
    easing: easings.easeOutCubic,
  });

  return {
    text: textSpring,
    qualiList: qualiListSpring,
    base: {
      ...baseSpring,
      zIndex:
        MouseHover[1] === Data.title && CloseOpen[0]
          ? "20"
          : MouseHover[1] === Data.title && MouseHover[0]
          ? "20"
          : "10",
    },
    quali: qualiSpring,
  };
}
