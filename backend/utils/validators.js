export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (pwd) =>
  /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/.test(pwd);

export const isValidName = (name) =>
  typeof name === "string" && name.length >= 3 && name.length <= 60;

export const isValidAddress = (addr) =>
  typeof addr === "string" && addr.length <= 400;

export const clampRating = (n) => Math.max(1, Math.min(5, Number(n) || 0));

export const pickSort = (allowed, sortBy, order = "asc") => {
  if (!allowed.includes(sortBy)) return undefined;
  const dir = ["asc", "desc"].includes(String(order).toLowerCase()) ? order : "asc";
  return { [sortBy]: dir };
};
