import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, onValue, remove } from "firebase/database";
import { useAuth } from "./AuthContext";

const ExpenseList = ({ setEditingExpense, setExpenseData, setAmountData, setCategoryData }) => {
  const [expenses, setExpenses] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const expensesRef = ref(database, `expenses/${currentUser.uid}`);
      onValue(expensesRef, (snapshot) => {
        const data = snapshot.val();
        const loadedExpenses = [];
        for (let key in data) {
          loadedExpenses.push({ id: key, ...data[key] });
        }
        setExpenses(loadedExpenses);
      });
    }
  }, [currentUser]);

  const handleDelete = (id) => {
    if (currentUser) {
      const expenseRef = ref(database, `expenses/${currentUser.uid}/${id}`);
      remove(expenseRef)
        .then(() => {
          console.log("Expense deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting expense:", error);
        });
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setExpenseData(expense.name);
    setAmountData(expense.amount);
    setCategoryData(expense.category || "");
  };

  return (
    <div className="expense-list">
      <h3>Recent Expenses</h3>
      <ul className="expense-list">
        {expenses.length === 0 ? (
          <li>No expenses added yet!</li>
        ) : (
          expenses.map((expense) => (
            <li key={expense.id}>
              <div className="expense_details">
              {expense.name} - ₹{expense.amount} ({expense.category})
              </div>
                
              <div className="expense_actions">
                <button onClick={() => handleEdit(expense)} >
                  Edit
                </button>
                <button onClick={() => handleDelete(expense.id)} style={{  color: "#fff" }}>
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ExpenseList;
