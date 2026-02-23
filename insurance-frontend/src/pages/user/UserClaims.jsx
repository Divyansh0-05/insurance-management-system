import { useEffect, useMemo, useState } from 'react'
import { ClipboardList, Clock3, BadgeCheck, FileSearch } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { userApi } from '../../services/api'
import { formatCurrency } from '../../utils/formatCurrency'

function normalizeStatus(status){
  const key = String(status || '').toLowerCase()
  if(key === 'approved') return 'Approved'
  if(key === 'rejected') return 'Rejected'
  return 'Pending'
}

function getClaimBadgeVariant(status){
  if(status === 'Approved') return 'success'
  if(status === 'Pending') return 'warning'
  if(status === 'Rejected') return 'danger'
  return 'default'
}

function getStatusBadgeClass(status){
  if(status === 'Approved') return 'bg-green-500/20 text-green-300 rounded-full px-2.5 py-0.5'
  if(status === 'Pending') return 'bg-amber-500/20 text-amber-300 rounded-full px-2.5 py-0.5'
  if(status === 'Rejected') return 'bg-red-500/20 text-red-300 rounded-full px-2.5 py-0.5'
  return 'bg-slate-500/20 text-slate-300 rounded-full px-2.5 py-0.5'
}

function formatSubmissionDate(value){
  const date = new Date(value)
  if(Number.isNaN(date.getTime())) return '--'
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

const initialForm = {
  insuranceId: '',
  amount: '',
  description: '',
  document: null,
}

export default function UserClaims(){
  const [claims, setClaims] = useState([])
  const [availablePolicies, setAvailablePolicies] = useState([])
  const [message, setMessage] = useState('')
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false)
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false)
  const [rowsVisible, setRowsVisible] = useState(false)
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    async function loadData(){
      try {
        const [claimsData, purchasesData] = await Promise.all([
          userApi.getClaims(),
          userApi.getPurchases(),
        ])

        const normalizedClaims = (Array.isArray(claimsData) ? claimsData : []).map((claim) => ({
          id: claim._id,
          insuranceId: claim.insuranceId?._id ?? claim.insuranceId,
          policyName: claim.insuranceId?.title ?? 'Unknown Policy',
          amount: claim.amount,
          status: normalizeStatus(claim.status),
          submissionDate: claim.createdAt,
          adminRemarks: claim.adminRemarks || '',
        }))

        const policyMap = new Map()
        for(const purchase of Array.isArray(purchasesData) ? purchasesData : []){
          const insurance = purchase.insurance
          if(insurance?._id && insurance?.title){
            policyMap.set(insurance._id, insurance.title)
          }
        }

        const policies = Array.from(policyMap.entries()).map(([id, title]) => ({ id, title }))
        setClaims(normalizedClaims)
        setAvailablePolicies(policies)
        setForm((prev) => ({ ...prev, insuranceId: prev.insuranceId || policies[0]?.id || '' }))
      } catch (err) {
        setClaims([])
        setAvailablePolicies([])
        setMessage(err.message || 'Failed to load claims.')
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    setRowsVisible(false)
    const timer = setTimeout(() => setRowsVisible(true), 90)
    return () => clearTimeout(timer)
  }, [claims])

  async function handleClaimSubmit(e){
    e.preventDefault()
    if(isSubmittingClaim) return

    setMessage('')
    setIsSubmittingClaim(true)
    try {
      const payload = new FormData()
      payload.append('insuranceId', form.insuranceId)
      payload.append('amount', String(Number(form.amount)))
      payload.append('description', form.description)
      if(form.document){
        payload.append('document', form.document)
      }
      const created = await userApi.createClaim(payload)
      const nextClaim = {
        id: created?._id,
        insuranceId: created?.insuranceId?._id ?? created?.insuranceId,
        policyName: created?.insuranceId?.title ?? availablePolicies.find((item) => item.id === form.insuranceId)?.title ?? 'Unknown Policy',
        amount: created?.amount ?? Number(form.amount),
        status: normalizeStatus(created?.status),
        submissionDate: created?.createdAt ?? new Date().toISOString(),
        adminRemarks: created?.adminRemarks ?? '',
      }
      setClaims((prev) => [nextClaim, ...prev])
      setMessage('Claim submitted successfully.')
      setForm((prev) => ({ ...initialForm, insuranceId: prev.insuranceId }))
      setIsRaiseModalOpen(false)
    } catch (err) {
      setMessage(err.message || 'Claim submit failed.')
    } finally {
      setIsSubmittingClaim(false)
    }
  }

  const tableRows = useMemo(
    () =>
      claims.map((claim) => ({
        ...claim,
        submissionDateText: formatSubmissionDate(claim.submissionDate),
      })),
    [claims]
  )

  const summaryCards = [
    { label: 'Total Claims', value: claims.length, icon: ClipboardList },
    { label: 'Pending', value: claims.filter((claim) => claim.status === 'Pending').length, icon: Clock3 },
    { label: 'Approved', value: claims.filter((claim) => claim.status === 'Approved').length, icon: BadgeCheck },
  ]

  return (
    <div className="rounded-3xl bg-[#0f172a] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      <section className="py-10 border-b border-white/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Your Claims</h1>
            <p className="text-slate-300 mt-3 text-base sm:text-lg">Track and manage your submitted claims.</p>
          </div>
          <button
            onClick={() => setIsRaiseModalOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-100 text-slate-900 font-medium hover:bg-white transition-colors duration-200"
          >
            + Raise New Claim
          </button>
        </div>
        {message && <p className="text-sm text-emerald-300 mt-4">{message}</p>}
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

      <section className="pb-4">
        <div className="rounded-2xl border border-white/10 bg-slate-950/95 p-6 text-slate-100 shadow-none">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Claims History</h3>
          {tableRows.length === 0 ? (
            <div className="min-h-75 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-white/10 bg-white/2">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <FileSearch className="w-8 h-8 text-slate-300" />
              </div>
              <p className="mt-5 text-lg font-semibold text-slate-100">No claims submitted yet.</p>
              <button
                onClick={() => setIsRaiseModalOpen(true)}
                className="mt-5 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-100 text-slate-900 font-medium hover:bg-white transition-colors duration-200"
              >
                Raise Your First Claim
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-200">Policy Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-200">Claim Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-200">Submission Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-200">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-200">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {tableRows.map((row, index) => (
                    <tr
                      key={row.id}
                      className="transition-all duration-400 hover:bg-white/5"
                      style={{
                        opacity: rowsVisible ? 1 : 0,
                        transform: rowsVisible ? 'translateY(0)' : 'translateY(6px)',
                        transitionDelay: `${index * 45}ms`,
                      }}
                    >
                      <td className="px-4 py-3 text-sm text-slate-100">{row.policyName}</td>
                      <td className="px-4 py-3 text-sm text-slate-100">{formatCurrency(row.amount)}</td>
                      <td className="px-4 py-3 text-sm text-slate-200">{row.submissionDateText}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={getClaimBadgeVariant(row.status)} className={getStatusBadgeClass(row.status)}>{row.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => setSelectedClaim(row)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-white/20 text-slate-100 hover:bg-white/10 transition-colors duration-200"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <Modal isOpen={isRaiseModalOpen} onClose={() => setIsRaiseModalOpen(false)} title="Raise New Claim">
        <form onSubmit={handleClaimSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">Select Policy</label>
            <select
              value={form.insuranceId}
              onChange={(e) => setForm((prev) => ({ ...prev, insuranceId: e.target.value }))}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200/30"
              required
            >
              {availablePolicies.map((policy) => (
                <option key={policy.id} value={policy.id} className="bg-slate-900 text-slate-100">{policy.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">Claim Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={form.amount}
              onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/30"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">Description</label>
            <textarea
              rows={4}
              placeholder="Describe your claim details"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/30"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">Upload Supporting Document</label>
            <input
              type="file"
              onChange={(e) => setForm((prev) => ({ ...prev, document: e.target.files?.[0] ?? null }))}
              className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-slate-100 hover:file:bg-white/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsRaiseModalOpen(false)}
              disabled={isSubmittingClaim}
              className="px-4 py-2 rounded-xl border border-white/20 text-slate-200 hover:bg-white/10 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingClaim}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-900 font-medium hover:bg-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmittingClaim ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={Boolean(selectedClaim)} onClose={() => setSelectedClaim(null)} title="Claim Details">
        {selectedClaim && (
          <div className="space-y-6 text-sm text-slate-200">
            <section className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Policy Name</p>
                <p className="font-medium text-slate-100">{selectedClaim.policyName}</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Claim Amount</p>
                <p className="font-medium text-slate-100">{formatCurrency(selectedClaim.amount)}</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Submission Date</p>
                <p className="font-medium text-slate-100">{selectedClaim.submissionDateText}</p>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Current Status</p>
                <Badge variant={getClaimBadgeVariant(selectedClaim.status)} className={getStatusBadgeClass(selectedClaim.status)}>{selectedClaim.status}</Badge>
              </div>
            </section>

            {selectedClaim.status === 'Rejected' && selectedClaim.adminRemarks && (
              <section className="rounded-2xl bg-red-500/10 border border-red-400/30 p-4">
                <p className="text-xs uppercase tracking-wide text-red-300 mb-2">Admin Remarks</p>
                <p className="text-sm text-red-100 leading-relaxed">{selectedClaim.adminRemarks}</p>
              </section>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
