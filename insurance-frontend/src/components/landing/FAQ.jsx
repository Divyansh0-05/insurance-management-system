import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const containerClass = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10'

const faqs = [
  {
    question: 'How quickly can I get a claim approved?',
    answer:
      'Claim timelines depend on policy type and submitted documentation, but most standard claims are reviewed within a few business days.',
  },
  {
    question: 'Can I manage multiple insurance plans in one account?',
    answer:
      'Yes. You can manage health, auto, home, and life plans from the same dashboard with separate policy details and claim histories.',
  },
  {
    question: 'Is my personal and payment data secure?',
    answer:
      'We use secure infrastructure, encrypted communication, and strict access controls to protect your account and sensitive information.',
  },
  {
    question: 'What support is available if I need help?',
    answer:
      'Our support team is available 24/7 to help with policy questions, claim submissions, and account-related assistance.',
  },
]

export default function FAQ(){
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section data-reveal className="py-20 sm:py-24 bg-white">
      <div className={containerClass}>
        {/* Header - Centered */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-xs uppercase tracking-[0.14em] font-medium text-emerald-600">
              FAQ
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-emerald-950">
            Common questions,{' '}
            <span className="text-emerald-500">clear answers.</span>
          </h2>
          <p className="text-emerald-700/70 mt-3 text-lg">
            Everything you need to know about our insurance platform
          </p>
        </div>

        {/* FAQ Accordion - Centered with max width */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index
            const buttonId = `faq-trigger-${index}`
            const panelId = `faq-panel-${index}`

            return (
              <div key={item.question} className="border-b border-emerald-100 last:border-b-0">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full py-5 text-left flex items-center justify-between gap-4 
                             hover:text-emerald-600 transition-colors duration-200 group"
                  >
                    <span className={`text-base sm:text-lg font-medium transition-colors duration-200
                                    ${isOpen ? 'text-emerald-600' : 'text-emerald-900'}`}>
                      {item.question}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-emerald-500 transition-transform duration-300 
                                ${isOpen ? 'rotate-180' : ''} group-hover:text-emerald-600 flex-shrink-0`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm sm:text-base leading-relaxed text-emerald-700/80 pr-8">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}