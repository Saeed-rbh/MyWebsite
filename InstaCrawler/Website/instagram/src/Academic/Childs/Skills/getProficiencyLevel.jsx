export function getProficiencyLevel(percentage) {
  const proficiencyMap = {
    Beginner: 30,
    Intermediate: 60,
    Expert: 90,
  };

  return proficiencyMap[percentage] || 0;
}
