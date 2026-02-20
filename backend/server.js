const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const app = express();

app.use(cors());
app.use(express.json());

// connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/expenses");

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
});

// schema
const ExpenseSchema = new mongoose.Schema({
  userId: String,
  title: String,
  amount: Number
});

const Expense = mongoose.model("Expense", ExpenseSchema);

const SummarySchema = new mongoose.Schema({
  key: { type: String, unique: true },
  totalReceived: { type: Number, default: 0 }
});

const Summary = mongoose.model("Summary", SummarySchema);

// routes
app.post("/signup", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    password: hashed
  });

  await user.save();
  res.json({ message: "User created" });
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).json({ error: "User not found" });

  const match = await bcrypt.compare(req.body.password, user.password);

  if (!match) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "SECRET_KEY");

  res.json({ token });
});

app.get("/expenses", async (req, res) => {
  const data = await Expense.find();
  res.json(data);
});

app.post("/expenses", async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.json(expense);
});

app.get("/received", async (req, res) => {
  const summary = await Summary.findOne({ key: "main" });
  res.json({ totalReceived: summary?.totalReceived || 0 });
});

app.post("/received", async (req, res) => {
  const amount = Number(req.body.amount);

  if (Number.isNaN(amount)) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const summary = await Summary.findOneAndUpdate(
    { key: "main" },
    { $inc: { totalReceived: amount }, $setOnInsert: { key: "main" } },
    { new: true, upsert: true }
  );

  res.json({ totalReceived: summary.totalReceived });
});

app.delete("/expenses/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
