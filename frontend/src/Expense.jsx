import { useState, useEffect } from "react";

export default function Expense({ expenses, setExpenses }) {

  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");

  // load expenses from backend
  useEffect(() => {
    fetch("http://localhost:5000/expenses")
      .then(res => res.json())
      .then(data => setExpenses(data));
  }, []);

  // add expense to backend
  async function addNewExpense() {
    if (!newTitle.trim() || !newAmount) return;

    const expense = {
      title: newTitle,
      amount: Number(newAmount)
    };

    const res = await fetch("http://localhost:5000/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense)
    });

    const saved = await res.json();
    setExpenses(prev => [...prev, saved]);

    setNewTitle("");
    setNewAmount("");
  }

  // delete from backend
  async function deleteExpense(id) {
    await fetch(`http://localhost:5000/expenses/${id}`, {
      method: "DELETE"
    });

    setExpenses(prev => prev.filter(exp => exp._id !== id));
  }

  function startEdit(exp) {
    setEditingId(exp._id);
    setEditTitle(exp.title);
    setEditAmount(exp.amount);
  }

  function saveEdit(id) {
    setExpenses(prev =>
      prev.map(exp =>
        exp._id === id
          ? { ...exp, title: editTitle, amount: Number(editAmount) }
          : exp
      )
    );

    setEditingId(null);
  }

  return (
    <>
      <h3>Add new Expense</h3>

      <input
        placeholder="Expense name"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
      />

      <input
        placeholder="Amount"
        type="number"
        value={newAmount}
        onChange={e => setNewAmount(e.target.value)}
      />

      <button onClick={addNewExpense}>Add Expense</button>

      <ul>
        {expenses.map(exp => (
          <li key={exp._id}>
            {editingId === exp._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                />
                <input
                  type="number"
                  value={editAmount}
                  onChange={e => setEditAmount(e.target.value)}
                />
                <button onClick={() => saveEdit(exp._id)}>Save</button>
              </>
            ) : (
              <>
                {exp.title} — ₹{exp.amount}
                <button onClick={() => startEdit(exp)}>Edit</button>
                <button onClick={() => deleteExpense(exp._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
