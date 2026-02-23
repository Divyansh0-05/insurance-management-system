import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Shield } from 'lucide-react'

const containerClass = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'

export default function Navbar(){
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b border-emerald-100 bg-white/80 backdrop-blur-md shadow-sm">
      <div className={`${containerClass} h-16 sm:h-20`}>
        <div className="h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-emerald-200/50 group-hover:shadow-emerald-300/50 transition-all duration-300 group-hover:scale-105">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-lg sm:text-xl font-semibold tracking-tight text-emerald-950">
              Insura<span className="text-emerald-600">Flow</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              ['Features', '#features'],
              ['Categories', '#categories'],
              ['How It Works', '#how-it-works'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="px-4 py-2 text-sm text-emerald-700 hover:text-emerald-900 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-medium"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden sm:flex items-center gap-2">
            <Link 
              to="/login" 
              className="px-5 py-2 text-sm text-emerald-700 hover:text-emerald-900 font-medium rounded-lg hover:bg-emerald-50 transition-all duration-200"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50 transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? 
              <X className="w-5 h-5 text-emerald-700" /> : 
              <Menu className="w-5 h-5 text-emerald-700" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-emerald-100 bg-white/95 backdrop-blur-md">
          <div className={`${containerClass} py-4 space-y-1`}>
            {/* Mobile Navigation Links */}
            {[
              ['Features', '#features'],
              ['Categories', '#categories'],
              ['How It Works', '#how-it-works'],
            ].map(([label, href]) => (
              <a
                key={label}
                onClick={() => setMobileOpen(false)}
                href={href}
                className="block px-4 py-3 rounded-lg text-sm text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 font-medium transition-colors"
              >
                {label}
              </a>
            ))}
            
            {/* Mobile Auth Links */}
            <div className="pt-4 mt-2 border-t border-emerald-100 space-y-2">
              <Link 
                onClick={() => setMobileOpen(false)} 
                to="/login" 
                className="block px-4 py-3 rounded-lg text-center text-sm text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                onClick={() => setMobileOpen(false)} 
                to="/register" 
                className="block px-4 py-3 rounded-lg text-center text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all duration-200"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Trust Indicator */}
            <div className="pt-4 mt-2 flex items-center justify-center gap-2 text-xs text-emerald-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>24/7 Support Available</span>
            </div>
          </div>
        </div>
      )}

    
    </header>
  )
}