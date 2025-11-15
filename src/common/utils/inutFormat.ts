const formatCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
  const input = e.target;
  const cursorPosition = input.selectionStart || 0;
  const oldValue = input.value;

  const value = oldValue.replace(/\D/g, '');
  const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const oldCommaCount = (oldValue.match(/,/g) || []).length;
  const newCommaCount = (formattedValue.match(/,/g) || []).length;
  const commasDiff = newCommaCount - oldCommaCount;

  input.value = formattedValue;

  const newCursorPos = Math.max(0, cursorPosition + commasDiff);

  setTimeout(() => {
    input.setSelectionRange(newCursorPos, newCursorPos);
  }, 0);

  return formattedValue;
};

const formatCurrencyDisplay = (amount: string | number) => {
  if (!amount && amount !== 0) return "0 ₫";
  const numStr = amount.toString().replace(/\D/g, '');
  if (numStr === "") return "0 ₫";
  const formatted = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${formatted} ₫`;
};

const getNumericValue = (formattedString: string): number => {
  const numeric = formattedString.replace(/\D/g, '');
  return parseInt(numeric, 10) || 0;
};

export {
  formatCurrency,
  formatCurrencyDisplay,
  getNumericValue
};
