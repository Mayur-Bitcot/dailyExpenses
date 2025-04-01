import React, { useState } from "react";
import { database } from "./firebase"; // Ensure your firebase configuration is correctly imported
import { ref, push } from "firebase/database";
import ExpenseList from "./ExpenseList"; // Import the ExpenseList component
// import Analytics from "./Analytics";

const ExpenseForm = () => {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  const addExpense = () => {
    const newExpense = {
      name: expenseName,
      amount: expenseAmount,
    };

    // Push new expense to Firebase Realtime Database
    const expensesRef = ref(database, "expenses");
    push(expensesRef, newExpense)
      .then(() => {
        setExpenseName("");  // Clear form fields
        setExpenseAmount("");
        // alert("Expense added successfully!");
      })
      .catch((error) => {
        console.error("Error adding expense: ", error);
      });
  };

  return (
    <div className="expense-form">
      <h2>Add an Expense</h2>
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

      {/* Include the ExpenseList component below the form */}
      <ExpenseList />
   
    </div>
  );
};

export default ExpenseForm;
