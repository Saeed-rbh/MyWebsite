function calculateLines(fontSize, text) {
  const screenWidth = window.innerWidth;
  const characterWidth = fontSize * 0.6;
  const charactersPerLine = Math.floor(screenWidth / characterWidth);
  const lines = [];
  for (let i = 0; i < text.length; i += charactersPerLine) {
    lines.push(text.slice(i, i + charactersPerLine));
  }
  const numberOfLines = lines.length;

  return numberOfLines;
}

const SectionsData = (data, MainElementSize, sequence, Stages) => {
  const MARGIN_TOP = 10;

  let previousTop = 0;
  let resetTop = 0;
  let previousIniRL = 0;
  let LeftRight = true;

  const calculateIniRL = (top, height) => {
    return Stages[2] || Stages[3]
      ? previousIniRL
      : top + height > MainElementSize.height
      ? previousIniRL + 1
      : previousIniRL;
  };

  const sortedSectionProperties = [...data].sort(
    (a, b) => sequence.indexOf(a.id) - sequence.indexOf(b.id)
  );

  return sortedSectionProperties.map((section) => {
    const calculateException = (stageIndex, sectionId, value) => {
      return Stages[stageIndex] && section.id === sectionId ? value : 0;
    };

    const exceptions = {
      exception_0T: [{ h: 2, t: 0, v: 10 }],
      // exception_1H: [
      //   { h: 1, t: 0, v: 10 },
      //   { h: 1, t: 3, v: -20 },
      // ],
      // exception_1T: [
      //   { h: 1, t: 1, v: 10 },
      //   { h: 1, t: 8, v: 3 },
      //   { h: 1, t: 7, v: -20 },
      // ],
      // exception_2H: [
      //   { h: 0, t: 3, v: 50 },
      //   { h: 0, t: 5, v: 5 },
      // ],
      // exception_2T: [{ h: 0, t: 5, v: 50 }],
      exception_3H: [
        { h: 2, t: 4, v: 45 },
        { h: 2, t: 5, v: 25 },
        { h: 2, t: 3, v: 20 },
      ],
      exception_3T: [
        { h: 2, t: 2, v: 45 },
        { h: 2, t: 3, v: 25 },
        { h: 2, t: 8, v: 20 },
      ],
      exception_4H: [
        { h: 3, t: 5, v: 25 },
        { h: 3, t: 3, v: 20 },
      ],
      exception_4T: [
        { h: 3, t: 0, v: 10 },
        { h: 3, t: 3, v: 25 },
        { h: 3, t: 8, v: 20 },
      ],
    };

    const calculateTotal = (exceptionArray) =>
      exceptionArray.reduce(
        (total, { h, t, v }) => total + calculateException(h, t, v),
        0
      );

    let textHeight = 0;
    if (section.isCalc) {
      const fontSize = 11;
      const LineHeight = 16;
      const text = section.list[0][Object.keys(section.list[0])[1]];
      textHeight = Math.max(
        calculateLines(fontSize, text) * LineHeight,
        Stages[2] ? 40 : Stages[3] ? 20 : 0
      );
      if (section.size[0] === 0) {
        section.size[0] = section.size[0] + textHeight;
      }
    }

    const exception_H =
      calculateTotal([
        // ...exceptions.exception_1H,
        // ...exceptions.exception_2H,
        ...exceptions.exception_3H,
        ...exceptions.exception_4H,
      ]) + textHeight;

    const exception_T = calculateTotal([
      ...exceptions.exception_0T,
      // ...exceptions.exception_1T,
      // ...exceptions.exception_2T,
      ...exceptions.exception_3T,
      ...exceptions.exception_4T,
    ]);
    const currentIniRL = calculateIniRL(previousTop, section.size[0]);

    if (currentIniRL > previousIniRL) {
      resetTop = sequence.indexOf(section.id);
      previousIniRL = currentIniRL;
      previousTop = 0;
    }

    const sequenceId = sequence.indexOf(section.id);
    const marginAdd = section.fixed ? 5 : 0;
    const topValue =
      sequence.indexOf(section.id) === resetTop
        ? previousTop + marginAdd + exception_T
        : previousTop + marginAdd + MARGIN_TOP + exception_T;

    let widthSplit = false;
    let direction = "center";
    if (sequenceId > sequence.length - 3) {
      widthSplit = true;
      if (LeftRight) {
        direction = "left";
        LeftRight = false;
      } else {
        direction = "right";
        LeftRight = true;
      }
    } else {
      previousTop = topValue + section.size[0];
      if (textHeight > 0) {
        previousTop = previousTop + exception_H;
      }
    }

    return {
      ...section,
      height: section.size[0] + exception_H,
      width: section.size[1],
      top: section.top,
      iniRL: currentIniRL,
      seqId: sequenceId,
      widthSplit: widthSplit,
      direction: direction,
    };
  });
};

export default SectionsData;
