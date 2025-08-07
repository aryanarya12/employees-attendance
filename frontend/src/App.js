import React, { useState } from 'react';
import Login from './pages/login';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (role) => {
    if (role === 'admin') setIsAdmin(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return isAdmin ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}

export default App;