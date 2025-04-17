import React, { useEffect, useState } from "react";
import { database, auth } from "./firebase"; // Import auth also
import { ref, onValue } from "firebase/database";
import { Container } from "react-bootstrap";
import { onAuthStateChanged } from "firebase/auth";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const expensesRef = ref(database, `expenses/${userId}`);
    const incomesRef = ref(database, `incomes/${userId}`);

    const fetchTransactions = () => {
      const allTransactions = [];

      // Fetch Expenses
      onValue(expensesRef, (snapshot) => {
        allTransactions.length = 0; // Clear array first

        const expensesData = snapshot.val();
        if (expensesData) {
          for (let key in expensesData) {
            allTransactions.push({
              id: key,
              ...expensesData[key],
              type: "Expense",
            });
          }
        }

        // Fetch Incomes
        onValue(incomesRef, (snapshot) => {
          const incomesData = snapshot.val();
          if (incomesData) {
            for (let key in incomesData) {
              allTransactions.push({
                id: key,
                ...incomesData[key],
                type: "Income",
              });
            }
          }

          // Sort all transactions by timestamp descending
          const sorted = allTransactions.sort(
            (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
          );
          setTransactions(sorted);
        });
      });
    };

    fetchTransactions();
  }, [userId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "No date";
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="transaction-history">
      <Container>
        <h2>Transaction History</h2>

        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul>
            {transactions.map((item) => (
              <li key={item.id} style={{ marginBottom: "10px" }}>
                <strong>{item.type}:</strong> {item.name} - ₹{item.amount}
                <br />
                <small>Date: {formatDate(item.timestamp)}</small>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
};

export default TransactionHistory;
