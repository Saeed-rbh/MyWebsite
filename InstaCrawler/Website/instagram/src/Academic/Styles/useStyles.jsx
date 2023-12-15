import { useMemo } from "react";
import useCursorStyle from "./useCursorStyle";
import useTitleStyle from "./useTitleStyle";
import useBaseStyle from "./useBaseStyle";
import useGeneralData from "./useGeneralData";
import useActiveHover from "./useActiveHover";
import useTextStyle from "./useTextStyle";
import useCalculateHeights from "./useCalculateHeights";

export function useStyles(
  closeOpen,
  data,
  mouseHover,
  ChildRefs,
  ParentRef,
  mainElementSize,
  setChangedHeight,
  TextRef
) {
  const { heights, tops } = useCalculateHeights({
    ParentRef,
    ChildRefs,
    mainElementSize,
    data,
    setChangedHeight,
  });

  const { isActive, isHovered } = useActiveHover(data, closeOpen, mouseHover);
  const { widthOffset, zIndexValue } = useGeneralData(
    data,
    closeOpen,
    mouseHover
  );

  const textSpring = useTextStyle(data, isActive, TextRef, ParentRef);

  const baseSpring = useBaseStyle(
    data,
    isActive,
    isHovered,
    mainElementSize,
    widthOffset,
    heights,
    tops
  );
  const cursorStyle = useCursorStyle(isActive);

  const TitleStyle = useTitleStyle(isActive);

  return useMemo(
    () => ({
      text: textSpring,
      base: {
        ...baseSpring,
        cursor: cursorStyle,
        zIndex: zIndexValue,
      },
      title: TitleStyle,
      height: heights.second,
    }),
    [
      textSpring,
      baseSpring,
      TitleStyle,
      cursorStyle,
      zIndexValue,
      heights.second,
    ]
  );
}
