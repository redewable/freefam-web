'use client'
import { Lock, Play, CheckCircle, Shield, ChevronDown, BookOpen } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BrainTrain() {
  const [expandedId, setExpandedId] = useState<number | null>(2) // Default open the active one

  const courses = [
    { 
      id: 1, 
      title: "The 4C Formula", 
      subtitle: "Commitment • Courage • Capability",
      level: "MINDSET", 
      status: "completed",
      modules: ["The Valley of Despair", "Who Not How", "The Confidence Gap"]
    },
    { 
      id: 2, 
      title: "Story Brand & Pitch", 
      subtitle: "Clarify Your Message",
      level: "SKILL", 
      status: "current",
      modules: ["The Character", "The Guide", "The Call to Action"] 
    },
    { 
      id: 3, 
      title: "Financial Literacy", 
      subtitle: "Rich Dad Poor Dad Principles",
      level: "MONEY", 
      status: "locked",
      modules: ["Assets vs Liabilities", "Cashflow Quadrant", "Tax Advantages"]
    },
    { 
      id: 4, 
      title: "Kingdom Marriage", 
      subtitle: "Love & Respect",
      level: "FAMILY", 
      status: "locked",
      modules: []
    },
  ]

  return (
    <div className="space-y-8 pb-24">
      <div className="text-center py-6 border-b border-slate-800">
        <h2 className="font-cinzel text-3xl text-gold mb-2 text-shadow-glow">The Brain Train</h2>
        <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">Forging the 1% Mindset</p>
      </div>

      <div className="space-y-6 relative px-2">
        {/* The Golden Thread Timeline */}
        <div className="absolute left-[1.65rem] top-4 bottom-4 w-0.5 bg-gradient-to-b from-slate-800 via-yellow-900/40 to-slate-800 -z-10"></div>

        {courses.map((course) => (
          <div key={course.id} className="relative pl-14">
            
            {/* Status Indicator (The Shield) */}
            <div className={`absolute left-0 top-0 w-14 h-14 flex items-center justify-center z-10 bg-[#0f172a] transition-all duration-500
              ${course.status === 'current' ? 'scale-110' : 'scale-100'}`}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-2xl
                ${course.status === 'completed' ? 'border-green-600 bg-green-900/20 text-green-500' : 
                  course.status === 'current' ? 'border-amber-500 bg-amber-900/20 text-amber-500 shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 
                  'border-slate-700 bg-slate-800 text-slate-600'}`}>
                {course.status === 'completed' && <CheckCircle size={18} />}
                {course.status === 'current' && <Play size={18} fill="currentColor" />}
                {course.status === 'locked' && <Lock size={16} />}
              </div>
            </div>

            {/* The Mission Card */}
            <div 
              onClick={() => course.status !== 'locked' && setExpandedId(expandedId === course.id ? null : course.id)}
              className={`group relative rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer
                ${course.status === 'locked' ? 'opacity-60 grayscale border-slate-800 bg-slate-900/20' : 
                  course.status === 'current' ? 'border-amber-500/50 bg-slate-900 shadow-lg' : 
                  'border-slate-800 bg-slate-900/40 hover:border-slate-600'}`}
            >
              {/* Card Header */}
              <div className="p-5 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded
                      ${course.status === 'current' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                      {course.level}
                    </span>
                    {course.status === 'completed' && <span className="text-[10px] text-green-500 font-mono">100% DONE</span>}
                  </div>
                  <h3 className={`font-cinzel text-lg leading-tight mb-1 ${course.status === 'current' ? 'text-white' : 'text-slate-300'}`}>
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-serif italic">{course.subtitle}</p>
                </div>
                {course.status !== 'locked' && (
                  <ChevronDown size={16} className={`text-slate-500 transition-transform duration-300 ${expandedId === course.id ? 'rotate-180' : ''}`} />
                )}
              </div>

              {/* Expanded Modules (Accordion) */}
              <AnimatePresence>
                {expandedId === course.id && course.modules.length > 0 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-800/50 bg-black/20"
                  >
                    <div className="p-4 space-y-3">
                      {course.modules.map((mod, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded transition-colors group/item">
                          <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 group-hover/item:border-amber-500 group-hover/item:text-amber-500">
                            {idx + 1}
                          </div>
                          <span className="text-sm text-slate-300">{mod}</span>
                          <div className="ml-auto opacity-0 group-hover/item:opacity-100">
                            <Play size={12} className="text-amber-500" />
                          </div>
                        </div>
                      ))}
                      <button className="w-full mt-2 py-3 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2">
                        <BookOpen size={14} />
                        Resume Training
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}