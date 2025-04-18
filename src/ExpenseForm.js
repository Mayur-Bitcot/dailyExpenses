import React, { useState } from "react";
import { database } from "./firebase";
import { ref, push } from "firebase/database";
import ExpenseList from "./ExpenseList";
import { Container } from "react-bootstrap";
import { useAuth } from "./AuthContext"; // Import useAuth to get currentUser

const ExpenseForm = () => {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { currentUser } = useAuth(); // Get the current logged-in user

  const addExpense = () => {
    if (!currentUser) {
      setError("You need to be logged in to add an expense.");
      return;
    }

    const amount = parseFloat(expenseAmount);

    if (!expenseName || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid expense name and amount greater than 0.");
      setSuccessMessage(""); // clear success on error
      return;
    }

    // ✅ Now userId is also included inside the object
    const newExpense = {
      name: expenseName,
      amount: expenseAmount,
      timestamp: Date.now(),
      userId: currentUser.uid,
    };

    setError("");

    const expensesRef = ref(database, `expenses/${currentUser.uid}`); // Save to user-specific path
    push(expensesRef, newExpense)
      .then(() => {
        setExpenseName("");
        setExpenseAmount("");
        setSuccessMessage("Expense added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000); // hide after 3 seconds
      })
      .catch((error) => {
        console.error("Error adding expense: ", error);
        setError("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="expense-form">
      <Container>
        <h2>Add an Expense</h2>

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
        <button onClick={addExpense}>Add Expense</button>

        <ExpenseList />
      </Container>
    </div>
  );
};

export default ExpenseForm;
