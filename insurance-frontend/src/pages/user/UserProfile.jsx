import { useEffect, useRef, useState } from 'react'
import { FileText, Image as ImageIcon, UploadCloud, CalendarDays } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import useAuth from '../../hooks/useAuth'
import { userApi } from '../../services/api'

function getDocumentStatusClass(status){
  if(status === 'Verified') return 'bg-emerald-500/20 text-emerald-300'
  if(status === 'Uploaded') return 'bg-sky-500/20 text-sky-300'
  return 'bg-rose-500/20 text-rose-300'
}

export default function UserProfile(){
  const { user } = useAuth()
  const dobInputRef = useRef(null)
  const [profileCardVisible, setProfileCardVisible] = useState(false)
  const memberSince = (() => {
    const raw = user?.createdAt ?? user?.joinedAt ?? '2026-01-15'
    const date = new Date(raw)
    if(Number.isNaN(date.getTime())) return 'Jan 2026'
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  })()
  const accountStatus = user?.isVerified ? 'Verified' : 'Active'
  const accountCreatedDate = (() => {
    const raw = user?.createdAt ?? user?.joinedAt ?? '2026-01-15'
    const date = new Date(raw)
    if(Number.isNaN(date.getTime())) return 'Jan 15, 2026'
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  })()
  const lastLoginDisplay = (() => {
    const raw = user?.lastLogin ?? user?.lastLoginAt ?? '2026-02-16T09:30:00Z'
    const date = new Date(raw)
    if(Number.isNaN(date.getTime())) return 'Unavailable'
    return date.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  })()
  const totalClaims = user?.totalClaims ?? 0
  const totalPolicies = user?.totalPolicies ?? 0
  const rawUserId = user?._id ?? user?.id
  const userIdDisplay = rawUserId ? `USR-${String(rawUserId).slice(-6).toUpperCase()}` : 'USR-0001'
  const [form, setForm] = useState({
    name: user?.name ?? 'Demo User',
    email: user?.email ?? 'demo@insurance.com',
    phone: user?.phone ?? '',
    dob: user?.dob ?? '',
    address: user?.address ?? '',
  })
  const [message, setMessage] = useState('')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadTargetDoc, setUploadTargetDoc] = useState(null)
  const [pendingUploadFile, setPendingUploadFile] = useState(null)
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [documents, setDocuments] = useState([
    { key: 'idProof', name: 'ID Proof', status: 'Uploaded', fileType: 'pdf', fileName: 'id-proof.pdf' },
    { key: 'addressProof', name: 'Address Proof', status: 'Missing', fileType: 'pdf', fileName: null },
    { key: 'medicalReport', name: 'Medical Report', status: 'Verified', fileType: 'image', fileName: 'medical-report.png' },
    { key: 'incomeProof', name: 'Income Proof', status: 'Missing', fileType: 'pdf', fileName: null },
  ])

  useEffect(() => {
    const timer = setTimeout(() => setProfileCardVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  function handleUploadDocument(docKey){
    const target = documents.find((doc) => doc.key === docKey)
    if(!target) return
    setUploadTargetDoc(target)
    setPendingUploadFile(null)
    setIsDraggingFile(false)
    setIsUploadModalOpen(true)
  }

  function closeUploadModal(){
    setIsUploadModalOpen(false)
    setUploadTargetDoc(null)
    setPendingUploadFile(null)
    setIsDraggingFile(false)
  }

  function confirmDocumentUpload(){
    if(!uploadTargetDoc) return
    const nextName = pendingUploadFile?.name ?? uploadTargetDoc.fileName ?? `${uploadTargetDoc.name.toLowerCase().replace(/\s+/g, '-')}.pdf`
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.key === uploadTargetDoc.key
          ? { ...doc, status: 'Uploaded', fileName: nextName }
          : doc
      )
    )
    closeUploadModal()
  }

  function onDragOver(e){
    e.preventDefault()
    setIsDraggingFile(true)
  }

  function onDragLeave(e){
    e.preventDefault()
    setIsDraggingFile(false)
  }

  function onDropFile(e){
    e.preventDefault()
    setIsDraggingFile(false)
    const file = e.dataTransfer?.files?.[0]
    if(file) setPendingUploadFile(file)
  }

  async function onSubmit(e){
    e.preventDefault()
    setMessage('')
    try {
      await userApi.updateProfile(form)
      setMessage('Profile updated successfully.')
    } catch (err) {
      setMessage(err.message || 'Profile update failed. Backend may not be connected.')
    }
  }

  return (
    <div className="rounded-3xl bg-[#0f172a] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      <section className="py-10 border-b border-white/10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My Profile</h1>
        <p className="text-slate-300 mt-3 text-base sm:text-lg">Manage your account details and contact information.</p>
      </section>

      <section className="py-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6">
          <aside
            className={`xl:col-span-4 rounded-3xl border border-white/10 bg-white/5 p-6 hover:-translate-y-1 hover:shadow-[0_18px_32px_-22px_rgba(0,0,0,0.8)] transition-all duration-500 ${
              profileCardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-white/10 text-slate-100 text-2xl font-semibold flex items-center justify-center border border-white/15">
              {(form.name || 'DU')
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((word) => word[0]?.toUpperCase())
                .join('')}
            </div>
            <button
              type="button"
              onClick={() => {}}
              className="mt-4 px-3 py-2 rounded-xl border border-white/20 text-sm text-slate-100 hover:bg-white/10 transition-colors duration-200"
            >
              Upload Photo
            </button>

            <h2 className="mt-4 text-xl font-semibold text-slate-100">{form.name || 'Demo User'}</h2>
            <p className="text-sm text-slate-300 mt-1">{form.email || 'demo@insurance.com'}</p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Member Since</p>
                <p className="text-slate-100 mt-1">{memberSince}</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Role</p>
                <p className="text-slate-100 mt-1 capitalize">{user?.role ?? 'user'}</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Phone</p>
                <p className="text-slate-100 mt-1">{form.phone || 'Not added'}</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Account Status</p>
                <span className="inline-flex mt-1 rounded-full px-2.5 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-300">
                  {accountStatus}
                </span>
              </div>
            </div>

            <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-sm font-semibold text-slate-100">Account Info</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-400 uppercase tracking-wide">User ID</p>
                  <p className="text-slate-100 mt-1">{userIdDisplay}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wide">Total Policies</p>
                  <p className="text-slate-100 mt-1">{totalPolicies}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wide">Total Claims</p>
                  <p className="text-slate-100 mt-1">{totalClaims}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wide">Created Date</p>
                  <p className="text-slate-100 mt-1">{accountCreatedDate}</p>
                </div>
              </div>
            </section>
          </aside>

          <div
            className={`xl:col-span-8 rounded-2xl border border-white/10 bg-slate-950/95 p-6 sm:p-7 transition-all duration-500 ${
              profileCardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ transitionDelay: '80ms' }}
          >
            <h2 className="text-xl font-semibold text-slate-100">Personal Information</h2>
            <p className="text-sm text-slate-300 mt-1">Update your profile details below.</p>

            <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-200 mb-1.5">Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/30 transition-colors duration-200"
                  placeholder="Name"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-200 mb-1.5">Email Address</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/30 transition-colors duration-200"
                  placeholder="Email"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-200 mb-1.5">Phone Number</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/30 transition-colors duration-200"
                  placeholder="Phone"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-200 mb-1.5">Date of Birth</label>
                <div className="relative">
                  <input
                    ref={dobInputRef}
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm((prev) => ({ ...prev, dob: e.target.value }))}
                    className="profile-date-input w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 pr-10 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200/30 transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      dobInputRef.current?.showPicker?.()
                      dobInputRef.current?.focus()
                    }}
                    className="absolute inset-y-0 right-2 inline-flex items-center text-slate-300 hover:text-slate-100 transition-colors"
                    aria-label="Open date picker"
                  >
                    <CalendarDays className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-200 mb-1.5">Address</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/30 transition-colors duration-200"
                  placeholder="Address"
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-between gap-3 pt-2">
                {message && <p className="text-sm text-emerald-300">{message}</p>}
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-900 font-medium hover:bg-white transition-colors duration-200">
                  Save Changes
                </button>
              </div>
            </form>

            <section className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-lg font-semibold text-slate-100">Security</h3>
              <p className="text-sm text-slate-300 mt-1">Manage password and account protection settings.</p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Password</p>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="mt-3 px-4 py-2 rounded-xl border border-white/20 text-sm font-medium text-slate-100 hover:bg-white/10 transition-colors duration-200"
                  >
                    Change Password
                  </button>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Last Login</p>
                  <p className="text-sm text-slate-100 mt-1">{lastLoginDisplay}</p>
                </div>
              </div>
            </section>

            <section className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-lg font-semibold text-slate-100">Policy Documents</h3>
              <p className="text-sm text-slate-300 mt-1">Upload and manage required verification documents.</p>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
                  <p className="col-span-4">Document</p>
                  <p className="col-span-3">Preview</p>
                  <p className="col-span-2">Status</p>
                  <p className="col-span-3">Action</p>
                </div>

                {documents.map((doc) => (
                  <div key={doc.key} className="grid grid-cols-1 sm:grid-cols-12 gap-3 px-4 py-4 border-b border-white/10 last:border-b-0 hover:bg-white/[0.04] transition-colors duration-200">
                    <div className="sm:col-span-4">
                      <p className="text-sm font-medium text-slate-100">{doc.name}</p>
                      <p className="text-xs text-slate-400 mt-1">Required for policy validation</p>
                    </div>

                    <div className="sm:col-span-3 flex items-center gap-2 text-slate-300">
                      {doc.fileType === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      <span className="text-xs">{doc.fileName ?? 'No file uploaded'}</span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getDocumentStatusClass(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>

                    <div className="sm:col-span-3">
                      <button
                        type="button"
                        onClick={() => handleUploadDocument(doc.key)}
                        className="w-full sm:w-auto px-3 py-2 rounded-xl border border-white/20 text-sm text-slate-100 hover:bg-white/10 transition-colors duration-200"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <Modal isOpen={isUploadModalOpen} onClose={closeUploadModal} title="Upload Document">
        <div className="space-y-5">
          <div>
            <p className="text-sm text-slate-300">
              {uploadTargetDoc ? `Uploading for: ${uploadTargetDoc.name}` : 'Select a document to upload.'}
            </p>
          </div>

          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDropFile}
            className={`rounded-2xl border border-dashed p-6 text-center transition-colors duration-200 ${
              isDraggingFile ? 'border-slate-200/50 bg-white/10' : 'border-white/20 bg-white/5'
            }`}
          >
            <UploadCloud className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="mt-3 text-sm text-slate-200">Drag and drop your file here</p>
            <p className="text-xs text-slate-400 mt-1">or choose a file manually</p>

            <label className="mt-4 inline-flex px-4 py-2 rounded-xl border border-white/20 text-sm text-slate-100 hover:bg-white/10 transition-colors duration-200 cursor-pointer">
              Choose File
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => setPendingUploadFile(e.target.files?.[0] ?? null)}
              />
            </label>

            <p className="mt-3 text-xs text-slate-400">Supported file types: PDF, PNG, JPG, JPEG</p>
            {pendingUploadFile && <p className="mt-2 text-xs text-slate-300">Selected: {pendingUploadFile.name}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeUploadModal}
              className="px-4 py-2 rounded-xl border border-white/20 text-slate-200 hover:bg-white/10 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDocumentUpload}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-900 font-medium hover:bg-white transition-colors duration-200"
            >
              Upload
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
