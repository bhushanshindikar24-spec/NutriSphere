export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

export const isPositiveNumber = (val) => {
  const num = parseFloat(val);
  return !isNaN(num) && num > 0;
};

export const isNonEmpty = (val) => {
  return val != null && String(val).trim().length > 0;
};
