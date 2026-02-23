/** Split price into integer part and decimal part (e.g. "48 652" and ",00") */
export const formatPriceParts = (price: number): { integer: string; decimal: string } => {
  const formatted = price.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const commaIndex = formatted.lastIndexOf(',');
  return {
    integer: formatted.slice(0, commaIndex),
    decimal: formatted.slice(commaIndex),
  };
};
