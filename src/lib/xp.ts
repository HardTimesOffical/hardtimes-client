const START_XP = 100; // Сколько нужно для 1-го уровня
const STEP = 300;     // На сколько увеличивается планка каждый раз

export const getPlayerStats = (totalXp: number) => {
  // Формула для арифметической прогрессии:
  // totalXp = START_XP * n + STEP * (n * (n - 1) / 2)
  // Но проще и надежнее для производительности рассчитать циклом, 
  // так как уровней обычно не миллионы.

  let level = 0;
  let xpRequiredForNext = START_XP;
  let accumulatedXp = 0;

  while (totalXp >= accumulatedXp + xpRequiredForNext) {
    accumulatedXp += xpRequiredForNext;
    level++;
    xpRequiredForNext += STEP; // Планка растет: 100, 400, 700...
  }

  const xpInCurrentLevel = totalXp - accumulatedXp;
  const progress = Math.floor((xpInCurrentLevel / xpRequiredForNext) * 100);

  return {
    level,
    xpInCurrentLevel,
    xpRequiredForNext,
    progress,
    totalXp
  };
};