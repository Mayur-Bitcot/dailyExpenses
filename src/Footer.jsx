import React from 'react'
import { Container } from 'react-bootstrap'

const footer = () => {
  return (
    <div>
      <footer>
        <Container>
          <div className="footer-content">
            <div>

              <h2>Expense Tracker</h2>
              <p>Manage your expenses with ease.</p>
              <p>Stay on top of your finances.</p>
            </div>
            <div>
              <p>Follow us on:</p>
              <ul>
                <li><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                <li><a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              </ul>
            </div>
            <div> <p>Contact Us</p>
            <ul>
              <li>Phone: 123-456-7890</li>
              <li>Email: 2oLX4@example.com</li>
            </ul>
          </div>
          </div>
         
          <p>&copy; 2023 Expense Tracker</p>
        </Container>
      </footer>
    </div>
  )
}

export default footer
