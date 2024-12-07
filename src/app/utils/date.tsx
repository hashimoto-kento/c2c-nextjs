export const ensureDate = (date: Date | string | number): Date => {
  if (date instanceof Date) return date;
  return new Date(date);
};