import React, { useState } from "react";
import { database } from "./firebase";
import { ref, push } from "firebase/database";
import IncomeList from "./IncomeList"; 
import { useAuth } from "./AuthContext"; // Import useAuth to get currentUser

const IncomeForm = () => {
  const [incomeName, setIncomeName] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const { currentUser } = useAuth(); // ✅ Get logged-in user

  const addIncome = () => {
    if (!currentUser) {
      alert("You need to be logged in to add income.");
      return;
    }

    if (!incomeName || !incomeAmount || isNaN(incomeAmount) || Number(incomeAmount) <= 0) {
      alert("Please enter a valid income source and amount greater than 0.");
      return;
    }

    const newIncome = {
      name: incomeName,
      amount: Number(incomeAmount),
      timestamp: Date.now(),
      userId: currentUser.uid, // ✅ Attach userId
    };

    const incomeRef = ref(database, `incomes/${currentUser.uid}`); // ✅ Save under user's UID
    push(incomeRef, newIncome)
      .then(() => {
        setIncomeName("");
        setIncomeAmount("");
        alert("Income added successfully!");
      })
      .catch((error) => {
        console.error("Error adding income: ", error);
        alert("Error adding income. Please try again.");
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

      {/* Income List */}
      <IncomeList className="list_income" />
    </div>
  );
};

export default IncomeForm;
