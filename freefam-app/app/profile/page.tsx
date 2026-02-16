import { QrCode, TrendingUp, Award, Zap, Settings, ShieldCheck } from 'lucide-react'

export default function Profile() {
  return (
    <div className="space-y-8 pb-20">
      
      {/* 1. THE DIGITAL ID BADGE */}
      <div className="relative group perspective-1000">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-900 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-gradient-to-br from-slate-900 via-[#0f172a] to-black border border-amber-500/30 rounded-xl p-6 overflow-hidden">
          
          {/* Background Texture */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck size={140} />
          </div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Active IBO</span>
              </div>
              <h2 className="font-cinzel text-2xl text-white tracking-wide">Talor Byington</h2>
              <div className="text-amber-500 font-mono text-sm">#82910-TX</div>
            </div>
            <div className="bg-white p-1 rounded">
              <QrCode size={40} className="text-black" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/50 p-2 rounded border border-slate-700 text-center">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Rank</div>
              <div className="text-slate-100 font-bold text-sm">PLATINUM</div>
            </div>
            <div className="bg-slate-800/50 p-2 rounded border border-slate-700 text-center">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">PV Goal</div>
              <div className="text-slate-100 font-bold text-sm">7,500</div>
            </div>
            <div className="bg-slate-800/50 p-2 rounded border border-slate-700 text-center">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Team</div>
              <div className="text-slate-100 font-bold text-sm">58</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HABIT TRACKER (The "Chain") */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-cinzel text-lg text-slate-200">Consistency Chain</h3>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-mono">
            <Zap size={14} fill="currentColor" />
            <span>12 DAY STREAK</span>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} className="text-center text-[10px] text-slate-600 font-mono">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {/* Generating fake history for visuals */}
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className={`aspect-square rounded-sm ${i > 10 ? 'bg-slate-800' : 'bg-amber-600/80 shadow-[0_0_5px_rgba(212,175,55,0.4)]'}`}></div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
            <span>Last 14 Days</span>
            <span className="text-white">85% Completion</span>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS */}
      <div className="space-y-3">
        <h3 className="font-cinzel text-lg text-slate-200 px-1">Command</h3>
        <button className="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-lg group transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-900/20 text-blue-500"><TrendingUp size={18} /></div>
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-200">Review Analytics</div>
              <div className="text-xs text-slate-500">Check downline volume</div>
            </div>
          </div>
        </button>
        
        <button className="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-lg group transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-900/20 text-purple-500"><Award size={18} /></div>
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-200">Leaderboard</div>
              <div className="text-xs text-slate-500">Top Recruiters this month</div>
            </div>
          </div>
        </button>

        <button className="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-lg group transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-slate-800 text-slate-400"><Settings size={18} /></div>
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-200">Account Settings</div>
              <div className="text-xs text-slate-500">Manage subscription & password</div>
            </div>
          </div>
        </button>
      </div>

    </div>
  )
}