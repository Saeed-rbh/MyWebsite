import { useMemo } from "react";
import useBaseStyle from "./useBaseStyle";
import activeHover from "./activeHover";
import useHeightAndTop from "./useHeightAndTop";
import {
  useSecondTextStyle,
  useTextStyle,
  useMoreStyle,
  useTitleStyle,
} from "./otherStyles";

export function useStyles(toggle, data, hover, ChildRefs, stages) {
  const { heights, tops, widths } = useHeightAndTop(ChildRefs, data, toggle);

  const { isActive, isHovered, otherActive } = useMemo(
    () => activeHover(data.title, toggle, hover),
    [data, toggle, hover]
  );

  const textSpring = useTextStyle(isActive, stages);

  const baseSpring = useBaseStyle(
    data,
    isActive,
    isHovered,
    otherActive,
    heights,
    tops,
    widths,
    stages
  );

  const SecondTextStyle = useSecondTextStyle(isActive, stages);
  const TitleStyle = useTitleStyle(isActive, stages);
  const MoreStyle = useMoreStyle(isActive, data.fixed, stages);

  return useMemo(
    () => ({
      text: textSpring,
      base: baseSpring,
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
      heights.second,
    ]
  );
}
