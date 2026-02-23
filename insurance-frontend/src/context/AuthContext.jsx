import React, { useEffect, useState } from 'react'
import AuthContext from './auth-context.js'
import { authApi, setToken } from '../services/api'

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const role = user?.role ?? 'user'

  useEffect(() => {
    async function loadMe(){
      try {
        const profile = await authApi.me()
        setUser(profile)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadMe()
  }, [])

  async function login(credentials){
    const data = await authApi.login(credentials)
    if(data?.token) setToken(data.token)
    if(data?.user) setUser(data.user)
    return data
  }

  async function register(payload){
    const data = await authApi.register(payload)
    if(data?.token) setToken(data.token)
    if(data?.user) setUser(data.user)
    return data
  }

  function logout(){
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    role,
    loading,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
