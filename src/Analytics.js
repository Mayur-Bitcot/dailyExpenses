import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, onValue } from "firebase/database";

const Analytics = () => {
  const [totals, setTotals] = useState({ income: 0, expenses: 0 });

  useEffect(() => {
    const fetchData = (path, key) => {
      const dataRef = ref(database, path);
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        const total = data ? Object.values(data).reduce((sum, item) => sum + Number(item.amount), 0) : 0;
        setTotals((prevTotals) => ({ ...prevTotals, [key]: total }));
      });
    };

    fetchData("incomes", "income");
    fetchData("expenses", "expenses");
  }, []);

  const availableBalance = totals.income - totals.expenses;

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
            <td>₹{totals.income}</td>
            <td>₹{totals.expenses}</td>
            <td>₹{availableBalance}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Analytics;
