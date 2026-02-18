export default function TotalBalance({
  expenses,
  totalRecived
}) {
  const totalSpent = expenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const balance = totalRecived - totalSpent;

  return <p>Total Balance: ₹{balance}</p>;
}
