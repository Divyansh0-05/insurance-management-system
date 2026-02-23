import { useEffect, useMemo, useState } from 'react'
import { Users, UserCheck, ShieldCheck, Eye, UserCog, Power, Trash2, AlertTriangle, SearchX } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { adminApi } from '../../services/api'

function formatJoinedDate(value){
  const date = new Date(value)
  if(Number.isNaN(date.getTime())) return '--'
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

function userId(user){
  return user?._id ?? user?.id
}

export default function AdminUsers(){
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [pendingDeleteUser, setPendingDeleteUser] = useState(null)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  async function loadUsers(){
    try {
      const data = await adminApi.getUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setUsers([])
      setMessage(err.message || 'Failed to load users.')
    }
  }

  useEffect(() => {
    async function run(){
      await loadUsers()
    }
    run()
  }, [])

  async function handleView(id){
    try {
      const data = await adminApi.getUserById(id)
      setSelectedUser(data)
    } catch (err) {
      setMessage(err.message || 'Failed to load user details.')
    }
  }

  async function handleRoleUpdate(user){
    setMessage('')
    const nextRole = user.role === 'admin' ? 'user' : 'admin'
    try {
      const updated = await adminApi.updateUser(userId(user), { role: nextRole })
      setUsers((prev) => prev.map((item) => (userId(item) === userId(user) ? updated : item)))
      setMessage('User role updated.')
    } catch (err) {
      setMessage(err.message || 'Update failed.')
    }
  }

  async function handleStatusToggle(user){
    setMessage('')
    const nextIsActive = user.isActive === false
    try {
      const updated = await adminApi.updateUser(userId(user), { isActive: nextIsActive })
      setUsers((prev) => prev.map((item) => (userId(item) === userId(user) ? updated : item)))
      setMessage(`User ${nextIsActive ? 'enabled' : 'disabled'}.`)
    } catch (err) {
      setMessage(err.message || 'Status update failed.')
    }
  }

  async function handleDelete(id){
    setMessage('')
    try {
      await adminApi.deleteUser(id)
      await loadUsers()
      setMessage('User deactivated.')
    } catch (err) {
      setMessage(err.message || 'Delete failed.')
    }
  }

  const tableRows = useMemo(
    () =>
      users
        .filter((user) => {
          const query = searchTerm.trim().toLowerCase()
          const name = String(user.name || '').toLowerCase()
          const email = String(user.email || '').toLowerCase()
          const searchMatch = !query || name.includes(query) || email.includes(query)
          const roleMatch = roleFilter === 'All' ? true : user.role === roleFilter.toLowerCase()
          const status = user.isActive === false ? 'Disabled' : 'Active'
          const statusMatch = statusFilter === 'All' ? true : status === statusFilter
          return searchMatch && roleMatch && statusMatch
        })
        .map((user) => ({
          ...user,
          id: userId(user),
          joinedDate: formatJoinedDate(user.createdAt),
          status: user.isActive === false ? 'Disabled' : 'Active',
        })),
    [users, searchTerm, roleFilter, statusFilter]
  )

  const summaryCards = [
    { label: 'Total Users', value: users.length, icon: Users, iconClass: 'bg-blue-500/20 text-blue-300' },
    { label: 'Active Users', value: users.filter((u) => u.isActive !== false).length, icon: UserCheck, iconClass: 'bg-emerald-500/20 text-emerald-300' },
    { label: 'Admin Accounts', value: users.filter((u) => u.role === 'admin').length, icon: ShieldCheck, iconClass: 'bg-violet-500/20 text-violet-300' },
  ]

  function resetFilters(){
    setSearchTerm('')
    setRoleFilter('All')
    setStatusFilter('All')
  }

  return (
    <div className="rounded-3xl bg-[#0b1220] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      <section className="py-10 border-b border-white/10">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">User Management</h1>
            <p className="text-slate-300 mt-3 text-base sm:text-lg">Manage platform users and permissions.</p>
          </div>
          <button type="button" className="px-4 py-2.5 rounded-xl border border-white/20 text-sm font-medium text-slate-100 hover:bg-white/10 transition-colors duration-200">+ Add Admin</button>
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
            </article>
          ))}
        </div>
      </section>

      <section className="py-8 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name or email" className="xl:col-span-2 rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/30 focus:border-white/25 transition-all" />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200/30 focus:border-white/25 transition-all">
            <option value="All">All Roles</option><option value="User">User</option><option value="Admin">Admin</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200/30 focus:border-white/25 transition-all">
            <option value="All">All Status</option><option value="Active">Active</option><option value="Disabled">Disabled</option>
          </select>
        </div>
      </section>

      <section className="py-10">
        <div className="rounded-2xl border border-white/10 bg-slate-950/95 overflow-hidden">
          {tableRows.length === 0 ? (
            <div className="min-h-[280px] px-6 py-10 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"><SearchX className="w-6 h-6 text-slate-300" /></div>
              <p className="mt-4 text-lg font-semibold text-slate-100">No users found.</p>
              <button type="button" onClick={resetFilters} className="mt-5 px-4 py-2 rounded-xl border border-white/20 text-sm font-medium text-slate-100 hover:bg-white/10 transition-colors duration-200">Reset Filters</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Avatar</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Joined Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {tableRows.map((row) => (
                    <tr key={row.id} className="transition-colors duration-200 hover:bg-white/[0.04]">
                      <td className="px-4 py-3"><div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-slate-100 flex items-center justify-center">{(row.name || 'U').split(' ').filter(Boolean).slice(0, 2).map((word) => word[0]?.toUpperCase()).join('')}</div></td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-100">{row.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{row.email}</td>
                      <td className="px-4 py-3 text-sm"><Badge variant={row.role === 'admin' ? 'info' : 'default'} className={row.role === 'admin' ? 'bg-violet-500/20 text-violet-300' : 'bg-slate-500/20 text-slate-200'}>{row.role}</Badge></td>
                      <td className="px-4 py-3 text-sm"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${row.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>{row.status}</span></td>
                      <td className="px-4 py-3 text-sm text-slate-300">{row.joinedDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleView(row.id)} className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-white/20 text-slate-200 hover:bg-white/10 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleRoleUpdate(row)} className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-blue-400/30 text-blue-300 hover:bg-blue-500/15 transition-colors" title="Edit Role"><UserCog className="w-4 h-4" /></button>
                          <button onClick={() => handleStatusToggle(row)} className={`w-8 h-8 inline-flex items-center justify-center rounded-lg border transition-colors ${row.status === 'Active' ? 'border-amber-400/30 text-amber-300 hover:bg-amber-500/15' : 'border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/15'}`} title={row.status === 'Active' ? 'Disable User' : 'Enable User'}><Power className="w-4 h-4" /></button>
                          <button onClick={() => setPendingDeleteUser(row)} className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-red-400/30 text-red-300 hover:bg-red-500/15 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <Modal isOpen={Boolean(selectedUser)} onClose={() => setSelectedUser(null)} title="User Details">
        {selectedUser && (
          <div className="space-y-6 text-sm text-slate-200">
            <section><h3 className="text-xl font-semibold text-slate-50">{selectedUser.name}</h3><p className="text-slate-300 mt-1">User ID: {userId(selectedUser)}</p></section>
            <section className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4"><p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Full Name</p><p className="font-medium text-slate-100">{selectedUser.name}</p></div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4"><p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Email</p><p className="font-medium text-slate-100">{selectedUser.email}</p></div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4"><p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Role</p><Badge variant={selectedUser.role === 'admin' ? 'info' : 'default'} className={selectedUser.role === 'admin' ? 'bg-violet-500/20 text-violet-300' : 'bg-slate-500/20 text-slate-200'}>{selectedUser.role}</Badge></div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4"><p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Total Policies</p><p className="font-medium text-slate-100">{selectedUser.totalPolicies ?? 0}</p></div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4"><p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Total Claims</p><p className="font-medium text-slate-100">{selectedUser.totalClaims ?? 0}</p></div>
            </section>
          </div>
        )}
      </Modal>

      <Modal isOpen={Boolean(pendingDeleteUser)} onClose={() => setPendingDeleteUser(null)} title="Confirm Delete">
        {pendingDeleteUser && (
          <div className="space-y-5 text-sm text-slate-200">
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-300 flex items-center justify-center"><AlertTriangle className="w-5 h-5" /></div>
                <div><p className="font-semibold text-red-200">This action cannot be undone.</p><p className="text-red-100/90 mt-1">You are about to deactivate <span className="font-medium">{pendingDeleteUser.name}</span>.</p></div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setPendingDeleteUser(null)} className="px-4 py-2 rounded-xl border border-white/20 text-slate-200">Cancel</button>
              <button type="button" onClick={async () => { await handleDelete(pendingDeleteUser.id); setPendingDeleteUser(null) }} className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium">Confirm Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
