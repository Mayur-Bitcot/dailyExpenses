import React, { useState, useEffect } from "react";
import { database } from "./firebase"; // Make sure firebase is configured
import { ref, onValue, update, remove } from "firebase/database";
import { useAuth } from "./AuthContext"; // Import useAuth to get currentUser

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);
  const { currentUser } = useAuth(); // Get current logged-in user

  useEffect(() => {
    if (!currentUser) return; // If user is not logged in, don't fetch

    const incomeRef = ref(database, `incomes/${currentUser.uid}`);
    onValue(incomeRef, (snapshot) => {
      const data = snapshot.val();
      const loadedIncomes = [];

      for (let key in data) {
        loadedIncomes.push({ id: key, ...data[key] });
      }

      setIncomes(loadedIncomes);
    });
  }, [currentUser]); // Add currentUser to dependency array

  const handleEdit = (item) => {
    const newName = prompt("Enter new income name:", item.name);
    const newAmount = prompt("Enter new amount:", item.amount);

    if (newName && newAmount) {
      const incomeRef = ref(database, `incomes/${currentUser.uid}/${item.id}`);
      update(incomeRef, {
        name: newName,
        amount: Number(newAmount),
      });
    }
  };

  const handleDelete = (id) => {
    const incomeRef = ref(database, `incomes/${currentUser.uid}/${id}`);
    remove(incomeRef)
      .then(() => {
        console.log("Income deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting income: ", error);
      });
  };

  return (
    <div className="income-list">
      <h3>Your Incomes</h3>
      <ul>
        {incomes.length === 0 ? (
          <li>No income added yet!</li>
        ) : (
          incomes.map((income) => (
            <li key={income.id}>
              {income.name} - ₹{income.amount}
              <div className="expense_actions">
              <button onClick={() => handleEdit(income)}>Edit</button>
              <button onClick={() => handleDelete(income.id)}>Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default IncomeList;
