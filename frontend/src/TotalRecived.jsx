import { useState, useEffect } from "react";

export default function TotalRecived({
  totalRecived,
  setTotalRecived
}) {
  const [input, setInput] = useState("");

  // load received amount from backend on refresh
  useEffect(() => {
    fetch("http://localhost:5000/received")
      .then(res => res.json())
      .then(data => setTotalRecived(data.totalReceived));
  }, []);

  // save to backend
  async function addAmount() {
    if (!input) return;

    const res = await fetch("http://localhost:5000/received", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(input) })
    });

    const data = await res.json();
    setTotalRecived(data.totalReceived);
    setInput("");
  }

  return (
    <div className="income-section">
      <h3 className="section-title">Amount Received</h3>

      <div className="income-form">
        <input
          type="number"
          placeholder="Enter Amount Received"
          value={input}
          onChange={e => setInput(e.target.value)}
        />

        <button onClick={addAmount}>
          Add Received Amount
        </button>
      </div>

      <p className="income-total">Total Received: ₹{totalRecived}</p>
    </div>
  );
}
