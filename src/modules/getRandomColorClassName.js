export const getRandomColorClassName = () => {
  const COLORS = ["red", "yellow", "green", "blue"];

  const n = ~~(Math.random() * COLORS.length);
  return COLORS[n];
};
