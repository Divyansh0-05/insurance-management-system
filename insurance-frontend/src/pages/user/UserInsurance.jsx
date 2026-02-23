import { useEffect, useMemo, useRef, useState } from 'react'
import { HeartPulse, Car, Home, ShieldCheck, SearchX } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { userApi } from '../../services/api'
import { formatCurrency } from '../../utils/formatCurrency'

function getId(item){
  return item?._id ?? item?.id
}

function getCategory(policy){
  return policy?.category ?? policy?.type ?? 'General'
}

export default function UserInsurance(){
  const rootRef = useRef(null)
  const [policies, setPolicies] = useState([])
  const [selectedPolicy, setSelectedPolicy] = useState(null)
  const [purchasePolicy, setPurchasePolicy] = useState(null)
  const [message, setMessage] = useState('')
  const [successToast, setSuccessToast] = useState('')
  const [isToastVisible, setIsToastVisible] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchasedPolicyIds, setPurchasedPolicyIds] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [priceFilter, setPriceFilter] = useState('All')

  const categoryMeta = {
    Health: { icon: HeartPulse, description: 'Comprehensive medical protection for you and your family.' },
    Auto: { icon: Car, description: 'Reliable road coverage for accidents, damage, and liability.' },
    Home: { icon: Home, description: 'Smart home coverage for property, valuables, and repairs.' },
    Life: { icon: ShieldCheck, description: 'Long-term financial security for your loved ones.' },
  }

  useEffect(() => {
    async function loadInsurance(){
      try {
        const data = await userApi.getInsurance()
        setPolicies(Array.isArray(data) ? data : [])
      } catch (err) {
        setPolicies([])
        setMessage(err.message || 'Failed to load insurance policies.')
      }
    }
    loadInsurance()
  }, [])

  useEffect(() => {
    async function loadPurchases(){
      try {
        const purchases = await userApi.getPurchases()
        const ids = new Set(
          (Array.isArray(purchases) ? purchases : [])
            .map((item) => getId(item.insurance))
            .filter(Boolean)
        )
        setPurchasedPolicyIds(ids)
      } catch {
        setPurchasedPolicyIds(new Set())
      }
    }
    loadPurchases()
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if(!root) return undefined
    const nodes = root.querySelectorAll('[data-reveal]')
    if(!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [policies, searchTerm, categoryFilter, priceFilter])

  async function handleView(policyId){
    try {
      const data = await userApi.getInsuranceById(policyId)
      setSelectedPolicy(data)
    } catch (err) {
      setMessage(err.message || 'Failed to load policy details.')
    }
  }

  function showSuccessToast(text){
    setSuccessToast(text)
    setIsToastVisible(true)
  }

  useEffect(() => {
    if(!successToast) return undefined
    const hideTimer = setTimeout(() => setIsToastVisible(false), 2000)
    const clearTimer = setTimeout(() => setSuccessToast(''), 2400)
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(clearTimer)
    }
  }, [successToast])

  async function confirmPurchase(){
    if(!purchasePolicy || isPurchasing) return
    setMessage('')
    setIsPurchasing(true)
    const policyId = getId(purchasePolicy)
    try {
      await userApi.purchase({ insuranceId: policyId })
      setPurchasedPolicyIds((prev) => new Set(prev).add(policyId))
      setPurchasePolicy(null)
      showSuccessToast(`Purchased: ${purchasePolicy.title}`)
    } catch (err) {
      setMessage(err.message || 'Purchase failed.')
      setPurchasePolicy(null)
    } finally {
      setIsPurchasing(false)
    }
  }

  const filteredPolicies = useMemo(() => {
    return policies.filter((policy) => {
      const title = String(policy.title || '').toLowerCase()
      const category = getCategory(policy)
      const searchMatch = title.includes(searchTerm.toLowerCase().trim())
      const categoryMatch = categoryFilter === 'All' ? true : category === categoryFilter

      let priceMatch = true
      if(priceFilter === 'Low') priceMatch = Number(policy.premium) < 100
      if(priceFilter === 'Mid') priceMatch = Number(policy.premium) >= 100 && Number(policy.premium) <= 200
      if(priceFilter === 'High') priceMatch = Number(policy.premium) > 200

      return searchMatch && categoryMatch && priceMatch
    })
  }, [policies, searchTerm, categoryFilter, priceFilter])

  function resetFilters(){
    setSearchTerm('')
    setCategoryFilter('All')
    setPriceFilter('All')
  }

  return (
    <div ref={rootRef} className="rounded-3xl bg-[#0f172a] text-slate-100 p-4 sm:p-6 lg:p-8">
      <section data-reveal className="py-10 border-b border-white/10" style={{ transitionDuration: '680ms' }}>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Explore Insurance Plans</h1>
        <p className="text-slate-300 mt-3 text-base sm:text-lg">Find the coverage that fits your needs.</p>
        {message && <p className="text-sm text-amber-300 mt-4">{message}</p>}
      </section>

      <section data-reveal className="py-8 border-b border-white/10" style={{ transitionDuration: '680ms', transitionDelay: '40ms' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by plan title"
            className="xl:col-span-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/30 focus:border-white/20 transition-all"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200/30 focus:border-white/20 transition-all"
          >
            <option value="All">All Categories</option>
            <option value="Health">Health</option>
            <option value="Auto">Auto</option>
            <option value="Home">Home</option>
            <option value="Life">Life</option>
          </select>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200/30 focus:border-white/20 transition-all"
          >
            <option value="All">All Prices</option>
            <option value="Low">Below $100</option>
            <option value="Mid">$100 - $200</option>
            <option value="High">Above $200</option>
          </select>
        </div>
      </section>

      <section data-reveal className="py-10" style={{ transitionDuration: '680ms', transitionDelay: '80ms' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredPolicies.map((policy) => {
            const policyId = getId(policy)
            const category = getCategory(policy)
            const PolicyIcon = categoryMeta[category]?.icon ?? ShieldCheck
            const isPurchased = purchasedPolicyIds.has(policyId)
            return (
              <article
                key={policyId}
                data-reveal
                className="group rounded-2xl bg-white/5 p-5 sm:p-6 h-full flex flex-col justify-between shadow-sm hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_40px_-26px_rgba(15,23,42,0.9)] transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <PolicyIcon className="w-5 h-5 text-slate-100" />
                    </div>
                    <div className="flex items-center gap-2">
                      {isPurchased && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                          Active
                        </span>
                      )}
                      <p className="text-xs uppercase tracking-wide text-slate-300">{category}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{policy.title}</h3>
                    <p className="text-sm text-slate-300 mt-1">Policy #{policyId}</p>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {categoryMeta[category]?.description ?? 'Flexible coverage to protect what matters most.'}
                  </p>

                  <div className="space-y-1">
                    <p className="text-sm text-slate-200">
                      <span className="font-medium">Coverage Amount:</span> {formatCurrency(policy.coverage)}
                    </p>
                    <p className="text-sm text-slate-200">
                      <span className="font-medium">Premium Cost:</span> {formatCurrency(policy.premium)}
                    </p>
                    <p className="text-sm text-slate-200">
                      <span className="font-medium">Duration:</span> {policy.duration}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleView(policyId)}
                      className="px-3 py-2 text-sm font-medium rounded-xl border border-white/20 hover:bg-white/10 hover:shadow-[0_0_0_4px_rgba(255,255,255,0.04)] transition-all"
                    >
                      View Details
                    </button>
                    {isPurchased ? (
                      <button
                        onClick={() => handleView(policyId)}
                        className="px-3 py-2 text-sm font-medium rounded-xl bg-white/10 text-slate-100 hover:bg-white/15 hover:shadow-[0_0_0_4px_rgba(255,255,255,0.04)] transition-all"
                      >
                        View Policy
                      </button>
                    ) : (
                      <button
                        onClick={() => setPurchasePolicy(policy)}
                        className="px-3 py-2 text-sm font-medium rounded-xl bg-slate-100 text-slate-900 hover:bg-white hover:shadow-[0_10px_24px_-16px_rgba(255,255,255,0.85)] transition-all"
                      >
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        {filteredPolicies.length === 0 && (
          <div data-reveal className="mt-8 rounded-2xl border border-white/10 bg-white/3 px-6 py-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <SearchX className="w-6 h-6 text-slate-300" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-100">No plans found.</h3>
            <p className="mt-2 text-sm text-slate-300">Try adjusting your search or filters.</p>
            <button
              onClick={resetFilters}
              className="mt-5 px-4 py-2 rounded-xl border border-white/20 text-sm font-medium text-slate-100 hover:bg-white/10 hover:shadow-[0_0_0_4px_rgba(255,255,255,0.04)] transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      <Modal isOpen={Boolean(selectedPolicy)} onClose={() => setSelectedPolicy(null)} title="Policy Details">
        {selectedPolicy && (
          <div className="space-y-6 text-sm text-slate-200">
            <section>
              <h3 className="text-2xl font-semibold text-slate-50">{selectedPolicy.title}</h3>
              <p className="text-slate-300 mt-2 leading-relaxed">
                {categoryMeta[getCategory(selectedPolicy)]?.description ?? 'Comprehensive protection designed for everyday uncertainty and long-term peace of mind.'}
              </p>
            </section>

            <section className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Coverage Breakdown</p>
                <p><span className="text-slate-300">Total Coverage:</span> <span className="font-semibold text-slate-100">{formatCurrency(selectedPolicy.coverage)}</span></p>
                <p className="mt-1"><span className="text-slate-300">Category:</span> <span className="font-semibold text-slate-100">{getCategory(selectedPolicy)}</span></p>
                <p className="mt-1"><span className="text-slate-300">Duration:</span> <span className="font-semibold text-slate-100">{selectedPolicy.duration}</span></p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Premium Breakdown</p>
                <p><span className="text-slate-300">Premium:</span> <span className="font-semibold text-slate-100">{formatCurrency(selectedPolicy.premium)}</span></p>
                <p className="mt-1"><span className="text-slate-300">Policy ID:</span> <span className="font-semibold text-slate-100">#{getId(selectedPolicy)}</span></p>
              </div>
            </section>
          </div>
        )}
      </Modal>

      <Modal isOpen={Boolean(purchasePolicy)} onClose={() => setPurchasePolicy(null)} title="Confirm Purchase">
        {purchasePolicy && (
          <div className="space-y-5 text-sm text-slate-200">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2">
              <p className="text-lg font-semibold text-slate-50">{purchasePolicy.title}</p>
              <p><span className="text-slate-300">Premium Amount:</span> <span className="font-semibold text-slate-100">{formatCurrency(purchasePolicy.premium)}</span></p>
              <p><span className="text-slate-300">Duration:</span> <span className="font-semibold text-slate-100">{purchasePolicy.duration}</span></p>
              <p><span className="text-slate-300">Coverage:</span> <span className="font-semibold text-slate-100">{formatCurrency(purchasePolicy.coverage)}</span></p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPurchasePolicy(null)}
                disabled={isPurchasing}
                className="px-4 py-2 rounded-xl border border-white/20 text-slate-200 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmPurchase}
                disabled={isPurchasing}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-900 font-medium hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {isPurchasing && <span className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-transparent animate-spin" />}
                {isPurchasing ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {successToast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 z-60 rounded-xl bg-emerald-500/20 border border-emerald-400/30 px-4 py-2 text-sm text-emerald-200 backdrop-blur-md shadow-lg transition-all duration-300 ${
          isToastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          {successToast}
        </div>
      )}
    </div>
  )
}
