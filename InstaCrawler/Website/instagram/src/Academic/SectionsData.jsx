const MARGIN_TOP = 15;
const SectionsData = (sectionProperties, ID, ID_Height) => {
  // Section properties with added IDs

  const ResetPoint = 4;
  const sequence = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // Change this sequence to reorder sections

  let previousTop = 0; // Initial top position for the first section
  sequence.forEach((seqId, index) => {
    const section = sectionProperties.find((p) => p.id === seqId);

    if (section.id === ID) {
      section.size = [ID_Height, section.size[1]];
    }

    section.top =
      index === 0 || index === ResetPoint ? 0 : previousTop + MARGIN_TOP;
    previousTop =
      section.top + section.size[0] + section.padding[0] + section.padding[2];
  });

  const Data = sequence.map((seqId) => {
    const section = sectionProperties.find((p) => p.id === seqId);
    return {
      ...section,
      height: section.size[0],
      width: section.size[1],
      dir: seqId <= ResetPoint ? "L" : "R",
    };
  });

  return Data;
};

export default SectionsData;
