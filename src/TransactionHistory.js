import React, { useEffect, useState } from "react";
import { database } from "./firebase";
import { ref, onValue } from "firebase/database";
import { Container } from "react-bootstrap";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const expensesRef = ref(database, "expenses");
    const incomeRef = ref(database, "incomes");

    const fetchTransactions = async () => {
      const allTransactions = [];

      onValue(expensesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          for (let key in data) {
            allTransactions.push({
              id: key,
              ...data[key],
              type: "Expense",
            });
          }
        }

        onValue(incomeRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            for (let key in data) {
              allTransactions.push({
                id: key,
                ...data[key],
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
  }, []);

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
              <strong>{item.type}:</strong> {item.name} - ${item.amount}  
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
