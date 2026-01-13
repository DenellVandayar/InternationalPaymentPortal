import React from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navigate } from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmployeeLogin from './components/EmployeeLogin';
import EmployeeDashboard from './components/EmployeeDashboard';

function App() {
  const { token, user, logout } = useAuth();

  return (
    <div>
      <header>
        <nav>
          {token && user ? (
            <>
              {user.role === 'customer' && <Link to="/dashboard">Customer Dashboard</Link>}
              {user.role === 'employee' && <Link to="/employee-dashboard">Employee Dashboard</Link>}
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
            
              
              <Link to="/login">Customer Login</Link>
              <Link to="/employee-login">Employee Login</Link>
            </>
          )}
        </nav>
        <h1>International Payment System</h1>
      </header>

      <main className="container">
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}


export default App;