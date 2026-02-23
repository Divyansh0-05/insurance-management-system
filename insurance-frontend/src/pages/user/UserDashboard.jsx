import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Clock3, Landmark, BadgeCheck, FilePlus2, SearchCheck, UserRoundCog } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import useAuth from '../../hooks/useAuth'
import { userApi } from '../../services/api'
import { formatCurrency } from '../../utils/formatCurrency'

function claimVariant(status){
  if(status === 'approved') return 'success'
  if(status === 'pending') return 'warning'
  return 'danger'
}

export default function UserDashboard(){
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [claims, setClaims] = useState([])

  useEffect(() => {
    async function loadData(){
      try {
        const [dashboardData, purchasesData, claimsData] = await Promise.all([
          userApi.getDashboard(),
          userApi.getPurchases(),
          userApi.getClaims(),
        ])
        setDashboard(dashboardData)
        setPurchases(Array.isArray(purchasesData) ? purchasesData : [])
        setClaims(Array.isArray(claimsData) ? claimsData : [])
      } catch {
        setDashboard({ totalCoverage: 0, totalPurchases: 0, totalClaims: 0 })
        setPurchases([])
        setClaims([])
      }
    }
    loadData()
  }, [])

  const activePolicies = useMemo(
    () =>
      purchases
        .filter((item) => String(item.status).toLowerCase() === 'active')
        .slice(0, 4)
        .map((item) => ({
          id: item._id,
          title: item.insurance?.title ?? 'Untitled Policy',
          category: item.insurance?.category ?? 'General',
          coverage: item.insurance?.coverage ?? 0,
          expiryDate: item.endDate,
          status: 'Active',
        })),
    [purchases]
  )

  const stats = [
    { label: 'Active Policies', value: activePolicies.length, icon: ShieldCheck, format: (n) => Math.round(n).toString() },
    { label: 'Pending Claims', value: claims.filter((claim) => claim.status === 'pending').length, icon: Clock3, format: (n) => Math.round(n).toString() },
    { label: 'Total Coverage', value: dashboard?.totalCoverage ?? 0, icon: Landmark, format: (n) => formatCurrency(Math.round(n)) },
    { label: 'Claims Approved', value: claims.filter((claim) => claim.status === 'approved').length, icon: BadgeCheck, format: (n) => Math.round(n).toString() },
  ]

  const recentClaims = claims.slice(0, 5)
  const totalClaims = Math.max(claims.length, 1)
  const approvedCount = claims.filter((claim) => claim.status === 'approved').length
  const pendingCount = claims.filter((claim) => claim.status === 'pending').length
  const rejectedCount = claims.filter((claim) => claim.status === 'rejected').length

  const claimProgress = [
    { label: 'Approved', count: approvedCount, percent: Math.round((approvedCount / totalClaims) * 100), barClass: 'bg-emerald-400', textClass: 'text-emerald-300' },
    { label: 'Pending', count: pendingCount, percent: Math.round((pendingCount / totalClaims) * 100), barClass: 'bg-amber-400', textClass: 'text-amber-300' },
    { label: 'Rejected', count: rejectedCount, percent: Math.round((rejectedCount / totalClaims) * 100), barClass: 'bg-rose-400', textClass: 'text-rose-300' },
  ]

  const quickActions = [
    { title: 'Raise Claim', to: '/user/claims', note: 'Submit a new claim and monitor progress instantly.', icon: FilePlus2 },
    { title: 'Browse Plans', to: '/user/insurance', note: 'Compare plans and find coverage that fits your needs.', icon: SearchCheck },
    { title: 'Update Profile', to: '/user/profile', note: 'Keep personal and contact information current.', icon: UserRoundCog },
  ]

  return (
    <div className="rounded-3xl bg-[#0f172a] p-4 sm:p-6 lg:p-8 text-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-10">
        <section className="md:col-span-12 relative overflow-hidden rounded-2xl bg-white/5 p-6 sm:p-7">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-indigo-300/70 to-cyan-300/50" />
          <div className="pl-2">
            <p className="text-sm text-slate-300">Welcome back, {user?.name ?? 'User'}.</p>
            <h1 className="text-3xl font-bold mt-1">Your Insurance Dashboard</h1>
            <p className="text-slate-300 mt-3 max-w-2xl">Here&apos;s an overview of your coverage.</p>
          </div>
        </section>

        <section className="md:col-span-12">
          <h2 className="text-xl font-semibold tracking-tight mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <article key={stat.label} className="xl:col-span-3 rounded-2xl bg-white/5 p-5 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-slate-100" />
                  </div>
                  <p className="text-sm text-slate-300">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2 leading-tight">{stat.format(stat.value)}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="md:col-span-12">
          <h2 className="text-xl font-semibold tracking-tight mb-4">Active Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
            {activePolicies.map((policy) => (
              <article key={policy.id} className="xl:col-span-3 rounded-2xl bg-white/5 p-5 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs uppercase tracking-wide text-slate-300">{policy.category}</p>
                    <Badge variant="success">{policy.status}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold">{policy.title}</h3>
                  <p className="text-sm text-slate-300">Coverage Amount: {formatCurrency(policy.coverage)}</p>
                  <p className="text-sm text-slate-300">Expiry Date: {new Date(policy.expiryDate).toLocaleDateString('en-US')}</p>
                </div>
                <Link to="/user/purchases" className="mt-5 inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15 transition-colors">
                  View Details
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="md:col-span-12">
          <h2 className="text-xl font-semibold tracking-tight mb-4">Claims Overview</h2>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <article className="xl:col-span-5 rounded-2xl bg-white/5 p-6">
              <h3 className="text-lg font-semibold mb-5">Claim Status Progress</h3>
              <div className="space-y-5">
                {claimProgress.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-200">{item.label}</p>
                      <p className={`text-sm font-semibold ${item.textClass}`}>{item.count} ({item.percent}%)</p>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div className={`h-full ${item.barClass} transition-all duration-700 ease-out`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="xl:col-span-7 rounded-2xl bg-white/5 p-6">
              <h3 className="text-lg font-semibold mb-5">Recent Claims</h3>
              <ul className="divide-y divide-white/10">
                {recentClaims.map((claim) => (
                  <li key={claim._id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{claim.insuranceId?.title ?? 'Unknown Policy'}</p>
                      <p className="text-xs text-slate-300 mt-0.5">{new Date(claim.createdAt).toLocaleDateString('en-US')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-slate-200">{formatCurrency(claim.amount)}</p>
                      <Badge variant={claimVariant(claim.status)}>{String(claim.status || '').toUpperCase()}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="md:col-span-12">
          <h2 className="text-xl font-semibold tracking-tight mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.to} className="group rounded-2xl bg-white/5 p-5 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4 transition-all duration-300">
                  <action.icon className="w-7 h-7 text-slate-100" />
                </div>
                <p className="font-semibold">{action.title}</p>
                <p className="text-sm text-slate-300 mt-1">{action.note}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
