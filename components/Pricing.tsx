'use client';

import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$2,500',
    period: '/month',
    description: 'For growing businesses ready to automate',
    features: [
      '15 AI Agents',
      '50 Integrated Tools',
      '10,000 Memories',
      'Basic Self-Healing',
      'Email Support',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Growth',
    price: '$7,500',
    period: '/month',
    description: 'For scaling operations with complex workflows',
    features: [
      '40 AI Agents',
      '200 Integrated Tools',
      '100,000 Memories',
      'Advanced Self-Healing',
      'AUREA Orchestrator',
      'Digital Twins',
      'Priority Support',
    ],
    cta: 'Most Popular',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For organizations requiring full autonomy',
    features: [
      'Unlimited AI Agents',
      '245+ Integrated Tools',
      'Unlimited Memories',
      'Full Self-Healing Suite',
      'Custom Integrations',
      'Dedicated Success Team',
      'SLA Guarantee',
      'On-Premise Option',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium mb-6"
          >
            <Zap className="w-4 h-4" />
            OUTCOME-BASED PRICING
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            Invest in <span className="text-gradient">Results</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Pay for outcomes, not seats. BrainOps delivers ROI from day one.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.featured
                  ? 'glass border-2 border-violet-500/50 glow'
                  : 'glass hover:glow-subtle'
              } transition-all duration-300`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block text-center py-3 rounded-xl font-semibold transition ${
                  plan.featured
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500'
                    : 'bg-white/10 hover:bg-white/20 border border-white/10'
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
