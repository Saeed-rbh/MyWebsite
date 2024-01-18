import { useMemo } from "react";
import useCursorStyle from "./useCursorStyle";
import useTitleStyle from "./useTitleStyle";
import useBaseStyle from "./useBaseStyle";
import activeHover from "./activeHover";
import useTextStyle from "./useTextStyle";
import useMoreStyle from "./useMoreStyle";
import useSecondTextStyle from "./useSecondTextStyle";
import useHeightAndTop from "./useHeightAndTop";

export function useStyles(toggle, data, hover, ChildRefs, stages) {
  const { zIndex, widthOffset, heights, tops } = useHeightAndTop(
    ChildRefs,
    data
  );

  const { isActive, isHovered, otherHovered } = useMemo(
    () => activeHover(data.title, toggle, hover),
    [data, toggle, hover]
  );

  const textSpring = useTextStyle(isActive, stages);

  const baseSpring = useBaseStyle(
    data,
    isActive,
    isHovered,
    otherHovered,
    widthOffset,
    heights,
    tops,
    stages
  );

  const cursorStyle = useCursorStyle(isActive);
  const SecondTextStyle = useSecondTextStyle(isActive, stages);

  const TitleStyle = useTitleStyle(isActive, stages);
  const MoreStyle = useMoreStyle(isActive, data.fixed, stages);

  return useMemo(
    () => ({
      text: textSpring,
      base: {
        ...baseSpring,
        cursor: data.fixed ? "none" : cursorStyle,
        zIndex: zIndex,
      },
      title: TitleStyle,
      More: MoreStyle,
      height: heights.second,
      secondText: SecondTextStyle,
    }),
    [
      textSpring,
      baseSpring,
      SecondTextStyle,
      TitleStyle,
      MoreStyle,
      cursorStyle,
      zIndex,
      heights.second,
      data.fixed,
    ]
  );
}
