import { useAuth } from '../context/AuthContext';
import React, { useState } from 'react';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    accountNumber: '',
    password: '',
  });

  const { accountNumber, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://localhost:5000/api/auth/login/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.token) {
        login(data.token);
        alert('Login successful!');
        // Here you would typically redirect the user to a dashboard
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed!');
    }
  };

  return (
    <>
      <style>{`
        form {
          max-width: 500px;
          margin: 3rem auto;
          padding: 2.5rem;
          background: linear-gradient(145deg, #ffffff, #f0f4f8);
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
          transition: all 0.4s ease;
        }
        form:hover {
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
          transform: translateY(-3px);
        }
        h2 {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
        }
        div { margin-bottom: 1.5rem; }
        input {
          width: 100%;
          padding: 0.8rem 1.2rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 10px;
          outline: none;
          transition: all 0.3s ease;
        }
        input:focus {
          border-color: #1a73e8;
          box-shadow: 0 0 12px rgba(26, 115, 232, 0.3);
        }
        button {
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          background: linear-gradient(135deg, #1a73e8, #4dabf5);
          color: white;
          margin-top: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(26, 115, 232, 0.45);
        }
        button:hover {
          transform: translateY(-3px);
          box-shadow: 0 9px 25px rgba(26, 115, 232, 0.55);
        }
      `}</style>

      <form onSubmit={onSubmit}>
        <h2>Customer Login</h2>
        <div>
          <input
            type="text"
            placeholder="Account Number"
            name="accountNumber"
            value={accountNumber}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
