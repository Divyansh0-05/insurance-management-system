import { useEffect, useState } from 'react'
import { ShieldCheck, Activity, AlertTriangle, Car, HeartPulse, Home, Plane, FolderOpen, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import Modal from '../../components/ui/Modal'
import { userApi } from '../../services/api'
import { formatCurrency } from '../../utils/formatCurrency'

function formatDate(dateValue){
  const date = new Date(dateValue)
  if(Number.isNaN(date.getTime())) return '--'
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

function getPurchaseStatus(purchase, today, thirtyDaysAhead){
  const rawStatus = String(purchase.status || '').toLowerCase()
  const endDate = new Date(purchase.endDate)
  if(rawStatus === 'expired') return 'Expired'
  if(Number.isNaN(endDate.getTime())) return 'Active'
  if(endDate < today) return 'Expired'
  if(endDate <= thirtyDaysAhead) return 'Expiring Soon'
  return 'Active'
}

export default function UserPurchases(){
  const [purchases, setPurchases] = useState([])
  const [selectedPolicy, setSelectedPolicy] = useState(null)
  const [cardsVisible, setCardsVisible] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadPurchases(){
      try {
        const data = await userApi.getPurchases()
        setPurchases(Array.isArray(data) ? data : [])
      } catch (err) {
        setPurchases([])
        setMessage(err.message || 'Failed to load purchases.')
      }
    }
    loadPurchases()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setCardsVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  const today = new Date()
  const thirtyDaysAhead = new Date()
  thirtyDaysAhead.setDate(today.getDate() + 30)

  const policyCards = purchases.map((purchase) => {
    const insurance = purchase.insurance || {}
    const status = getPurchaseStatus(purchase, today, thirtyDaysAhead)
    return {
      id: purchase._id,
      policyId: insurance._id,
      title: insurance.title ?? 'Untitled Policy',
      category: insurance.category ?? 'General',
      coverage: insurance.coverage ?? 0,
      premium: insurance.premium ?? 0,
      duration: insurance.duration ?? '--',
      startDate: formatDate(purchase.startDate),
      expiryDate: formatDate(purchase.endDate),
      status,
    }
  })

  const totalPolicies = policyCards.length
  const activePolicies = policyCards.filter((policy) => policy.status === 'Active' || policy.status === 'Expiring Soon').length
  const expiringSoon = policyCards.filter((policy) => policy.status === 'Expiring Soon').length

  const summaryCards = [
    { label: 'Total Policies', value: totalPolicies, icon: ShieldCheck },
    { label: 'Active Policies', value: activePolicies, icon: Activity },
    { label: 'Expiring Soon', value: expiringSoon, icon: AlertTriangle },
  ]

  const typeIcon = {
    Auto: Car,
    Health: HeartPulse,
    Home: Home,
    Life: ShieldCheck,
    Travel: Plane,
  }

  const statusClass = {
    Active: 'bg-green-500/20 text-green-300',
    'Expiring Soon': 'bg-amber-500/20 text-amber-300',
    Expired: 'bg-red-500/20 text-red-300',
  }

  return (
    <div className="rounded-3xl bg-[#0f172a] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      <section className="py-10 border-b border-white/10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My Policies</h1>
        <p className="text-slate-300 mt-3 text-base sm:text-lg">View and manage your active insurance coverage.</p>
        {message && <p className="text-sm text-amber-300 mt-4">{message}</p>}
      </section>

      <section className="py-10 border-b border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <article
                key={card.label}
                className="rounded-2xl bg-white/5 p-5 hover:-translate-y-1 hover:shadow-[0_16px_28px_-18px_rgba(0,0,0,0.85)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-slate-100" />
                </div>
                <p className="text-sm text-slate-300">{card.label}</p>
                <p className="text-3xl font-bold mt-2 leading-tight">{card.value}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="py-10">
        {policyCards.length === 0 ? (
          <div className="min-h-[320px] rounded-2xl border border-white/10 bg-slate-950/95 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-100">No policies purchased yet.</h3>
            <p className="mt-2 text-sm text-slate-300 max-w-md">Once you purchase a plan, your active coverage details will appear here.</p>
            <Link
              to="/user/insurance"
              className="mt-6 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-100 text-slate-900 font-medium hover:bg-white transition-colors duration-200"
            >
              Browse Insurance Plans
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {policyCards.map((policy, index) => {
              const PolicyIcon = typeIcon[policy.category] ?? ShieldCheck
              return (
                <article
                  key={policy.id}
                  className={`rounded-2xl border border-white/10 bg-slate-950/95 p-5 sm:p-6 shadow-sm hover:-translate-y-1 hover:shadow-[0_16px_28px_-18px_rgba(0,0,0,0.85)] transition-all duration-300 h-full flex flex-col justify-between ${
                    cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                  style={{ transitionDelay: `${index * 45}ms` }}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <PolicyIcon className="w-5 h-5 text-slate-100" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusClass[policy.status]}`}>
                        {policy.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">{policy.title}</h3>
                      <p className="text-xs uppercase tracking-wide text-slate-300 mt-1">{policy.category}</p>
                    </div>

                    <div className="space-y-1.5 text-sm">
                      <p className="text-slate-200"><span className="text-slate-300">Coverage Amount:</span> {formatCurrency(policy.coverage)}</p>
                      <p className="text-slate-200"><span className="text-slate-300">Premium Paid:</span> {formatCurrency(policy.premium)}</p>
                      <p className="text-slate-200"><span className="text-slate-300">Start Date:</span> {policy.startDate}</p>
                      <p className="text-slate-200 inline-flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-slate-300" />
                        <span><span className="text-slate-300">Expiry Date:</span> {policy.expiryDate}</span>
                      </p>
                    </div>
                  </div>
                  <div className="pt-5 flex gap-2">
                    <button
                      onClick={() => setSelectedPolicy(policy)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-white/20 text-sm font-medium text-slate-100 hover:bg-white/10 transition-colors duration-200"
                    >
                      View Details
                    </button>
                    {(policy.status === 'Expiring Soon' || policy.status === 'Expired') && (
                      <button
                        type="button"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-amber-300/35 text-sm font-medium text-amber-200 hover:bg-amber-500/10 transition-colors duration-200"
                      >
                        Renew Policy
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <Modal isOpen={Boolean(selectedPolicy)} onClose={() => setSelectedPolicy(null)} title="Policy Details">
        {selectedPolicy && (
          <div className="space-y-6 text-sm text-slate-200">
            <section>
              <h3 className="text-2xl font-semibold text-slate-50">{selectedPolicy.title}</h3>
              <p className="text-slate-300 mt-2">Category: {selectedPolicy.category}</p>
            </section>

            <section className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Coverage Breakdown</p>
                <p><span className="text-slate-300">Total Coverage:</span> <span className="font-semibold text-slate-100">{formatCurrency(selectedPolicy.coverage)}</span></p>
                <p className="mt-1"><span className="text-slate-300">Start Date:</span> <span className="font-semibold text-slate-100">{selectedPolicy.startDate}</span></p>
                <p className="mt-1"><span className="text-slate-300">Expiry Date:</span> <span className="font-semibold text-slate-100">{selectedPolicy.expiryDate}</span></p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Premium Details</p>
                <p><span className="text-slate-300">Premium Paid:</span> <span className="font-semibold text-slate-100">{formatCurrency(selectedPolicy.premium)}</span></p>
                <p className="mt-1"><span className="text-slate-300">Duration:</span> <span className="font-semibold text-slate-100">{selectedPolicy.duration}</span></p>
                <p className="mt-1"><span className="text-slate-300">Policy ID:</span> <span className="font-semibold text-slate-100">#{selectedPolicy.policyId || '--'}</span></p>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-900 font-medium hover:bg-white transition-colors duration-200"
              >
                Download PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
