export default function TotalSpent({ expenses }) {
  const total = expenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  return <p>Total Spent: ₹{total}</p>;
}
