import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert('Signed in successfully!');
        navigate('/admin');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="signin-container">
      <h2>Admin Sign In</h2>
      <form onSubmit={handleSignIn} className="signin-form">
        <div className="input-group">
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <label>Email</label>
        </div>
        
        <div className="input-group">
          <input 
            type={showPassword ? "text" : "password"} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <label>Password</label>
          <span 
            className="toggle-password" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="signin-btn">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
