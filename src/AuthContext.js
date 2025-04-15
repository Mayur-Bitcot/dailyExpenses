// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';  // Firebase authentication methods
import { useNavigate } from 'react-router-dom';

// 1. Create the AuthContext to manage the authentication state
const AuthContext = createContext();

// 2. Create the useAuth hook to access the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. The AuthProvider component that wraps around your app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // State to store the current user
  const navigate = useNavigate(); // Hook to navigate between pages

  // 4. useEffect to listen for authentication changes
  useEffect(() => {
    const auth = getAuth(); // Firebase authentication object
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);  // Set currentUser whenever the authentication state changes
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  // 5. Function to handle logging out
  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setCurrentUser(null);  // Clear currentUser after logout
        navigate('/login');  // Redirect to login page after logging out
      })
      .catch((error) => {
        console.error('Logout Error: ', error);
      });
  };

  // 6. Return the AuthContext provider and pass currentUser and logout function to children
  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}  {/* Render all child components */}
    </AuthContext.Provider>
  );
};
