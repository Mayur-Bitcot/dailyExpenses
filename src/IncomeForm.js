import React, { useState } from "react";
import { database } from "./firebase"; // Ensure Firebase is correctly configured
import { ref, push } from "firebase/database";
import IncomeList from "./IncomeList"; // Import the IncomeList component

const IncomeForm = () => {
  const [incomeName, setIncomeName] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");

  const addIncome = () => {
    if (!incomeName || !incomeAmount) {
      alert("Please enter a valid income source and amount.");
      return;
    }

    const newIncome = {
      name: incomeName,
      amount: Number(incomeAmount), // Convert to number before saving
    };

    // Push new income to Firebase Realtime Database under "incomes"
    const incomeRef = ref(database, "incomes");
    push(incomeRef, newIncome)
      .then(() => {
        setIncomeName(""); // Clear form fields
        setIncomeAmount("");
        alert("Income added successfully!");
      })
      .catch((error) => {
        console.error("Error adding income: ", error);
      });
  };

  return (
    <div className="income-form">
      <h2>Add Income</h2>
      <input
        type="text"
        placeholder="Income Source"
        value={incomeName}
        onChange={(e) => setIncomeName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={incomeAmount}
        onChange={(e) => setIncomeAmount(e.target.value)}
      />
      <button onClick={addIncome}>Add Income</button>

      {/* Include the IncomeList component below the form */}
      <IncomeList className="list_income" />
    </div>
  );
};

export default IncomeForm;
