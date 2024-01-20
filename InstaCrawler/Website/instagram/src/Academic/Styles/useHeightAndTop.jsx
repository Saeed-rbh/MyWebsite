import { useEffect, useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import useElementSize from "../Styles/useElementSize";
import elementTopCalculator from "./elementTopCalculator";
import elementHeightCalculator from "./elementHeightCalculator";
import elementWidthCalculator from "./elementWidthCalculator"; // Assuming this is an external utility function

const useHeightAndTop = (childRefs, data) => {
  const mainElementSize = useElementSize("MoreInfoAcademic");
  const { stages, toggle, hover, scollableRef } = useSelector(
    (state) => state.data
  );

  const isClicked = useMemo(
    () => toggle[0] && toggle[1] === data.title,
    [toggle, data.title]
  );
  const isHovered = useMemo(
    () => hover[0] && hover[1] === data.title,
    [hover, data.title]
  );

  const calculateHeights = (childsHeight) =>
    elementHeightCalculator({
      childRefs,
      mainElementSize,
      data,
      stages,
      childsHeight,
    });

  const calculateTops = (heights) =>
    elementTopCalculator({ heights, mainElementSize, data, scollableRef });

  const calculateWidthOffset = () => {
    const PADDING_OFFSET_FACTOR = 50;
    const [, leftPadding, , rightPadding] = data.padding;
    const widthOffset = leftPadding + rightPadding - PADDING_OFFSET_FACTOR;
    return widthOffset;
  };

  const calculatedWidths = () =>
    elementWidthCalculator({
      elementSizeWidth: mainElementSize.width,
      padding: data.padding,
      stages: stages,
      iniRL: data.iniRL,
    }).width;

  const calcZIndex = () => {
    const ACTIVE_Z_INDEX = "20";
    const DEFAULT_Z_INDEX = "10";
    const zIndexValue =
      isClicked || isHovered ? ACTIVE_Z_INDEX : DEFAULT_Z_INDEX;
    return zIndexValue;
  };

  const calcChildRef = () => {
    if (childRefs) {
      return childRefs.current.reduce(
        (total, ref) => total + (ref.current ? ref.current.clientHeight : 0),
        0
      );
    } else {
      return 0;
    }
  };

  const [childsHeight, setChildsHeight] = useState(() => calcChildRef());
  const [heights, setHeights] = useState(() => calculateHeights(childsHeight));
  const [tops, setTops] = useState(() => calculateTops(heights));
  const [widthOffset, setWidthOffset] = useState(() => calculateWidthOffset());
  const [zIndex, setZIndez] = useState(() => calcZIndex());
  const [widths, setWidths] = useState(() => calculatedWidths());

  useEffect(() => {
    const newChildsHeight = calcChildRef();
    if (newChildsHeight > 0 && mainElementSize.height > 0) {
      const newHeights = calculateHeights(newChildsHeight);

      setChildsHeight(newChildsHeight);
      setHeights(newHeights);
      setTops(calculateTops(newHeights));
    }
  }, [mainElementSize, data, stages]);

  useEffect(() => {
    setWidthOffset(calculateWidthOffset);
  }, [childRefs, mainElementSize, data, stages]);

  const scrollEndTimeoutRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current);
      }
      scrollEndTimeoutRef.current = setTimeout(() => {
        if (scollableRef.current) {
          if (
            data.top <
              scollableRef.current.scrollTop + mainElementSize.height &&
            data.top + heights.NoAction > scollableRef.current.scrollTop
          ) {
            setTops(calculateTops(heights));
          }
        }
      }, 150);
    };

    if (scollableRef && scollableRef.current) {
      scollableRef.current.addEventListener("scroll", handleScroll);
    }
    setTops(calculateTops(heights, mainElementSize, data, 0, isClicked));
    return () => {
      if (scollableRef && scollableRef.current) {
        scollableRef.current.removeEventListener("scroll", handleScroll);
      }
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current);
      }
    };
  }, [scollableRef, mainElementSize, data]);

  useEffect(() => {
    setZIndez(calcZIndex);
  }, [isClicked, isHovered]);

  useEffect(() => {
    if (mainElementSize.width > 0) {
      const newWidth = calculatedWidths();
      setWidths(newWidth);
    }
  }, [mainElementSize, widthOffset, stages, data]);

  return { zIndex, heights, tops, widths };
};

export default useHeightAndTop;
