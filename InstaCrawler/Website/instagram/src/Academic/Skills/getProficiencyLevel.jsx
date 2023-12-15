export function getProficiencyLevel(percentage) {
  if (percentage === "Beginner") {
    return 30;
  } else if (percentage === "Intermediate") {
    return 60;
  } else if (percentage === "Expert") {
    return 90;
  }
}
