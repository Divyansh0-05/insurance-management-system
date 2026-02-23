import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Landing from './pages/public/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import ProtectedRoute from './components/ProtectedRoute'
import UserLayout from './layouts/UserLayout'
import UserDashboard from './pages/user/UserDashboard'
import UserInsurance from './pages/user/UserInsurance'
import UserPurchases from './pages/user/UserPurchases'
import UserClaims from './pages/user/UserClaims'
import UserProfile from './pages/user/UserProfile'

import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminInsurance from './pages/admin/AdminInsurance'
import AdminClaims from './pages/admin/AdminClaims'
import AdminReports from './pages/admin/AdminReports'
import AdminSettings from './pages/admin/AdminSettings'

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        <Route path="/user" element={<ProtectedRoute requiredRole="user"><UserLayout /></ProtectedRoute>}>
          <Route index element={<UserDashboard/>} />
          <Route path="dashboard" element={<UserDashboard/>} />
          <Route path="insurance" element={<UserInsurance/>} />
          <Route path="purchases" element={<UserPurchases/>} />
          <Route path="claims" element={<UserClaims/>} />
          <Route path="profile" element={<UserProfile/>} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard/>} />
          <Route path="dashboard" element={<AdminDashboard/>} />
          <Route path="users" element={<AdminUsers/>} />
          <Route path="insurance" element={<AdminInsurance/>} />
          <Route path="claims" element={<AdminClaims/>} />
          <Route path="reports" element={<AdminReports/>} />
          <Route path="settings" element={<AdminSettings/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
