import { useState } from "react";
import Expense from "./Expense";
import DigitalClock from "./DigitalClock";
import TotalBalance from "./TotalBalance";
import TotalRecived from "./TotalRecived";
import TotalSpent from "./TotalSpent";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authMessage, setAuthMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const [totalRecived, setTotalRecived] = useState(0);

  async function handleAuthSubmit() {
    if (!email.trim() || !password) {
      setAuthMessage("Email and password are required");
      return;
    }

    const endpoint = isLoginMode ? "login" : "signup";

    const response = await fetch(`http://localhost:5000/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setAuthMessage(data.error || "Authentication failed");
      return;
    }

    if (!isLoginMode) {
      setAuthMessage("Signup successful. Please login.");
      setIsLoginMode(true);
      setPassword("");
      return;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);
    setAuthMessage("");
    setPassword("");
  }

  function handleAuthKeyDown(event) {
    if (event.key === "Enter") {
      handleAuthSubmit();
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setExpenses([]);
    setTotalRecived(0);
  }

  if (!token) {
    return (
      <div className="app-shell">
        <div className="app auth-app">
          <header className="app-header">
            <h1>Expense Tracker</h1>
            <p>{isLoginMode ? "Login to continue" : "Create your account"}</p>
          </header>

          <section className="card auth-card">
            <div className="auth-form">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleAuthKeyDown}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleAuthKeyDown}
              />

              <button onClick={handleAuthSubmit}>
                {isLoginMode ? "Login" : "Sign Up"}
              </button>

              <button
                className="secondary"
                onClick={() => {
                  setIsLoginMode((prev) => !prev);
                  setAuthMessage("");
                }}
              >
                {isLoginMode ? "Need an account? Sign Up" : "Already have an account? Login"}
              </button>

              {authMessage ? <p className="auth-message">{authMessage}</p> : null}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
  <div className="app-shell">
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p>Track expenses, income, and your balance</p>
        <DigitalClock />
        <button className="secondary logout-button" onClick={logout}>Logout</button>
      </header>

      <section className="card">
        <Expense
          token={token}
          onUnauthorized={logout}
          expenses={expenses}
          setExpenses={setExpenses}
        />
      </section>

      <section className="card">
        <TotalRecived
          token={token}
          onUnauthorized={logout}
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
