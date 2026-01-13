import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'ZAR',
    payeeAccountInfo: '',
    payeeSwiftCode: '',
  });

  const { amount, currency, payeeAccountInfo, payeeSwiftCode } = formData;

  const fetchMyTransactions = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('https://localhost:5000/api/transactions/my-transactions', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchMyTransactions();
  }, [fetchMyTransactions]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Payment created successfully!');
        setFormData({ amount: '', currency: 'ZAR', payeeAccountInfo: '', payeeSwiftCode: '' });
        fetchMyTransactions();
      } else {
        const errorData = await res.json();
        alert(`Payment failed: ${errorData.msg || 'Server error'}`);
      }
    } catch (err) {
      console.error('An error occurred:', err);
      alert('An error occurred.');
    }
  };

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container {
          max-width: 900px;
          margin: 40px auto;
          padding: 30px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        h2 {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        h3 {
          color: #34495e;
          margin-top: 30px;
          border-bottom: 2px solid #7f8c8d;
          padding-bottom: 6px;
        }

        form {
          display: grid;
          gap: 12px;
          margin-top: 15px;
        }

        input {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          width: 100%;
          font-size: 14px;
        }

        input:focus {
          border-color: #2980b9;
          outline: none;
          box-shadow: 0 0 4px rgba(41, 128, 185, 0.3);
        }

        button {
          background-color: #2980b9;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 15px;
          cursor: pointer;
          transition: 0.3s;
          font-weight: 600;
        }

        button:hover {
          background-color: #1f6391;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
        }

        table thead tr {
          background-color: #2980b9;
        }

        table th {
          color: white !important;
          font-weight: 600;
          padding: 12px 15px;
          text-align: left;
          background-color: #2980b9;
        }

        table td {
          padding: 12px 15px;
          color: #2c3e50;
          font-size: 14px;
        }

        table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        table tr:hover {
          background-color: #ecf6ff;
        }

        p {
          color: #555;
        }
      `}</style>

      <h2>Customer Dashboard</h2>
      <p style={{ textAlign: 'center', color: '#555' }}>Welcome! You are logged in.</p>

      <h3>Create a New Payment</h3>
      <form onSubmit={onSubmit}>
        <input
          type="number"
          placeholder="Amount"
          name="amount"
          value={amount}
          onChange={onChange}
          required
        />
        <input
          type="text"
          placeholder="Currency"
          name="currency"
          value={currency}
          onChange={onChange}
          required
        />
        <input
          type="text"
          placeholder="Payee Account Information"
          name="payeeAccountInfo"
          value={payeeAccountInfo}
          onChange={onChange}
          required
        />
        <input
          type="text"
          placeholder="Payee SWIFT Code"
          name="payeeSwiftCode"
          value={payeeSwiftCode}
          onChange={onChange}
          required
        />
        <button type="submit">Submit Payment</button>
      </form>

      <h3>My Transactions</h3>
      {transactions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Payee Account</th>
              <th>Status</th>
              <th>Rejection Reason</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trans) => (
              <tr key={trans._id}>
                <td>{new Date(trans.createdAt).toLocaleDateString()}</td>
                <td>{trans.amount} {trans.currency}</td>
                <td>{trans.payeeAccountInfo}</td>
                <td>{trans.status}</td>
                <td>{trans.rejectionReason || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center' }}>You have no transactions yet.</p>
      )}
    </div>
  );
};

export default Dashboard;
