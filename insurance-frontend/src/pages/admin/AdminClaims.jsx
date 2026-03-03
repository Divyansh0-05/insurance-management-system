import { useEffect, useMemo, useState } from 'react'
import { FileStack, Clock3, CheckCircle2, XCircle, Eye, Check, Ban, Inbox } from 'lucide-react'
import { adminApi } from '../../services/api'
import Modal from '../../components/ui/Modal'

function normalizeStatus(status){
  const key = String(status || '').toLowerCase()
  if(key === 'approved') return 'Approved'
  if(key === 'rejected') return 'Rejected'
  return 'Pending'
}

function getStatusClass(status){
  if(status === 'Approved') return 'bg-emerald-500/20 text-emerald-300'
  if(status === 'Rejected') return 'bg-rose-500/20 text-rose-300'
  return 'bg-amber-500/20 text-amber-300'
}

function formatSubmissionDate(value){
  const date = new Date(value)
  if(Number.isNaN(date.getTime())) return '--'
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

function resolveDocumentUrl(value){
  const raw = String(value || '').trim()
  if(!raw) return ''
  if(raw.startsWith('http://') || raw.startsWith('https://')) return raw
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
  const apiOrigin = apiBase.startsWith('http')
    ? apiBase.replace(/\/api\/?$/, '')
    : window.location.origin

  if(raw.startsWith('/uploads/')) return `${apiOrigin}${raw}`

  const normalized = raw.replace(/\\/g, '/')
  const marker = '/uploads/'
  const markerIndex = normalized.toLowerCase().indexOf(marker)
  if(markerIndex >= 0){
    const suffix = normalized.slice(markerIndex + marker.length)
    return `${apiOrigin}/uploads/${suffix}`
  }

  return ''
}

function toRow(claim){
  const status = normalizeStatus(claim.status)
  return {
    id: claim._id,
    claimCode: `CLM-${String(claim._id || '').slice(-6).toUpperCase()}`,
    user: claim.userId?.name ?? 'Unknown User',
    userEmail: claim.userId?.email ?? '',
    policy: claim.insuranceId?.title ?? 'Unknown Policy',
    amount: Number(claim.amount ?? 0),
    submissionDate: formatSubmissionDate(claim.createdAt),
    submissionDateRaw: claim.createdAt,
    status,
    description: claim.description ?? '',
    adminRemarks: claim.adminRemarks ?? '',
    documents: claim.documents ?? '',
    documentUrl: resolveDocumentUrl(claim.documents),
  }
}

export default function AdminClaims(){
  const [claims, setClaims] = useState([])
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [approveTarget, setApproveTarget] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejectRemarks, setRejectRemarks] = useState('')
  const [rejectError, setRejectError] = useState('')
  const [rowsVisible, setRowsVisible] = useState(false)

  useEffect(() => {
    async function loadClaims(){
      try {
        const data = await adminApi.getClaims()
        setClaims((Array.isArray(data) ? data : []).map(toRow))
      } catch (err) {
        setClaims([])
        setMessage(err.message || 'Failed to load claims.')
      }
    }
    loadClaims()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setRowsVisible(true), 50)
    return () => window.clearTimeout(timer)
  }, [claims, searchTerm, statusFilter, dateFilter])

  async function handleApprove(claimId){
    setMessage('')
    try {
      const updated = await adminApi.approveClaim(claimId)
      const next = toRow(updated)
      setClaims((prev) => prev.map((claim) => (claim.id === claimId ? next : claim)))
      setMessage('Claim approved.')
    } catch (err) {
      setMessage(err.message || 'Approve failed.')
    }
  }

  async function handleReject(claimId, remarks){
    setMessage('')
    try {
      const updated = await adminApi.rejectClaim(claimId, { adminRemarks: remarks })
      const next = toRow(updated)
      setClaims((prev) => prev.map((claim) => (claim.id === claimId ? next : claim)))
      setMessage('Claim rejected.')
    } catch (err) {
      setMessage(err.message || 'Reject failed.')
    }
  }

  const filteredRows = useMemo(
    () =>
      claims.filter((row) => {
        const query = searchTerm.trim().toLowerCase()
        const searchMatch = !query || row.user.toLowerCase().includes(query) || row.policy.toLowerCase().includes(query)
        const statusMatch = statusFilter === 'All' ? true : row.status === statusFilter
        const dateMatch = !dateFilter || row.submissionDateRaw?.slice(0, 10) === dateFilter
        return searchMatch && statusMatch && dateMatch
      }),
    [claims, searchTerm, statusFilter, dateFilter]
  )

  const summaryCards = [
    { label: 'Total Claims', value: claims.length, icon: FileStack, iconClass: 'bg-blue-500/20 text-blue-300' },
    { label: 'Pending', value: claims.filter((claim) => claim.status === 'Pending').length, icon: Clock3, iconClass: 'bg-amber-500/20 text-amber-300' },
    { label: 'Approved', value: claims.filter((claim) => claim.status === 'Approved').length, icon: CheckCircle2, iconClass: 'bg-emerald-500/20 text-emerald-300' },
    { label: 'Rejected', value: claims.filter((claim) => claim.status === 'Rejected').length, icon: XCircle, iconClass: 'bg-rose-500/20 text-rose-300' },
  ]

  function resetFilters(){
    setSearchTerm('')
    setStatusFilter('All')
    setDateFilter('')
  }

  async function onConfirmApprove(){
    if(!approveTarget) return
    await handleApprove(approveTarget.id)
    setApproveTarget(null)
  }

  async function onConfirmReject(){
    const remarks = rejectRemarks.trim()
    if(!remarks){
      setRejectError('Please enter rejection remarks.')
      return
    }
    if(!rejectTarget) return
    await handleReject(rejectTarget.id, remarks)
    setRejectTarget(null)
    setRejectRemarks('')
    setRejectError('')
  }

  return (
    <div className="rounded-3xl bg-[#0b1220] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      <section className="py-10 border-b border-white/10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">Claims Management</h1>
        <p className="text-slate-300 mt-3 text-base sm:text-lg">Review and process submitted insurance claims.</p>
        {message && <p className="text-sm text-emerald-300 mt-4">{message}</p>}
      </section>

      <section className="py-10 border-b border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-2xl border border-white/20 bg-slate-900 p-5 transition-all duration-300">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconClass}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-xs uppercase tracking-wide text-slate-300 mt-4">{card.label}</p>
              <p className="text-3xl font-bold mt-2 text-slate-50 leading-tight">{card.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-8 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user or policy"
            className="xl:col-span-2 rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/30 focus:border-white/25 transition-all"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200/30 focus:border-white/25 transition-all"
          >
            <option value="All" className="bg-slate-900 text-slate-100">All Status</option>
            <option value="Pending" className="bg-slate-900 text-slate-100">Pending</option>
            <option value="Approved" className="bg-slate-900 text-slate-100">Approved</option>
            <option value="Rejected" className="bg-slate-900 text-slate-100">Rejected</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200/30 focus:border-white/25 transition-all"
          />
        </div>
      </section>

      <section className="py-10">
        <div className="rounded-2xl border border-white/10 bg-slate-950/95 overflow-hidden">
          {filteredRows.length === 0 ? (
            <div className="min-h-[300px] flex items-center justify-center p-8">
              <div className="text-center">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Inbox className="h-7 w-7 text-slate-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-100">No claims submitted yet.</h3>
                <button onClick={resetFilters} className="mt-4 h-10 px-4 rounded-lg border border-white/20 bg-white/5 text-sm text-slate-200 hover:bg-white/10 transition-all duration-200">
                  Reset filters
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 align-middle text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Claim ID</th>
                    <th className="px-4 py-3 align-middle text-left text-xs font-semibold uppercase tracking-wide text-slate-300">User Name</th>
                    <th className="px-4 py-3 align-middle text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Policy Name</th>
                    <th className="px-4 py-3 align-middle text-right text-xs font-semibold uppercase tracking-wide text-slate-300">Claim Amount</th>
                    <th className="px-4 py-3 align-middle text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Submission Date</th>
                    <th className="px-4 py-3 align-middle text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Status</th>
                    <th className="px-4 py-3 align-middle text-left text-xs font-semibold uppercase tracking-wide text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredRows.map((row, index) => (
                    <tr key={row.id} style={{ transitionDelay: `${index * 35}ms` }} className={`transition-all duration-300 hover:bg-white/[0.04] ${rowsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                      <td className="px-4 py-3 align-middle text-sm font-medium text-slate-100">{row.claimCode}</td>
                      <td className="px-4 py-3 align-middle text-sm text-slate-100">{row.user}</td>
                      <td className="px-4 py-3 align-middle text-sm text-slate-300">{row.policy}</td>
                      <td className="px-4 py-3 align-middle text-sm text-right tabular-nums text-slate-200">${row.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 align-middle text-sm text-slate-300">{row.submissionDate}</td>
                      <td className="px-4 py-3 align-middle text-sm">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(row.status)}`}>{row.status}</span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedClaim(row)} className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white transition-all duration-200" title="View details" aria-label={`View details for ${row.claimCode}`}>
                            <Eye className="h-4 w-4" />
                          </button>
                          {row.status === 'Pending' && (
                            <>
                              <button onClick={() => setApproveTarget(row)} className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-emerald-600/90 text-white hover:bg-emerald-600 transition-all duration-200" title="Approve claim" aria-label={`Approve ${row.claimCode}`}>
                                <Check className="h-4 w-4" />
                              </button>
                              <button onClick={() => { setRejectTarget(row); setRejectError(''); setRejectRemarks('') }} className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-red-600/90 text-white hover:bg-red-600 transition-all duration-200" title="Reject claim" aria-label={`Reject ${row.claimCode}`}>
                                <Ban className="h-4 w-4" />
                              </button>
                            </>
                          )}
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

      <Modal isOpen={Boolean(selectedClaim)} onClose={() => setSelectedClaim(null)} title="Claim Details">
        {selectedClaim && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><p className="text-slate-400">Claim ID</p><p className="text-slate-100 font-medium mt-1">{selectedClaim.claimCode}</p></div>
              <div><p className="text-slate-400">Current Status</p><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium mt-1 ${getStatusClass(selectedClaim.status)}`}>{selectedClaim.status}</span></div>
              <div><p className="text-slate-400">Claim Amount</p><p className="text-slate-100 font-medium mt-1">${selectedClaim.amount.toLocaleString()}</p></div>
              <div><p className="text-slate-400">Submission Date</p><p className="text-slate-100 font-medium mt-1">{selectedClaim.submissionDate}</p></div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">User Details</p>
              <p className="text-slate-100 font-medium mt-2">{selectedClaim.user}</p>
              <p className="text-slate-300 mt-1">{selectedClaim.userEmail || '-'}</p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Policy Details</p>
              <p className="text-slate-100 font-medium mt-2">{selectedClaim.policy}</p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Description</p>
              <p className="text-slate-200 mt-2">{selectedClaim.description || '-'}</p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Uploaded Documents</p>
              <div className="mt-2 rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-slate-300">
                {selectedClaim.documentUrl ? (
                  <a
                    href={selectedClaim.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-300 underline underline-offset-2 hover:text-blue-200"
                  >
                    Open uploaded document
                  </a>
                ) : (
                  selectedClaim.documents || 'No document uploaded'
                )}
              </div>
            </div>
            {selectedClaim.status === 'Rejected' && selectedClaim.adminRemarks && (
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Admin Remarks</p>
                <p className="text-slate-200 mt-2">{selectedClaim.adminRemarks}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={Boolean(approveTarget)} onClose={() => setApproveTarget(null)} title="Approve Claim">
        <p className="text-slate-200 text-sm">Are you sure you want to approve this claim?</p>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button onClick={() => setApproveTarget(null)} className="h-10 px-4 rounded-lg border border-white/20 bg-white/5 text-sm text-slate-200 hover:bg-white/10 transition-all duration-200">Cancel</button>
          <button onClick={onConfirmApprove} className="h-10 px-4 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500 transition-all duration-200">Confirm</button>
        </div>
      </Modal>

      <Modal isOpen={Boolean(rejectTarget)} onClose={() => setRejectTarget(null)} title="Reject Claim">
        <div className="space-y-3">
          <label className="text-sm text-slate-200 block" htmlFor="reject-remarks">Rejection Remarks</label>
          <textarea
            id="reject-remarks"
            value={rejectRemarks}
            onChange={(e) => {
              setRejectRemarks(e.target.value)
              if(rejectError) setRejectError('')
            }}
            rows={4}
            placeholder="Enter reason for rejection"
            className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-300/20 focus:border-red-300/40 transition-all"
          />
          {rejectError && <p className="text-xs text-red-300">{rejectError}</p>}
        </div>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button onClick={() => setRejectTarget(null)} className="h-10 px-4 rounded-lg border border-white/20 bg-white/5 text-sm text-slate-200 hover:bg-white/10 transition-all duration-200">Cancel</button>
          <button onClick={onConfirmReject} className="h-10 px-4 rounded-lg bg-red-600 text-white text-sm hover:bg-red-500 transition-all duration-200">Submit Reject</button>
        </div>
      </Modal>
    </div>
  )
}
