import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    accountNumber: '',
    password: '',
  });

  const { fullName, idNumber, accountNumber, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://localhost:5000/api/auth/register/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Registration successful! Redirecting to login...');
        navigate('/login');
      } else {
        const errorData = await res.json();
        // This will show the specific validation errors from the backend
        alert(`Registration failed: ${errorData.errors[0].msg}`);
      }
    } catch (err) {
      console.error(err);
      alert('Registration failed!');
    }
  };

  return (
    <>
      <style>{`
        form {
          max-width: 500px;
          margin: 2rem auto;
          padding: 2rem;
          background: linear-gradient(145deg, #ffffff, #f0f4f8);
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
          transition: all 0.3s;
        }
        form:hover {
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
        }
        h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a1a1a;
        }
        div { margin-bottom: 1rem; }
        input {
          width: 100%;
          padding: 0.7rem 1rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          outline: none;
          transition: all 0.3s;
        }
        input:focus {
          border-color: #1a73e8;
          box-shadow: 0 0 8px rgba(26, 115, 232, 0.3);
        }
        button {
          width: 100%;
          padding: 0.8rem;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          background: linear-gradient(135deg, #1a73e8, #4dabf5);
          color: white;
          margin-top: 1rem;
          transition: all 0.3s;
          box-shadow: 0 5px 15px rgba(26, 115, 232, 0.4);
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 20px rgba(26, 115, 232, 0.5);
        }
      `}</style>

      <form onSubmit={onSubmit}>
        <h2>Register as a Customer</h2>
        <div>
          <input
            type="text"
            placeholder="Full Name"
            name="fullName"
            value={fullName}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="ID Number"
            name="idNumber"
            value={idNumber}
            onChange={onChange}
            required
          />
        </div>
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
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Register;
