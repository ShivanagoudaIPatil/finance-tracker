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
  <div className="app">
    <Expense expenses={expenses} setExpenses={setExpenses} />

    <TotalRecived
      totalRecived={totalRecived}
      setTotalRecived={setTotalRecived}
    />

    <div className="totals">
      <TotalSpent expenses={expenses} />
      <TotalBalance
        expenses={expenses}
        totalRecived={totalRecived}
      />
    </div>
  </div>
);
}

export default App;
