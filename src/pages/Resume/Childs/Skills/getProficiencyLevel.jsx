export function getProficiencyLevel(percentage) {
  const proficiencyMap = {
    Beginner: 30,
    Intermediate: 60,
    Advanced: 75,
    Expert: 90,
  };

  return proficiencyMap[percentage] || 0;
}
