export const isJSON = (val) => {
  if (typeof val === 'string') {
    try {
      const obj = JSON.parse(val);
      if (obj && typeof obj === 'object') {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
};

export const isObject = (val) => {
  return val && typeof val === 'object';
};
