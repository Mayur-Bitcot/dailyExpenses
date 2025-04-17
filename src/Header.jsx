import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, useLocation } from 'react-router-dom';

import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { auth } from './firebase';

function OffcanvasExample({ user }) {

  const [show, setShow] = useState(false);
  const location = useLocation();



  useEffect(() => {
    // Close the offcanvas when the route changes
    setShow(false);
  }, [location]);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Redirect login success:", result.user);
        }
      })
      .catch((error) => {
        console.error("Redirect result error:", error);
      });
  }, []);

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    if (window.innerWidth < 768) {
      signInWithRedirect(auth, provider).catch((error) => {
        console.error("Redirect login failed:", error);
      });
    } else {
      signInWithPopup(auth, provider).catch((error) => {
        console.error("Popup login failed:", error);
      });
    }
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.error("Logout failed:", error);
    });
  };

  return (
    <section>
      <header>
        <Navbar expand="lg" className="bg-body-tertiary mb-3 main_navbar">
          <Container>
            <Navbar.Brand href="#">Daily Expenses</Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" onClick={() => setShow(true)} />
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-lg"
              aria-labelledby="offcanvasNavbarLabel-expand-lg"
              placement="end"
              show={show}
              onHide={() => setShow(false)}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                  Menu
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3 nav_items">
                  <Link to="/" className="nav-link">Expense</Link>
                  <Link to="/analytics" className="nav-link">Summary</Link>
                  <Link to="/history" className="nav-link">History</Link>
                  <Link to="/credit" className="nav-link">Income</Link>
                </Nav>

                <div className="text-end user_login_button_box">
                  {user ? (
                    <>
                      <div className="user_name">Welcome, {user.displayName}</div>
                      <button className="btn btn-outline-danger btn-sm mt-2" onClick={handleLogout}>
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-outline-primary btn-sm " onClick={handleLogin}>
                        Continue with Google
                      </button>                    

                      <Link to="/login" className="btn btn-outline-primary btn-sm login_with_email">
                        Login / Register with Email
                      </Link>
                    </>
                  )}
                </div>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </header>
    </section>
  );
}

export default OffcanvasExample;
