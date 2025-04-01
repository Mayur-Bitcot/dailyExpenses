import './App.css';
import ExpenseForm from "./ExpenseForm";
import IncomeForm from "./IncomeForm";
import Analytics from "./Analytics"; // Import Analytics component
import React, { useState } from "react";

const App = () => {
  const [showIncomeForm, setShowIncomeForm] = useState(false);

  const toggleForm = () => {
    setShowIncomeForm(!showIncomeForm); // Toggle between forms
  };

  return (
    <div className="app">
      <button onClick={toggleForm}>
        {showIncomeForm ? "Go to Expense Form" : "Go to Income Form"}
      </button>

      {/* Display the respective form based on the toggle */}
      {showIncomeForm ? <IncomeForm /> : <ExpenseForm />}

      {/* Always show the Analytics section */}
      <Analytics />
    </div>
  );
};

export default App;
