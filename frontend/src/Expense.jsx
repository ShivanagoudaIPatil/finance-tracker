import { useState, useEffect } from "react";

export default function Expense({ token, onUnauthorized, expenses, setExpenses }) {

  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");

  // load expenses from backend
  useEffect(() => {
    fetch("http://localhost:5000/expenses", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        const data = await res.json();

        if (res.status === 401) {
          onUnauthorized();
          return [];
        }

        return Array.isArray(data) ? data : [];
      })
      .then((data) => setExpenses(data));
  }, [token, onUnauthorized, setExpenses]);

  // add expense to backend
  async function addNewExpense() {
    if (!newTitle.trim() || !newAmount) return;

    const expense = {
      title: newTitle,
      amount: Number(newAmount)
    };

    const res = await fetch("http://localhost:5000/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(expense)
    });

    if (res.status === 401) {
      onUnauthorized();
      return;
    }

    const saved = await res.json();
    if (!res.ok) return;
    setExpenses(prev => [...prev, saved]);

    setNewTitle("");
    setNewAmount("");
  }

  function handleAddExpenseKeyDown(event) {
    if (event.key === "Enter") {
      addNewExpense();
    }
  }

  // delete from backend
  async function deleteExpense(id) {
    const res = await fetch(`http://localhost:5000/expenses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 401) {
      onUnauthorized();
      return;
    }

    if (!res.ok) return;

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
    <div className="expense-section">
      <h3 className="section-title">Add New Expense</h3>

      <div className="expense-form">
        <input
          placeholder="Expense name"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={handleAddExpenseKeyDown}
        />

        <input
          placeholder="Amount"
          type="number"
          value={newAmount}
          onChange={e => setNewAmount(e.target.value)}
          onKeyDown={handleAddExpenseKeyDown}
        />

        <button onClick={addNewExpense}>Add Expense</button>
      </div>

      <ul className="expense-list">
        {expenses.map(exp => (
          <li key={exp._id} className="expense-item">
            {editingId === exp._id ? (
              <>
                <div className="edit-fields">
                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                  />
                  <input
                    type="number"
                    value={editAmount}
                    onChange={e => setEditAmount(e.target.value)}
                  />
                </div>
                <div className="item-actions">
                  <button onClick={() => saveEdit(exp._id)}>Save</button>
                </div>
              </>
            ) : (
              <>
                <div className="item-main">
                  <span className="item-title">{exp.title}</span>
                  <span className="item-amount">₹{exp.amount}</span>
                </div>
                <div className="item-actions">
                  <button onClick={() => startEdit(exp)}>Edit</button>
                  <button className="danger" onClick={() => deleteExpense(exp._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
