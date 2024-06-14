export const fetchTransactions = async () => {
  const response = await fetch("/transactions_sorted.json");
  const data = await response.json();
  return data;
};
