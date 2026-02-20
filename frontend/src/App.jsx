import { useState } from "react";
import Expense from "./Expense";
import TotalBalance from "./TotalBalance";
import TotalRecived from "./TotalRecived";
import TotalSpent from "./TotalSpent";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([
    { id: Date.now(), title: "Food", amount: 120 }
  ]);

  const [totalRecived, setTotalRecived] = useState(0);

  return (
  <div className="app-shell">
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p>Track expenses, income, and your balance</p>
      </header>

      <section className="card">
        <Expense expenses={expenses} setExpenses={setExpenses} />
      </section>

      <section className="card">
        <TotalRecived
          totalRecived={totalRecived}
          setTotalRecived={setTotalRecived}
        />
      </section>

      <div className="summary-grid">
        <TotalSpent expenses={expenses} />
        <TotalBalance
          expenses={expenses}
          totalRecived={totalRecived}
        />
      </div>
    </div>
  </div>
);
}

export default App;
