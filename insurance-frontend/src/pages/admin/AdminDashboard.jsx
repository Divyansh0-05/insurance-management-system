import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, ShieldCheck, FileText, Landmark, PlusCircle, UserCog, ClipboardCheck, FileBarChart2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import RevenueChart from '../../components/charts/RevenueChart'
import { adminApi } from '../../services/api'
import { formatCurrency } from '../../utils/formatCurrency'

function getActivityStatusClass(status){
  if(status === 'approved') return 'bg-emerald-500/20 text-emerald-300'
  if(status === 'pending') return 'bg-amber-500/20 text-amber-300'
  return 'bg-rose-500/20 text-rose-300'
}

export default function AdminDashboard(){
  const [dashboard, setDashboard] = useState(null)
  const [reports, setReports] = useState([])
  const [recentClaims, setRecentClaims] = useState([])
  const [revenueRange, setRevenueRange] = useState('This Year')

  useEffect(() => {
    async function loadDashboard(){
      try {
        const [dashboardData, reportsData, claimsData] = await Promise.all([
          adminApi.getDashboard(),
          adminApi.getReports(),
          adminApi.getClaims(),
        ])
        setDashboard(dashboardData)
        setReports(Array.isArray(reportsData) ? reportsData : [])
        setRecentClaims((Array.isArray(claimsData) ? claimsData : []).slice(0, 4))
      } catch {
        setDashboard({ totalUsers: 0, totalPolicies: 0, totalClaims: 0, revenue: 0, claimStatus: { approved: 0, pending: 0, rejected: 0 } })
        setReports([])
        setRecentClaims([])
      }
    }
    loadDashboard()
  }, [])

  const stats = [
    { label: 'Total Users', value: dashboard?.totalUsers ?? 0, trend: '', icon: Users, iconStyle: 'bg-blue-500/20 text-blue-300', format: (n) => Math.round(n).toString() },
    { label: 'Total Policies', value: dashboard?.totalPolicies ?? 0, trend: '', icon: ShieldCheck, iconStyle: 'bg-emerald-500/20 text-emerald-300', format: (n) => Math.round(n).toString() },
    { label: 'Total Claims', value: dashboard?.totalClaims ?? 0, trend: '', icon: FileText, iconStyle: 'bg-amber-500/20 text-amber-300', format: (n) => Math.round(n).toString() },
    { label: 'Total Revenue', value: dashboard?.revenue ?? 0, trend: '', icon: Landmark, iconStyle: 'bg-violet-500/20 text-violet-300', format: (n) => formatCurrency(Math.round(n)) },
  ]

  const claimStatusData = [
    { name: 'Approved', value: dashboard?.claimStatus?.approved ?? 0, color: '#34d399' },
    { name: 'Pending', value: dashboard?.claimStatus?.pending ?? 0, color: '#fbbf24' },
    { name: 'Rejected', value: dashboard?.claimStatus?.rejected ?? 0, color: '#f87171' },
  ]

  const quickActions = [
    { title: 'Add Insurance Plan', to: '/admin/insurance', description: 'Create a new coverage option for users.', icon: PlusCircle },
    { title: 'Manage Users', to: '/admin/users', description: 'Review accounts and adjust user roles.', icon: UserCog },
    { title: 'Review Claims', to: '/admin/claims', description: 'Process pending claims and update status.', icon: ClipboardCheck },
    { title: 'Generate Report', to: '/admin/reports', description: 'Open analytics and export operational reports.', icon: FileBarChart2 },
  ]

  return (
    <div className="rounded-3xl bg-[#0b1220] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-10">
        <section className="md:col-span-12 py-10 border-b border-white/10">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">Admin Overview</h1>
            <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-white/10 border border-white/15 text-slate-200">Admin Panel</span>
          </div>
          <p className="text-slate-300 mt-3 text-base sm:text-lg max-w-2xl">System performance and operational insights.</p>
        </section>

        <section className="md:col-span-12">
          <h2 className="text-xl font-semibold text-slate-100 tracking-tight mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-4">
            {stats.map((stat) => (
              <article key={stat.label} className="xl:col-span-3 rounded-3xl border border-white/20 bg-slate-900 p-5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconStyle}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-xs uppercase tracking-wide text-slate-300 mt-4">{stat.label}</p>
                <p className="text-3xl font-bold mt-2 text-slate-50 leading-tight">{stat.format(stat.value)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="md:col-span-12">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <article className="xl:col-span-7 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-semibold text-slate-100 tracking-tight">Revenue Overview</h2>
                <div className="inline-flex rounded-xl border border-white/15 bg-slate-900/70 p-1">
                  {['This Month', 'This Year'].map((range) => (
                    <button key={range} type="button" onClick={() => setRevenueRange(range)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${revenueRange === range ? 'bg-white/15 text-slate-100' : 'text-slate-300 hover:text-slate-100'}`}>
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-white p-3">
                <RevenueChart data={reports} />
              </div>
            </article>

            <article className="xl:col-span-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-semibold text-slate-100 tracking-tight mb-4">Claims Status</h2>
              <div className="rounded-2xl bg-white p-3">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={claimStatusData} dataKey="value" nameKey="name" innerRadius={68} outerRadius={100} paddingAngle={2} stroke="#ffffff" strokeWidth={2}>
                      {claimStatusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {claimStatusData.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <p className="text-xs text-slate-300">{item.name}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-100 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="md:col-span-12">
          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold text-slate-100 tracking-tight mb-4">Recent Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {recentClaims.map((claim) => (
                    <tr key={claim._id} className="transition-colors duration-200 hover:bg-white/5">
                      <td className="px-4 py-3 text-sm font-medium text-slate-100">Claim Submitted</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{claim.insuranceId?.title ?? 'Unknown Policy'} by {claim.userId?.name ?? 'Unknown User'}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{new Date(claim.createdAt).toLocaleDateString('en-US')}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getActivityStatusClass(claim.status)}`}>{String(claim.status || '').toUpperCase()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section className="md:col-span-12">
          <h2 className="text-xl font-semibold text-slate-100 tracking-tight mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.to} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <action.icon className="w-5 h-5 text-slate-100" />
                </div>
                <p className="font-semibold text-slate-100">{action.title}</p>
                <p className="text-sm text-slate-300 mt-1">{action.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
