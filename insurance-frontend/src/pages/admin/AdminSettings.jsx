import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api'

const tabs = ['General', 'Policies', 'Claims', 'Notifications', 'Security']

const defaultSettings = {
  platformName: 'Insurance Management System',
  supportEmail: 'support@insurance.com',
  contactNumber: '+1 (555) 123-4567',
  defaultCurrency: 'USD',
  defaultPolicyDuration: '12 months',
  enablePolicyAutoRenew: true,
  maxCoverageLimit: 1000000,
  minPremiumAmount: 50,
  autoApprovalThreshold: 1000,
  maxClaimProcessingDays: 14,
  requireDocumentVerification: true,
  requireAdminRemarks: true,
  emailNotifications: true,
  smsNotifications: false,
  notifyOnNewClaim: true,
  notifyOnNewUserRegistration: true,
  requireTwoFactorAuth: false,
  passwordMinLength: 8,
  sessionTimeoutMinutes: 30,
  ipWhitelistEnabled: false,
}

function Toggle({ checked, onChange }){
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors duration-200 ${
        checked ? 'bg-indigo-500/80 border-indigo-400/70' : 'bg-white/10 border-white/20'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

function SettingField({ label, description, children }){
  return (
    <label className="block">
      <p className="text-sm font-medium text-slate-100">{label}</p>
      <div className="mt-2">{children}</div>
      <p className="mt-1.5 text-xs text-slate-400">{description}</p>
    </label>
  )
}

export default function AdminSettings(){
  const [settings, setSettings] = useState(defaultSettings)
  const [activeTab, setActiveTab] = useState('General')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadSettings(){
      try {
        const data = await adminApi.getSettings()
        if(data && typeof data === 'object'){
          setSettings((prev) => ({
            ...prev,
            ...data,
            autoApprovalThreshold: data.autoApprovalThreshold ?? data.claimAutoApprovalLimit ?? prev.autoApprovalThreshold,
          }))
        }
      } catch {
        setSettings(defaultSettings)
      }
    }
    loadSettings()
  }, [])

  async function onSubmit(e){
    if(e?.preventDefault) e.preventDefault()
    setMessage('')
    try {
      await adminApi.updateSettings(settings)
      setMessage('Settings saved successfully.')
      window.setTimeout(() => setMessage(''), 2200)
    } catch (err) {
      setMessage(err.message || 'Update failed.')
    }
  }

  function setField(key, value){
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="rounded-3xl bg-[#0b1220] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 gap-y-10">
        <section className="pb-8 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">System Settings</h1>
              <p className="text-slate-300 mt-3 text-base sm:text-lg">Configure platform behavior and defaults.</p>
            </div>
            <div className="sm:text-right">
              <button
                type="button"
                onClick={onSubmit}
                className="h-11 px-5 w-full sm:w-auto rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-400 transition-all duration-200"
              >
                Save Changes
              </button>
              {message && (
                <p className={`mt-2 text-xs ${message.includes('failed') ? 'text-red-300' : 'text-emerald-300'}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="pb-8 border-b border-white/10">
          <div className="overflow-x-auto">
            <div className="inline-flex gap-2 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`h-10 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/40'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </section>

        <form onSubmit={onSubmit} className="space-y-6">
          {activeTab === 'General' && (
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-100">General Settings</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <SettingField label="Platform Name" description="Displayed across navigation, auth screens, and emails.">
                  <input
                    value={settings.platformName}
                    onChange={(e) => setField('platformName', e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-300/40 transition-all"
                  />
                </SettingField>
                <SettingField label="Support Email" description="Primary email used for customer support and escalations.">
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setField('supportEmail', e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-300/40 transition-all"
                  />
                </SettingField>
                <SettingField label="Contact Number" description="Public support number shown in contact and help areas.">
                  <input
                    value={settings.contactNumber}
                    onChange={(e) => setField('contactNumber', e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-300/40 transition-all"
                  />
                </SettingField>
                <SettingField label="Default Currency" description="Used as the default denomination in plan and claim amounts.">
                  <input
                    value={settings.defaultCurrency}
                    onChange={(e) => setField('defaultCurrency', e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-300/40 transition-all"
                  />
                </SettingField>
              </div>
            </section>
          )}

          {activeTab === 'Policies' && (
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-100">Policy Settings</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <SettingField label="Default Policy Duration" description="Preselected duration for newly created policy templates.">
                  <input
                    value={settings.defaultPolicyDuration}
                    onChange={(e) => setField('defaultPolicyDuration', e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-300/40 transition-all"
                  />
                </SettingField>
                <SettingField label="Enable Policy Auto-Renew" description="Automatically renew active policies before expiration.">
                  <Toggle checked={settings.enablePolicyAutoRenew} onChange={(value) => setField('enablePolicyAutoRenew', value)} />
                </SettingField>
                <SettingField label="Maximum Coverage Limit" description="Upper limit for coverage amount in any policy plan.">
                  <input
                    type="number"
                    value={settings.maxCoverageLimit}
                    onChange={(e) => setField('maxCoverageLimit', Number(e.target.value))}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-300/40 transition-all"
                  />
                </SettingField>
                <SettingField label="Minimum Premium Amount" description="Minimum monthly premium allowed for policy creation.">
                  <input
                    type="number"
                    value={settings.minPremiumAmount}
                    onChange={(e) => setField('minPremiumAmount', Number(e.target.value))}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-300/40 transition-all"
                  />
                </SettingField>
              </div>
            </section>
          )}

          {activeTab === 'Claims' && (
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-100">Claims Settings</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <SettingField label="Auto-Approval Threshold Amount" description="Claims below this amount can be auto-approved.">
                  <input
                    type="number"
                    value={settings.autoApprovalThreshold}
                    onChange={(e) => setField('autoApprovalThreshold', Number(e.target.value))}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-300/40 transition-all"
                  />
                </SettingField>
                <SettingField label="Max Claim Processing Days" description="Maximum allowed processing window before escalation.">
                  <input
                    type="number"
                    value={settings.maxClaimProcessingDays}
                    onChange={(e) => setField('maxClaimProcessingDays', Number(e.target.value))}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-300/40 transition-all"
                  />
                </SettingField>
                <SettingField label="Require Document Verification" description="Claims must include verified documentation before final decision.">
                  <Toggle checked={settings.requireDocumentVerification} onChange={(value) => setField('requireDocumentVerification', value)} />
                </SettingField>
                <SettingField label="Require Admin Remarks" description="Admins must add remarks while rejecting or overriding claims.">
                  <Toggle checked={settings.requireAdminRemarks} onChange={(value) => setField('requireAdminRemarks', value)} />
                </SettingField>
              </div>
            </section>
          )}

          {activeTab === 'Notifications' && (
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-100">Notification Settings</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <SettingField label="Email Notifications" description="Send operational alerts to configured email recipients.">
                  <Toggle checked={settings.emailNotifications} onChange={(value) => setField('emailNotifications', value)} />
                </SettingField>
                <SettingField label="SMS Notifications" description="Enable SMS-based notifications for urgent system events.">
                  <Toggle checked={settings.smsNotifications} onChange={(value) => setField('smsNotifications', value)} />
                </SettingField>
                <SettingField label="Notify on New Claim" description="Notify administrators when a new claim is submitted.">
                  <Toggle checked={settings.notifyOnNewClaim} onChange={(value) => setField('notifyOnNewClaim', value)} />
                </SettingField>
                <SettingField label="Notify on New User Registration" description="Trigger alerts whenever a new user account is created.">
                  <Toggle checked={settings.notifyOnNewUserRegistration} onChange={(value) => setField('notifyOnNewUserRegistration', value)} />
                </SettingField>
              </div>
            </section>
          )}

          {activeTab === 'Security' && (
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-100">Security Settings</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <SettingField label="Require Two-Factor Authentication" description="Mandate two-factor auth for admin account sign-ins.">
                  <Toggle checked={settings.requireTwoFactorAuth} onChange={(value) => setField('requireTwoFactorAuth', value)} />
                </SettingField>
                <SettingField label="Password Minimum Length" description="Minimum number of characters required for all passwords.">
                  <input
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => setField('passwordMinLength', Number(e.target.value))}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-300/40 transition-all"
                  />
                </SettingField>
                <SettingField label="Session Timeout (Minutes)" description="Automatic logout timeout for inactive sessions.">
                  <input
                    type="number"
                    value={settings.sessionTimeoutMinutes}
                    onChange={(e) => setField('sessionTimeoutMinutes', Number(e.target.value))}
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300/30 focus:border-indigo-300/40 transition-all"
                  />
                </SettingField>
                <SettingField label="IP Whitelist" description="Allow admin access only from approved IP ranges.">
                  <Toggle checked={settings.ipWhitelistEnabled} onChange={(value) => setField('ipWhitelistEnabled', value)} />
                </SettingField>
              </div>

              <div className="mt-6 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3">
                <p className="text-sm text-amber-200">
                  Security-related changes can affect active admin sessions. Review changes carefully before saving.
                </p>
              </div>
            </section>
          )}
        </form>
      </div>
    </div>
  )
}
