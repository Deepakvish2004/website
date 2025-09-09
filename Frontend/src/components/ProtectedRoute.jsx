// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;

  return children;
}
