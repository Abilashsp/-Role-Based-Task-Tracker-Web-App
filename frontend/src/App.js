import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewTask from './pages/NewTask';
import EditTask from './pages/EditTask';
import UserList from './pages/userList'; // ✅ Import UserList page
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="center">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/tasks/new" element={user ? <NewTask /> : <Navigate to="/login" replace />} />
          <Route path="/tasks/:id/edit" element={user ? <EditTask /> : <Navigate to="/login" replace />} />
          
          <Route
            path="/users"
            element={
              user && user.role === 'ADMIN' ? (
                <UserList />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </div>
    </>
  );
}
