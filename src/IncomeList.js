import React, { useState, useEffect } from "react";
import { database } from "./firebase"; // Ensure Firebase is correctly configured
import { ref, onValue } from "firebase/database";

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    const incomeRef = ref(database, "incomes");
    onValue(incomeRef, (snapshot) => {
      const data = snapshot.val();
      const loadedIncomes = [];
      for (let key in data) {
        loadedIncomes.push({ id: key, ...data[key] });
      }
      setIncomes(loadedIncomes);
    });
  }, []);

  return (
    <div className="income-list">
      <h3>Your Incomes</h3>
      <ul>
        {incomes.length === 0 ? (
          <li>No income added yet!</li>
        ) : (
          incomes.map((income) => (
            <li key={income.id}>
              {income.name} - ${income.amount}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default IncomeList;
