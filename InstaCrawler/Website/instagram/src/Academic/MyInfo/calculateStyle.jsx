export const calculateStyle = (type, Data) => {
  const { width, height } = Data;
  const baseWidth = type === "affiliation" ? (width / 5) * 3 : width;
  const marginTop = type === "affiliation" ? 20 : 0;
  return {
    width: `${(baseWidth / height) * height}px`,
    height: `${height}px`,
    position: "relative",
    marginTop: `${marginTop}px`,
  };
};
