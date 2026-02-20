export default function TotalSpent({ expenses }) {
  const total = expenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  return (
    <div className="summary-card spent">
      <span>Total Spent</span>
      <strong>₹{total}</strong>
    </div>
  );
}
