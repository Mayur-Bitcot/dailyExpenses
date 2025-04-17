import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, onValue } from "firebase/database";
import { Container } from "react-bootstrap";
import { useAuth } from "./AuthContext"; // ✅ Import useAuth

const Analytics = () => {
  const [totals, setTotals] = useState({ income: 0, expenses: 0 });
  const { currentUser } = useAuth(); // ✅ Get logged-in user

  useEffect(() => {
    if (!currentUser) return; // ✅ Don't run if not logged in

    const fetchData = (path, key) => {
      const dataRef = ref(database, `${path}/${currentUser.uid}`); // ✅ Path with user ID
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        console.log(`${key} raw data:`, data); // Debug log

        const total = data
          ? Object.values(data).reduce((sum, item) => {
              const amount = Number(item.amount);
              return !isNaN(amount) ? sum + amount : sum;
            }, 0)
          : 0;

        setTotals((prevTotals) => ({ ...prevTotals, [key]: total }));
      });
    };

    fetchData("incomes", "income");
    fetchData("expenses", "expenses");
  }, [currentUser]); // ✅ Run when currentUser is ready

  const availableBalance = totals.income - totals.expenses;

  return (
    <div className="analytics_box">
      <Container>
        <h2>Balance Sheet</h2>
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
              <td>₹{isNaN(totals.income) ? 0 : totals.income}</td>
              <td>₹{isNaN(totals.expenses) ? 0 : totals.expenses}</td>
              <td>₹{isNaN(availableBalance) ? 0 : availableBalance}</td>
            </tr>
          </tbody>
        </table>
      </Container>
    </div>
  );
};

export default Analytics;
