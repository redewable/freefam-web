'use client'
import { MapPin, Users, Calendar, ArrowRight, ShieldAlert, Clock, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="space-y-8 pb-24">
      
      {/* 1. HERO SECTION: The Immediate Mission */}
      <section className="relative overflow-hidden rounded-2xl border border-amber-500/50 bg-gradient-to-br from-amber-900/40 via-slate-900 to-slate-950 p-6 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
        {/* Animated Background Pulse */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full animate-pulse"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-center border-b border-amber-500/30 pb-3">
            <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-amber-500 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Live Protocol
            </span>
            <span className="font-cinzel text-xs text-amber-200">T-Minus 04:12:30</span>
          </div>

          <div>
            <h1 className="font-cinzel text-3xl text-white leading-tight mb-1 drop-shadow-lg">
              Showing The Plan
            </h1>
            <p className="text-xs font-mono text-amber-500/80">OPERATION: EXPANSION</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-black/30 p-2 rounded border border-amber-500/20 flex items-center gap-2 text-slate-300">
              <Clock size={14} className="text-amber-500" />
              <span>1900 Hours</span>
            </div>
            <div className="bg-black/30 p-2 rounded border border-amber-500/20 flex items-center gap-2 text-slate-300">
              <MapPin size={14} className="text-amber-500" />
              <span>Adrian's HQ</span>
            </div>
          </div>

          <button className="w-full mt-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-widest py-3 rounded shadow-lg transition-all flex items-center justify-center gap-2">
            Confirm Attendance <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* 2. SECTION HEADER */}
      <div className="flex items-center justify-between px-2">
        <h2 className="font-cinzel text-lg text-slate-200">Upcoming Operations</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-4"></div>
      </div>

      {/* 3. MISSION DOSSIERS (Event Cards) */}
      <div className="space-y-4">
        
        {/* Card 1: STP */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="group relative bg-slate-900/60 backdrop-blur-sm border-l-2 border-l-slate-600 hover:border-l-amber-500 border-y border-r border-slate-800 rounded-r-lg p-5 overflow-hidden transition-all"
        >
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-amber-500 mb-1">MON • FEB 16</span>
                <h3 className="font-cinzel text-xl text-slate-100 group-hover:text-amber-400 transition-colors">STP Briefing</h3>
              </div>
              <div className="bg-slate-800 px-2 py-1 rounded text-[10px] font-bold text-slate-400 border border-slate-700">LOCAL</div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Users size={14} className="text-slate-500" />
                <span>Speakers: <span className="text-slate-200">Jeff & Libby Byington</span></span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <ShieldAlert size={14} className="text-slate-500" />
                <span>Plan Starts: <span className="text-slate-200">1930 - 2030</span></span>
              </div>
            </div>

            {/* Timeline Strip */}
            <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500 border-t border-slate-800 pt-3">
              <span className="px-1.5 py-0.5 bg-slate-800 rounded text-amber-500">19:00 ARRIVAL</span>
              <ChevronRight size={10} />
              <span>19:15 GUEST</span>
              <ChevronRight size={10} />
              <span>19:30 PLAN</span>
              <ChevronRight size={10} />
              <span>20:45 TRAIN</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: WINTER'S SPRING LEADERSHIP (Coming Soon) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="group relative bg-gradient-to-b from-slate-900 to-black border border-amber-500/30 rounded-lg p-1"
        >
          {/* Golden Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-amber-900 opacity-20 group-hover:opacity-40 blur transition-opacity"></div>

          <div className="relative bg-[#0a0a0a] rounded p-5">
            <div className="absolute top-0 right-0 p-3">
              <div className="w-16 h-16 border-t border-r border-amber-500/20 rounded-tr-xl"></div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-amber-900/30 border border-amber-500/30 rounded text-[9px] font-bold text-amber-500 uppercase tracking-widest animate-pulse">Coming Soon</span>
              </div>
              <h3 className="font-cinzel text-2xl text-white mb-1">Winter's Spring Leadership</h3>
              <p className="text-xs font-serif italic text-slate-400">Save the Date</p>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-4">
              <div className="bg-slate-900/50 p-2 rounded border border-slate-800">
                <div className="text-[9px] text-slate-500 uppercase">Dates</div>
                <div className="text-xs font-bold text-slate-200">APR 17 - APR 19, 2026</div>
              </div>
            </div>

            <button className="w-full py-2 border border-slate-700 hover:border-amber-500 text-slate-400 hover:text-white text-xs uppercase tracking-widest rounded transition-all">
              Details Coming Soon
            </button>
          </div>
        </motion.div>

      </div>

      {/* 4. FOOTER QUOTE */}
      <div className="text-center space-y-2 opacity-50 pt-8">
        <ShieldAlert className="w-6 h-6 mx-auto text-amber-900" />
        <p className="font-cinzel text-xs text-amber-900">Freedom Family • Est. 2025</p>
      </div>

    </div>
  )
}