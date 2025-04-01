import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, onValue } from "firebase/database";

const Analytics = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const incomeRef = ref(database, "incomes");
    const expenseRef = ref(database, "expenses");

    // Fetch total income
    onValue(incomeRef, (snapshot) => {
      const data = snapshot.val();
      let total = 0;
      if (data) {
        total = Object.values(data).reduce((sum, item) => sum + Number(item.amount), 0);
      }
      setTotalIncome(total);
    });

    // Fetch total expenses
    onValue(expenseRef, (snapshot) => {
      const data = snapshot.val();
      let total = 0;
      if (data) {
        total = Object.values(data).reduce((sum, item) => sum + Number(item.amount), 0);
      }
      setTotalExpenses(total);
    });
  }, []);

  const availableBalance = totalIncome - totalExpenses;

  return (
    <div>
      <h2>Analytics Summary</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Total Income</th>
            <th>Total Expenses</th>
            <th>Available Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>₹{totalIncome}</td>
            <td>₹{totalExpenses}</td>
            <td>₹{availableBalance}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Analytics;
