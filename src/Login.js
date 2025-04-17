import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update user profile with name and phone number
        await updateProfile(userCredential.user, {
          displayName: name,
          phoneNumber: phone,
        });

        // Send Email Verification
        await sendEmailVerification(userCredential.user);

        alert('Account created! Please check your email for verification link.');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
      }
      navigate('/'); // Redirect to home
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '450px' }}>
      <h2 className="text-center mb-4">{isRegistering ? 'Register' : 'Login'}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <>
            <div className="form-group mb-3">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Phone Number</label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="form-group mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {isRegistering && (
          <div className="form-group mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      <div className="text-center mt-3">
        {isRegistering ? (
          <p>
            Already have an account?{' '}
            <button className="btn btn-link p-0" onClick={() => setIsRegistering(false)}>
              Login
            </button>
          </p>
        ) : (
          <p>
            Don't have an account?{' '}
            <button className="btn btn-link p-0" onClick={() => setIsRegistering(true)}>
              Register
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
