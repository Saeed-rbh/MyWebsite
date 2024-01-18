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
  stages,
  childsHeight,
}) => {
  if (childRefs) {
    const isOpenHeightExceeding =
      childsHeight + HEIGHT_OFFSETS.Opened >
      mainElementSize.height - HEIGHT_OFFSETS.full;

    const IfcalcMargin =
      stages[2] && data.IfCalc ? data.height - data.size[0] : 20;
    // if (data.name === "Qualifications") {
    //   console.log(
    //     data.name,
    //     isOpenHeightExceeding,
    //     childsHeight + HEIGHT_OFFSETS.Opened,
    //     mainElementSize.height - HEIGHT_OFFSETS.full
    //   );
    // }

    // if (data.name === "Papers") {
    //   console.log(
    //     isOpenHeightExceeding,

    //     mainElementSize.height,
    //     -data.padding[0] - data.padding[2],
    //     2 * IfcalcMargin,
    //     10,
    //     childsHeight + IfcalcMargin,
    //     isOpenHeightExceeding
    //     ? mainElementSize.height -
    //       data.padding[0] -
    //       data.padding[2] +
    //       2 * IfcalcMargin +
    //       10
    //     : childsHeight + IfcalcMargin,
    //   );
    // }

    // if (data.name === "Qualifications") {
    //   console.log(
    //     "1",
    //     data.name,
    //     isOpenHeightExceeding
    //       ? mainElementSize.height -
    //           data.padding[0] -
    //           data.padding[2] +
    //           2 * IfcalcMargin +
    //           10
    //       : childsHeight + IfcalcMargin
    //   );
    // }

    return {
      Opened: isOpenHeightExceeding
        ? mainElementSize.height -
          data.padding[0] -
          data.padding[2] +
          2 * IfcalcMargin +
          10
        : childsHeight + IfcalcMargin,
      NoAction: data.height,
      Hovered: data.height + HEIGHT_OFFSETS.Hovered,
    };
  }
  return { Opened: 0, NoAction: 0, Hovered: 0 };
};

export default elementHeightCalculator;
