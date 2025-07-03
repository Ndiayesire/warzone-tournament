export const calculatePoints = (kills: number, position: number): number => {
  if (position === 1) {
    return Math.round(kills * 1.6);
  } else if (position >= 2 && position <= 5) {
    return Math.round(kills * 1.4);
  } else if (position >= 6 && position <= 10) {
    return Math.round(kills * 1.2);
  } else {
    return kills;
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};