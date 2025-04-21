import React, { useState } from "react";
import { database } from "./firebase";
import { ref, push, set } from "firebase/database";
import ExpenseList from "./ExpenseList";
import { Container } from "react-bootstrap";
import { useAuth } from "./AuthContext";

const ExpenseForm = () => {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [editingExpense, setEditingExpense] = useState(null); // Track if editing
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { currentUser } = useAuth();

  const defaultCategories = ["Food", "Rent", "Salary", "Bonus", "Other"];

  const handleSave = () => {
    if (!currentUser) {
      setError("You need to be logged in to add an expense.");
      return;
    }

    const amount = parseFloat(expenseAmount);

    if (!expenseName || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid expense name and amount greater than 0.");
      setSuccessMessage("");
      return;
    }

    const category = expenseCategory === "Other" ? customCategory : expenseCategory;
    if (!category) {
      setError("Please select or add a category.");
      return;
    }

    const expenseData = {
      name: expenseName,
      amount: expenseAmount,
      category: category,
      timestamp: Date.now(),
      userId: currentUser.uid,
    };

    setError("");

    if (editingExpense) {
      // Update existing expense
      const expenseRef = ref(database, `expenses/${currentUser.uid}/${editingExpense.id}`);
      set(expenseRef, expenseData)
        .then(() => {
          resetForm();
          setSuccessMessage("Expense updated successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        })
        .catch((error) => {
          console.error("Error updating expense:", error);
          setError("Something went wrong. Please try again.");
        });
    } else {
      // Add new expense
      const expensesRef = ref(database, `expenses/${currentUser.uid}`);
      push(expensesRef, expenseData)
        .then(() => {
          resetForm();
          setSuccessMessage("Expense added successfully!");
          setTimeout(() => setSuccessMessage(""), 3000);
        })
        .catch((error) => {
          console.error("Error adding expense:", error);
          setError("Something went wrong. Please try again.");
        });
    }
  };

  const resetForm = () => {
    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("");
    setCustomCategory("");
    setEditingExpense(null);
  };

  return (
    <div className="expense-form">
      <Container>
        <h2>{editingExpense ? "Edit Expense" : "Add an Expense"}</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

        <input
          type="text"
          placeholder="Expense Name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
        />

        <select
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {defaultCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {expenseCategory === "Other" && (
          <input
            type="text"
            placeholder="Enter Custom Category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        )}

        <button onClick={handleSave} className="add_update_btn">
          {editingExpense ? "Update Expense" : "Add Expense"}
        </button>

        <ExpenseList setEditingExpense={setEditingExpense} setExpenseData={setExpenseName} setAmountData={setExpenseAmount} setCategoryData={setExpenseCategory} />
      </Container>
    </div>
  );
};

export default ExpenseForm;
