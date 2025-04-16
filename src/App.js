import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import TransactionHistory from './TransactionHistory';
import Analytics from './Analytics';
import ExpenseForm from "./ExpenseForm";
import Layout from "./Layout";
import { AuthProvider } from './AuthContext'; 
import IncomeForm from "./IncomeForm";

import { auth } from './firebase';
import Header from './Header';
import { onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider> 
        <div className="app">
          <Header user={user} />
          <Layout>
            <Routes>
              <Route path="/" element={<ExpenseForm />} />
              <Route path="/analytics" element={<Analytics />} />              
              <Route path="/history" element={<TransactionHistory />} />   
              <Route path="/credit" element={<IncomeForm />} />              
            </Routes>    
          </Layout>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
