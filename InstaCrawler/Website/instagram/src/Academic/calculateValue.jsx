const MAX_Height = 750;
const MIN_Height = 550;
const MAX_Width = 2000;
const MIN_Width = 1300;

export const calculateValue = (Dir, current, Top, Down) => {
  let Max, Min;

  if (Dir === "H") {
    Max = MAX_Height;
    Min = MIN_Height;
  } else if (Dir === "W") {
    Max = MAX_Width;
    Min = MIN_Width;
  }

  if (current <= Min) {
    return Down;
  } else if (current > Min && current <= Max) {
    return Down + ((Top - Down) * (current - Min)) / (Max - Min);
  } else {
    return Top;
  }
};
