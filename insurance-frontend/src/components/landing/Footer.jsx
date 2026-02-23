import { Shield, Heart, Github, Twitter, Linkedin } from 'lucide-react'

const containerClass = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'

export default function Footer(){
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t border-emerald-100 bg-white py-12">
      <div className={containerClass}>
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-lg font-semibold text-emerald-900">
                Insura<span className="text-emerald-600">Flow</span>
              </span>
            </div>
            <p className="text-sm text-emerald-600/70">
              © {currentYear} InsuraFlow. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-emerald-700 hover:text-emerald-600 transition-colors font-medium">
              Privacy
            </a>
            <a href="#" className="text-sm text-emerald-700 hover:text-emerald-600 transition-colors font-medium">
              Terms
            </a>
            <a href="#" className="text-sm text-emerald-700 hover:text-emerald-600 transition-colors font-medium">
              Support
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a href="#" className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 
                                 flex items-center justify-center text-emerald-600 
                                 hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-700 
                                 transition-all duration-300 group">
              <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 
                                 flex items-center justify-center text-emerald-600 
                                 hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-700 
                                 transition-all duration-300 group">
              <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 
                                 flex items-center justify-center text-emerald-600 
                                 hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-700 
                                 transition-all duration-300 group">
              <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {/* Bottom Bar with Additional Info */}
        <div className="pt-6 border-t border-emerald-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-emerald-500/70">
            Built with <Heart className="w-3 h-3 inline-block text-emerald-400 fill-current" /> for families everywhere
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-emerald-500/70">Security</span>
            <span className="w-1 h-1 rounded-full bg-emerald-300" />
            <span className="text-xs text-emerald-500/70">Privacy First</span>
            <span className="w-1 h-1 rounded-full bg-emerald-300" />
            <span className="text-xs text-emerald-500/70">GDPR Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  )
}