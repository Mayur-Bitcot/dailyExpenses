import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import TransactionHistory from './TransactionHistory';
import Analytics from './Analytics';
import ExpenseForm from "./ExpenseForm";
import Layout from "./Layout";
import { AuthProvider } from './AuthContext'; 
import IncomeForm from "./IncomeForm";

const App = () => {
  
  return (
    <div className="app">
        <BrowserRouter>
        <AuthProvider> 
          <Layout>
              <Routes>
                <Route path="/" element={<ExpenseForm />} />
                <Route path="/analytics" element={<Analytics />} />              
                <Route path="/history" element={<TransactionHistory />} />   
                <Route path="/credit" element={<IncomeForm />} />              
              </Routes>                   
          </Layout>
        </AuthProvider>
        </BrowserRouter>
    </div>
  );
};

export default App;
