export const formatNetTotal = (netTotal) => {
  const floatNetTotal = parseFloat(netTotal);
  if (floatNetTotal > 10000) {
    return floatNetTotal.toFixed(0);
  } else if (floatNetTotal > 1000) {
    return floatNetTotal.toFixed(1);
  } else {
    return floatNetTotal.toFixed(2);
  }
};
