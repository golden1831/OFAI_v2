export const getNowUnix = () => {
  return Math.floor(new Date().getTime() / 1000);
};

export const removeStyleMessage = (str: string) => {
  const regex = /\*[^*]*\*/g;
  return str.replace(regex, '').trim();
};
