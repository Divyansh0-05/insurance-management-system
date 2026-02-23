import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children }){
  useEffect(() => {
    if(!isOpen) return undefined
    function onKeyDown(e){
      if(e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isOpen ? 'bg-black/45 backdrop-blur-sm pointer-events-auto' : 'bg-black/0 backdrop-blur-0 pointer-events-none'
      }`}
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal={isOpen ? 'true' : 'false'}
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 text-slate-100 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)] transition-all duration-200 ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 inline-flex items-center justify-center rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
