// src/Layout.js
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
// import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { auth } from "./firebase";

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Header user={user} />
      <main style={{ minHeight: "80vh" }}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
