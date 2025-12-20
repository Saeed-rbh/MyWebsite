const HEIGHT_OFFSETS = {
  Opened: 0,
  NoAction: 5,
  Hovered: 60,
  full: 50,
};

const elementTopCalculator = ({
  heights,
  mainElementSize,
  data,
  scollableRef,
}) => {
  const elementHeight = heights.Opened;
  const StageTop = data.top;
  const scrolled = scollableRef.current ? scollableRef.current.scrollTop : 0;
  const mainElementHeight = mainElementSize.height;

  const botCond =
    elementHeight + StageTop + HEIGHT_OFFSETS.full <
    mainElementHeight + scrolled;
  const topCond = StageTop - HEIGHT_OFFSETS.full > scrolled;
  const totTopCond = StageTop > scrolled + mainElementHeight;
  const filledCond = elementHeight + HEIGHT_OFFSETS.full >= mainElementHeight;

  const topValues = [
    scrolled,
    mainElementHeight + scrolled - elementHeight - 2 * HEIGHT_OFFSETS.full,
    StageTop - HEIGHT_OFFSETS.full,
    StageTop - elementHeight / 2 - HEIGHT_OFFSETS.full,
    scrolled,
  ];

  return {
    Opened: !filledCond
      ? !totTopCond
        ? !topCond
          ? topValues[0]
          : !botCond
          ? topValues[1]
          : topValues[2]
        : topValues[3]
      : topValues[4],
    NoAction: data.top,
    Hovered:
      data.top === 0
        ? data.top + HEIGHT_OFFSETS.Hovered / 5
        : data.top - data.top / 7,
  };
};

export default elementTopCalculator;
