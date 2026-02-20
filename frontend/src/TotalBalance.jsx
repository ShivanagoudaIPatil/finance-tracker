export default function TotalBalance({
  expenses,
  totalRecived
}) {
  const totalSpent = expenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const balance = totalRecived - totalSpent;

  return (
    <div className={`summary-card balance ${balance < 0 ? "negative" : "positive"}`}>
      <span>Total Balance</span>
      <strong>₹{balance}</strong>
    </div>
  );
}
