import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function ProtectedRoute({ children, requiredRole }){
  const { user, role, loading } = useAuth()

  if(loading) return null

  if(!user){
    return <Navigate to="/" replace />
  }

  if(role !== requiredRole){
    const fallbackPath = role === 'admin' ? '/admin/dashboard' : '/user/dashboard'
    return <Navigate to={fallbackPath} replace />
  }

  return children
}
