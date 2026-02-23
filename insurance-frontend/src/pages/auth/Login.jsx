import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, CheckCircle } from 'lucide-react'
import useAuth from '../../hooks/useAuth'

export default function Login(){
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(e){
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const data = await login(form)
      const userRole = data?.user?.role ?? 'user'
      navigate(userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 px-4 py-12">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-emerald-200/50 border border-emerald-100 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Image & Branding */}
            <div className="relative hidden md:block">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2000&q=80')`
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/80 to-emerald-700/90" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-10 flex flex-col justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm text-white flex items-center justify-center border border-white/30">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-semibold tracking-tight text-white">
                    Insura<span className="text-emerald-300">Flow</span>
                  </span>
                </div>

                {/* Testimonial/Brand Message */}
                <div className="space-y-6">
                  <blockquote className="space-y-2">
                    <p className="text-white text-2xl font-semibold leading-tight">
                      "Peace of mind for your family's future"
                    </p>
                    <p className="text-emerald-100/80 text-sm">
                      Join thousands of families who trust us with their protection
                    </p>
                  </blockquote>

                  {/* Stats/Features */}
                  <div className="space-y-3">
                    {[
                      'Comprehensive coverage options',
                      '24/7 claims support',
                      'Instant policy management'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-300" />
                        <span className="text-sm text-white/90">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-white/80">4.9/5 from 2,500+ reviews</span>
                  </div>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="p-8 md:p-10">
              {/* Mobile Logo (visible on small screens) */}
              <Link to="/" className="flex items-center justify-center gap-2 mb-8 md:hidden group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200/50">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-xl font-semibold tracking-tight text-emerald-950">
                  Insura<span className="text-emerald-600">Flow</span>
                </span>
              </Link>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-emerald-950 mb-1">Welcome back</h1>
                <p className="text-emerald-600 text-sm">Sign in to access your insurance dashboard</p>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-emerald-900">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-emerald-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-emerald-200 rounded-xl pl-10 pr-4 py-3 
                               bg-white focus:bg-white 
                               placeholder:text-emerald-400/60 text-emerald-900
                               focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                               focus:border-emerald-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-emerald-900">
                      Password
                    </label>
                    <button 
                      type="button"
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-emerald-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                      className="w-full border border-emerald-200 rounded-xl pl-10 pr-12 py-3 
                               bg-white focus:bg-white 
                               placeholder:text-emerald-400/60 text-emerald-900
                               focus:outline-none focus:ring-2 focus:ring-emerald-500/20 
                               focus:border-emerald-400 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? 
                        <EyeOff className="h-5 w-5 text-emerald-400 hover:text-emerald-600 transition-colors" /> : 
                        <Eye className="h-5 w-5 text-emerald-400 hover:text-emerald-600 transition-colors" />
                      }
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative w-full bg-gradient-to-r from-emerald-600 to-emerald-500 
                           text-white rounded-xl py-3.5 font-semibold
                           hover:from-emerald-700 hover:to-emerald-600
                           shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50
                           transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
                           overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                {/* Register Link */}
                <p className="text-center text-sm text-emerald-700">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="font-semibold text-emerald-600 hover:text-emerald-700 
                             hover:underline underline-offset-2 transition-colors"
                  >
                    Create free account
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}