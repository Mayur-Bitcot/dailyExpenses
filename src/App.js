import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import TransactionHistory from './TransactionHistory';
import Analytics from './Analytics';
import ExpenseForm from "./ExpenseForm";
import Layout from "./Layout";
import { AuthProvider } from './AuthContext'; 
import IncomeForm from "./IncomeForm";
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './Login';
import Register from './Register';
import "./InsertCategories";

const AppContent = () => {
  const [user, setUser] = useState(null);  
  const location = useLocation(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const pageTitles = {
      '/': 'Home | Daily Expenses',
      '/login': 'Login | Daily Expenses',
      '/register': 'Register | Daily Expenses',
      '/analytics': 'Analytics | Daily Expenses',
      '/history': 'Transaction History | Daily Expenses',
      '/credit': 'Income | Daily Expenses',
    };

    const currentTitle = pageTitles[location.pathname] || 'Daily Expenses'; 
    document.title = currentTitle;
  }, [location.pathname]);

  return (
    <AuthProvider> 
      <div className="app">
        <Layout user={user}>
          <Routes>
            <Route path="/" element={<ExpenseForm />} />
            <Route path="/analytics" element={<Analytics />} />              
            <Route path="/history" element={<TransactionHistory />} />   
            <Route path="/credit" element={<IncomeForm />} />      
            <Route path="/login" element={<Login />} />        
            <Route path="/register" element={<Register />} />
          </Routes>    
        </Layout>
      </div>
    </AuthProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
