import { useSpring, easings } from "react-spring";
import { useEffect, useState } from "react";

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
  }, [MainElementSize]);

  const [Midheight, setMidHeight] = useState("0px");
  useEffect(() => {
    const skillLength = document.getElementsByClassName("Skill-Title").length;
    const skillElement = document.getElementsByClassName("Skill-Title")[0];
    setMidHeight(skillElement.clientHeight * skillLength + 10);
  }, [MainElementSize.height]);

  const isActive = CloseOpen[1] === Data.title && CloseOpen[0];
  const isHovered = MouseHover[1] === Data.title && MouseHover[0];
  const TitleLength = Data.title.split("").length / 2;

  const textSpring = useSpring({
    background: "linear-gradient(to right, #d49d8194 0%, #ff550063 100%)",
    webkitBackgroundClip: "text",
    fontSize: isActive
      ? `${(ElementWidth / TitleLength) * 0.85}px`
      : `${(ElementWidth / TitleLength) * 0.95}px`,
    lineHeight: isActive
      ? `${(ElementWidth / TitleLength) * 1}px`
      : `${(ElementWidth / TitleLength) * 0.8}px`,
    opacity: isActive ? 0.5 : 0.2,
  });

  const baseSpring = useSpring({
    backgroundColor: Data.background,
    padding: `${Data.padding[0]}px ${Data.padding[1]}px ${
      isActive ? 40 : Data.padding[2]
    }px ${Data.padding[3]}px`,
    width: `${ElementWidth}px`,
    minWidth: `${Data.width}px`,
    height: isActive
      ? `${Midheight}px`
      : isHovered
      ? `${Data.height + 20}px`
      : `${Data.height}px`,
    top: isActive
      ? `${(MainElementSize.height - Midheight) / 2}px`
      : isHovered
      ? `${Data.top - 20}px`
      : `${Data.top}px`,
    right: `${right}%`,
    overflow: "hidden",
    cursor: "pointer",
    easing: easings.easeOutCubic,
  });

  const titleSpring = useSpring({
    y: isActive ? 50 : 15,
    easing: easings.easeOutCubic,
  });

  const MainTitleSpring = useSpring({
    marginBottom: isActive ? 10 : 50,
    easing: easings.easeOutCubic,
  });

  return {
    text: textSpring,
    titleSpring: titleSpring,
    base: {
      ...baseSpring,
      zIndex:
        MouseHover[1] === Data.title && CloseOpen[0]
          ? "20"
          : isHovered
          ? "20"
          : "10",
    },
    MainTitleSpring: MainTitleSpring,
  };
}
