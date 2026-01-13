import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const { token } = useAuth();

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('https://localhost:5000/api/transactions/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleVerify = async (transactionId) => {
    try {
      const res = await fetch(`https://localhost:5000/api/transactions/${transactionId}/verify`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert('Transaction verified!');
        fetchTransactions();
      } else {
        alert('Failed to verify transaction.');
      }
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  const handleReject = async (transactionId) => {
    const reason = window.prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      const res = await fetch(`https://localhost:5000/api/transactions/${transactionId}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectionReason: reason }),
      });
      if (res.ok) {
        alert('Transaction rejected!');
        fetchTransactions();
      } else {
        alert('Failed to reject transaction.');
      }
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };
  

  return (
    <div style={{
      padding: '2rem',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      color: '#333'
    }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '2rem',
        marginBottom: '0.5rem'
      }}>
        Employee Dashboard
      </h2>

      <p style={{
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#555'
      }}>
        Welcome, valued staff member!
      </p>

      <hr style={{
        border: 'none',
        borderTop: '2px solid #ddd',
        margin: '1.5rem 0'
      }} />

      <h3 style={{
        marginBottom: '1rem',
        fontSize: '1.5rem',
        textAlign: 'center'
      }}>
        Pending Transactions
      </h3>

      {transactions.length > 0 ? (
        <div style={{
          overflowX: 'auto',
          backgroundColor: '#fff',
          padding: '1rem',
          borderRadius: '12px',
          boxShadow: '0 0 12px rgba(0, 0, 0, 0.05)'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#e9ecef',
                textAlign: 'left'
              }}>
                <th style={{ padding: '1rem' }}>Customer Name</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Currency</th>
                <th style={{ padding: '1rem' }}>Payee Account</th>
                <th style={{ padding: '1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trans, index) => (
                <tr key={trans._id} style={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f7f7f7',
                  borderTop: '1px solid #ddd'
                }}>
                  <td style={{ padding: '1rem' }}>{trans.customer?.fullName || 'Customer Not Found'}</td>
                  <td style={{ padding: '1rem' }}>{trans.amount}</td>
                  <td style={{ padding: '1rem' }}>{trans.currency}</td>
                  <td style={{ padding: '1rem' }}>{trans.payeeAccountInfo}</td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => handleVerify(trans._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#2d89ef',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginRight: '0.5rem',
                        transition: '0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#2567cc'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#2d89ef'}
                    >
                      Verify
                    </button>

                    <button
                      onClick={() => handleReject(trans._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#d9534f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: '0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#c9302c'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#d9534f'}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: '#888'
        }}>
          No pending transactions found.
        </p>
      )}
    </div>
  );
};

export default EmployeeDashboard;
