
export const toPersianDigits = (n: number | string | undefined | null): string => {
  if (n === undefined || n === null) return '';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
};

export const formatPrice = (price: number): string => {
  return toPersianDigits(price.toLocaleString());
};
