import { useEffect, useMemo, useState } from 'react'
import { Layers3, ShieldCheck, TrendingUp, AlertTriangle, FolderOpen } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { adminApi } from '../../services/api'
import { formatCurrency } from '../../utils/formatCurrency'

function parseDuration(duration){
  const match = String(duration || '').match(/(\d+)\s*(months?|years?)?/i)
  if(!match) return { value: '', unit: 'months' }
  const unit = match[2]?.toLowerCase().startsWith('year') ? 'years' : 'months'
  return { value: match[1], unit }
}

export default function AdminInsurance(){
  const emptyForm = { title: '', category: '', premium: '', coverage: '', durationValue: '', durationUnit: 'months', description: '', status: 'active' }
  const [policies, setPolicies] = useState([])
  const [message, setMessage] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState(null)
  const [pendingDeletePolicy, setPendingDeletePolicy] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  async function loadPolicies(){
    try {
      const data = await adminApi.getInsurance()
      setPolicies(Array.isArray(data) ? data : [])
    } catch (err) {
      setPolicies([])
      setMessage(err.message || 'Failed to load policies.')
    }
  }

  useEffect(() => {
    async function run(){
      await loadPolicies()
    }
    run()
  }, [])

  async function handleCreate(e){
    e.preventDefault()
    setMessage('')
    const payload = {
      title: form.title,
      category: form.category,
      premium: Number(form.premium),
      coverage: Number(form.coverage),
      duration: Number(form.durationValue),
      description: form.description,
      status: form.status,
    }
    try {
      const created = await adminApi.createInsurance(payload)
      setPolicies((prev) => [created, ...prev])
      setForm(emptyForm)
      setIsCreateModalOpen(false)
      setMessage('Policy created.')
    } catch (err) {
      setMessage(err.message || 'Create failed.')
    }
  }

  function openEdit(policy){
    const parsed = parseDuration(policy.duration)
    setEditingPolicy({
      ...policy,
      durationValue: parsed.value,
      durationUnit: parsed.unit,
      description: policy.description ?? '',
      status: policy.status ?? 'active',
    })
  }

  async function handleUpdate(){
    if(!editingPolicy) return
    setMessage('')
    const payload = {
      title: editingPolicy.title,
      category: editingPolicy.category,
      premium: Number(editingPolicy.premium),
      coverage: Number(editingPolicy.coverage),
      duration: Number(editingPolicy.durationValue),
      description: editingPolicy.description,
      status: editingPolicy.status,
    }
    try {
      const updated = await adminApi.updateInsurance(editingPolicy._id, payload)
      setPolicies((prev) => prev.map((policy) => (policy._id === editingPolicy._id ? updated : policy)))
      setEditingPolicy(null)
      setMessage('Policy updated.')
    } catch (err) {
      setMessage(err.message || 'Update failed.')
    }
  }

  async function handleDelete(policyId){
    setMessage('')
    try {
      await adminApi.deleteInsurance(policyId)
      setPolicies((prev) => prev.filter((policy) => policy._id !== policyId))
      setMessage('Policy deleted.')
    } catch (err) {
      setMessage(err.message || 'Delete failed.')
    }
  }

  async function handleStatusToggle(policy){
    setMessage('')
    const nextStatus = policy.status === 'active' ? 'disabled' : 'active'
    try {
      const updated = await adminApi.updateInsurance(policy._id, { ...policy, status: nextStatus })
      setPolicies((prev) => prev.map((item) => (item._id === policy._id ? updated : item)))
      setMessage(`Policy ${nextStatus === 'active' ? 'enabled' : 'disabled'}.`)
    } catch (err) {
      setMessage(err.message || 'Status update failed.')
    }
  }

  const filteredPolicies = useMemo(
    () =>
      policies.filter((policy) => {
        const query = searchTerm.trim().toLowerCase()
        const searchMatch = !query || String(policy.title || '').toLowerCase().includes(query)
        const categoryMatch = categoryFilter === 'All' ? true : policy.category === categoryFilter
        const status = policy.status === 'disabled' ? 'Disabled' : 'Active'
        const statusMatch = statusFilter === 'All' ? true : status === statusFilter
        return searchMatch && categoryMatch && statusMatch
      }),
    [policies, searchTerm, categoryFilter, statusFilter]
  )

  const totalPolicies = policies.length
  const activePolicies = policies.filter((policy) => policy.status !== 'disabled').length
  const categoryCounts = policies.reduce((acc, policy) => {
    const key = policy.category || 'General'
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})
  const [mostPopularCategory, popularCount] = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0] ?? ['N/A', 0]
  const summaryCards = [
    { label: 'Total Policies', value: String(totalPolicies), subtext: 'All listed plans', icon: Layers3, iconClass: 'bg-blue-500/20 text-blue-300' },
    { label: 'Active Policies', value: String(activePolicies), subtext: 'Currently active', icon: ShieldCheck, iconClass: 'bg-emerald-500/20 text-emerald-300' },
    { label: 'Most Popular Category', value: mostPopularCategory, subtext: `${popularCount} plan${popularCount === 1 ? '' : 's'}`, icon: TrendingUp, iconClass: 'bg-violet-500/20 text-violet-300' },
  ]

  function resetFilters(){
    setSearchTerm('')
    setCategoryFilter('All')
    setStatusFilter('All')
  }

  return (
    <div className="rounded-3xl bg-[#0b1220] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      <section className="py-10 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">Insurance Plans</h1>
            <p className="text-slate-300 mt-3 text-base sm:text-lg">Create and manage available insurance policies.</p>
          </div>
          <button type="button" onClick={() => setIsCreateModalOpen(true)} className="h-10 px-4 rounded-xl bg-slate-100 text-slate-900 text-sm font-medium hover:bg-white transition-colors duration-200">+ Add New Policy</button>
        </div>
        {message && <p className="text-sm text-emerald-300 mt-4">{message}</p>}
      </section>

      <section className="py-10 border-b border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-2xl border border-white/20 bg-slate-900 p-5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconClass}`}><card.icon className="w-5 h-5" /></div>
              <p className="text-xs uppercase tracking-wide text-slate-300 mt-4">{card.label}</p>
              <p className="text-3xl font-bold mt-2 text-slate-50 leading-tight">{card.value}</p>
              <p className="text-xs text-slate-400 mt-1">{card.subtext}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-8 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by policy title" className="xl:col-span-2 rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/30 focus:border-white/25 transition-all" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200/30 focus:border-white/25 transition-all">
            <option value="All">All Categories</option><option value="Health">Health</option><option value="Auto">Auto</option><option value="Home">Home</option><option value="Life">Life</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200/30 focus:border-white/25 transition-all">
            <option value="All">All Status</option><option value="Active">Active</option><option value="Disabled">Disabled</option>
          </select>
        </div>
      </section>

      <section className="pb-4">
        {policies.length === 0 ? (
          <div className="min-h-[300px] rounded-2xl border border-white/10 bg-slate-950/95 px-6 py-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"><FolderOpen className="w-8 h-8 text-slate-300" /></div>
            <p className="mt-5 text-lg font-semibold text-slate-100">No insurance plans created yet.</p>
            <button type="button" onClick={() => setIsCreateModalOpen(true)} className="mt-5 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-900 text-sm font-medium hover:bg-white transition-colors duration-200">Create First Policy</button>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-950/95 overflow-hidden">
            {filteredPolicies.length === 0 ? (
              <div className="min-h-[240px] px-6 py-10 flex flex-col items-center justify-center text-center">
                <p className="text-lg font-semibold text-slate-100">No matching policies found.</p>
                <p className="mt-1 text-sm text-slate-400">Try changing your search or filters.</p>
                <button type="button" onClick={resetFilters} className="mt-5 px-4 py-2 rounded-xl border border-white/20 text-sm font-medium text-slate-100 hover:bg-white/10 transition-colors duration-200">Reset Filters</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Policy Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Category</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-300">Coverage Amount</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-300">Premium</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredPolicies.map((policy) => {
                      const status = policy.status === 'disabled' ? 'Disabled' : 'Active'
                      return (
                        <tr key={policy._id} className="transition-colors duration-200 hover:bg-white/[0.04]">
                          <td className="px-4 py-3 text-sm font-medium text-slate-100">{policy.title}</td>
                          <td className="px-4 py-3 text-sm"><span className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium bg-blue-500/20 text-blue-300">{policy.category}</span></td>
                          <td className="px-4 py-3 text-sm text-slate-200 text-right tabular-nums">{formatCurrency(policy.coverage)}</td>
                          <td className="px-4 py-3 text-sm text-slate-200 text-right tabular-nums">{formatCurrency(policy.premium)}</td>
                          <td className="px-4 py-3 text-sm text-slate-300">{policy.duration}</td>
                          <td className="px-4 py-3 text-sm"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>{status}</span></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openEdit(policy)} className="h-8 px-3 text-xs font-medium rounded-lg border border-white/20 text-slate-100 hover:bg-white/10 transition-colors">Edit</button>
                              <button onClick={() => handleStatusToggle(policy)} className="h-8 px-3 text-xs font-medium rounded-lg border border-white/20 text-slate-100 hover:bg-white/10 transition-colors">{status === 'Active' ? 'Disable' : 'Enable'}</button>
                              <button onClick={() => setPendingDeletePolicy(policy)} className="h-8 px-3 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">Delete</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>

      <Modal isOpen={Boolean(editingPolicy)} onClose={() => setEditingPolicy(null)} title="Edit Policy">
        {editingPolicy && (
          <div className="space-y-4">
            <input value={editingPolicy.title} onChange={(e) => setEditingPolicy((prev) => ({ ...prev, title: e.target.value }))} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100" />
            <select value={editingPolicy.category} onChange={(e) => setEditingPolicy((prev) => ({ ...prev, category: e.target.value }))} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100">
              <option value="Health">Health</option><option value="Auto">Auto</option><option value="Home">Home</option><option value="Life">Life</option>
            </select>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" value={editingPolicy.coverage} onChange={(e) => setEditingPolicy((prev) => ({ ...prev, coverage: e.target.value }))} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100" />
              <input type="number" value={editingPolicy.premium} onChange={(e) => setEditingPolicy((prev) => ({ ...prev, premium: e.target.value }))} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" value={editingPolicy.durationValue} onChange={(e) => setEditingPolicy((prev) => ({ ...prev, durationValue: e.target.value }))} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100" />
              <select value={editingPolicy.durationUnit} onChange={(e) => setEditingPolicy((prev) => ({ ...prev, durationUnit: e.target.value }))} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100"><option value="months">Months</option><option value="years">Years</option></select>
            </div>
            <textarea rows={4} value={editingPolicy.description} onChange={(e) => setEditingPolicy((prev) => ({ ...prev, description: e.target.value }))} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditingPolicy(null)} className="h-10 px-4 rounded-xl border border-white/20 text-slate-200">Cancel</button>
              <button type="button" onClick={handleUpdate} className="h-10 px-4 rounded-xl bg-slate-100 text-slate-900 font-medium">Update</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={Boolean(pendingDeletePolicy)} onClose={() => setPendingDeletePolicy(null)} title="Confirm Delete">
        {pendingDeletePolicy && (
          <div className="space-y-5 text-sm text-slate-200">
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-300 flex items-center justify-center"><AlertTriangle className="w-5 h-5" /></div>
                <div><p className="font-semibold text-red-200">Are you sure you want to delete this policy?</p><p className="text-red-100/90 mt-1">Policy: <span className="font-medium">{pendingDeletePolicy.title}</span></p></div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setPendingDeletePolicy(null)} className="h-10 px-4 rounded-xl border border-white/20 text-slate-200">Cancel</button>
              <button type="button" onClick={async () => { await handleDelete(pendingDeletePolicy._id); setPendingDeletePolicy(null) }} className="h-10 px-4 rounded-xl bg-red-600 text-white font-medium">Confirm Delete</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New Policy">
        <form onSubmit={handleCreate} className="space-y-4">
          <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Policy Title" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100" required />
          <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100" required>
            <option value="">Select category</option><option value="Health">Health</option><option value="Auto">Auto</option><option value="Home">Home</option><option value="Life">Life</option>
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" value={form.coverage} onChange={(e) => setForm((prev) => ({ ...prev, coverage: e.target.value }))} placeholder="Coverage" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100" required />
            <input type="number" value={form.premium} onChange={(e) => setForm((prev) => ({ ...prev, premium: e.target.value }))} placeholder="Premium" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" value={form.durationValue} onChange={(e) => setForm((prev) => ({ ...prev, durationValue: e.target.value }))} placeholder="Duration" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100" required />
            <select value={form.durationUnit} onChange={(e) => setForm((prev) => ({ ...prev, durationUnit: e.target.value }))} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100"><option value="months">Months</option><option value="years">Years</option></select>
          </div>
          <textarea rows={4} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description" className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="h-10 px-4 rounded-xl border border-white/20 text-slate-200">Cancel</button>
            <button type="submit" className="h-10 px-4 rounded-xl bg-slate-100 text-slate-900 font-medium">Create</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
