const HEIGHT_OFFSETS = {
  Opened: 0,
  NoAction: 5,
  Hovered: 60,
  full: 50,
};

const elementHeightCalculator = ({
  childRefs,
  mainElementSize,
  data,
  childsHeight,
}) => {
  if (childRefs) {
    const isOpenHeightExceeding =
      childsHeight + HEIGHT_OFFSETS.Opened >
      mainElementSize.height - HEIGHT_OFFSETS.full;

    return {
      Opened: isOpenHeightExceeding
        ? mainElementSize.height - data.padding[0] - data.padding[2]
        : childsHeight,
      NoAction: data.height,
      Hovered: data.height + HEIGHT_OFFSETS.Hovered,
    };
  }
  return { Opened: 0, NoAction: 0, Hovered: 0 };
};

export default elementHeightCalculator;
