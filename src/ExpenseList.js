import React, { useState, useEffect } from "react";
import { database } from "./firebase"; // Ensure firebase is correctly configured
import { ref, onValue } from "firebase/database";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const expensesRef = ref(database, "expenses");
    onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedExpenses = [];
      for (let key in data) {
        loadedExpenses.push({ id: key, ...data[key] });
      }
      setExpenses(loadedExpenses);
    });
  }, []);

  return (
    <div className="expense-list">
      <h3>Your Expenses</h3>
      <ul>
        {expenses.length === 0 ? (
          <li>No expenses added yet!</li>
        ) : (
          expenses.map((expense) => (
            <li key={expense.id}>
              {expense.name} - ${expense.amount}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ExpenseList;
