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
      Opened: isOpenHeightExceeding ? mainElementSize.height : childsHeight,
      NoAction: data.widthSplit ? 100 : data.height,
      Hovered: data.height + HEIGHT_OFFSETS.Hovered,
    };
  }
  return { Opened: 0, NoAction: 0, Hovered: 0 };
};

export default elementHeightCalculator;
