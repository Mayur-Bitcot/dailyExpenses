// src/OffcanvasExample.js
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from './firebase';

function OffcanvasExample({ user }) {
  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
      console.error("Login failed:", error);
    });
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.error("Logout failed:", error);
    });
  };

  return (
    <>
    <header>
      {['lg'].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3 main_navbar">
          <Container>
            <Navbar.Brand href="#">Daily Expenses</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Menu
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3 nav_items">
                  <Link to="/" className="nav-link">Home</Link>
                  <Link to="/analytics" className="nav-link">Analytics</Link>
                  <Link to="/history" className="nav-link">History</Link>
                  <Link to="/credit" className="nav-link">Credit</Link>
                </Nav>

                <div className=" text-end user_login_button_box">
                  {user ? (
                    <>
                      <div className=" user_name">Welcome, {user.displayName} </div>
                      <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                        Logout
                      </button>
                     
                    </>
                  ) : (
                    <button className="btn btn-outline-primary btn-sm" onClick={handleLogin}>
                      Login with Google
                    </button>
                  )}
                </div>

              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
      </header>
    </>
  );
}

export default OffcanvasExample;
