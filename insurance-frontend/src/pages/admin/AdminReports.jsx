import { useEffect, useRef, useState } from 'react'
import { Download, ChevronDown, FileText, Sheet } from 'lucide-react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { adminApi } from '../../services/api'
import { formatCurrency } from '../../utils/formatCurrency'

export default function AdminReports(){
  const [reports, setReports] = useState([])
  const [dateRange, setDateRange] = useState('30d')
  const [category, setCategory] = useState('All Categories')
  const [isExportOpen, setIsExportOpen] = useState(false)
  const exportRef = useRef(null)

  useEffect(() => {
    async function loadReports(){
      try {
        const data = await adminApi.getReports()
        setReports(Array.isArray(data) ? data : [])
      } catch {
        setReports([])
      }
    }
    loadReports()
  }, [])

  useEffect(() => {
    function handleOutsideClick(event){
      if(exportRef.current && !exportRef.current.contains(event.target)) setIsExportOpen(false)
    }
    window.addEventListener('mousedown', handleOutsideClick)
    return () => window.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const totalRevenue = reports.reduce((sum, item) => sum + (item.revenue || 0), 0)
  const averageMonthlyRevenue = reports.length ? totalRevenue / reports.length : 0

  return (
    <div className="rounded-3xl bg-[#0b1220] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 gap-y-10">
        <section className="pb-8 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">Reports & Analytics</h1>
              <p className="text-slate-300 mt-3 text-base sm:text-lg">System insights and performance metrics.</p>
            </div>
            <div className="relative" ref={exportRef}>
              <button type="button" onClick={() => setIsExportOpen((prev) => !prev)} className="h-11 px-4 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-400 transition-all duration-200">
                <Download className="h-4 w-4" />Export Report
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExportOpen ? 'rotate-180' : ''}`} />
              </button>
              {isExportOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/15 bg-slate-900 shadow-lg shadow-black/40 p-1 z-20">
                  <button type="button" onClick={() => setIsExportOpen(false)} className="w-full h-10 px-3 rounded-lg inline-flex items-center gap-2 text-sm text-slate-200 hover:bg-white/10 transition-colors"><FileText className="h-4 w-4" />Export as PDF</button>
                  <button type="button" onClick={() => setIsExportOpen(false)} className="w-full h-10 px-3 rounded-lg inline-flex items-center gap-2 text-sm text-slate-200 hover:bg-white/10 transition-colors"><Sheet className="h-4 w-4" />Export as CSV</button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="pb-8 border-b border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100">
              <option value="7d">Last 7 Days</option><option value="30d">Last 30 Days</option><option value="year">This Year</option>
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100">
              <option value="All Categories">All Categories</option><option value="Health">Health</option><option value="Auto">Auto</option><option value="Home">Home</option><option value="Life">Life</option>
            </select>
            <button type="button" className="h-10 rounded-xl border border-white/20 bg-white/5 text-sm font-medium text-slate-100 hover:bg-white/10 transition-all duration-200">Apply</button>
          </div>
        </section>

        <section className="pb-8 border-b border-white/10">
          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-100">Revenue Overview</h2>
                <p className="text-sm text-slate-300 mt-1">Monthly revenue trend across the selected period.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 w-full sm:w-auto">
                <div className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2"><p className="text-xs uppercase tracking-wide text-slate-400">Total Revenue</p><p className="text-lg font-semibold text-slate-100 mt-1">{formatCurrency(totalRevenue)}</p></div>
                <div className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2"><p className="text-xs uppercase tracking-wide text-slate-400">Avg Monthly Revenue</p><p className="text-lg font-semibold text-slate-100 mt-1">{formatCurrency(Math.round(averageMonthlyRevenue))}</p></div>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-3 sm:p-4">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={reports}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                  <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(148,163,184,0.25)', borderRadius: '12px', color: '#e2e8f0' }} labelStyle={{ color: '#f8fafc', fontWeight: 600 }} formatter={(value) => [formatCurrency(value), 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={3} dot={{ r: 3, fill: '#38bdf8' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>
      </div>
    </div>
  )
}
