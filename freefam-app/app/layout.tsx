import type { Metadata } from 'next'
import { Inter, Cinzel } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Calendar, BrainCircuit, User, Shield } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' })

export const metadata: Metadata = {
  title: 'Freedom Family',
  description: 'Methods are Many. Principles are Few.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${cinzel.variable} bg-slate-950 text-slate-200 pb-20`}>
        <div className="max-w-md mx-auto min-h-screen border-x border-slate-800 bg-slate-950 relative shadow-2xl shadow-black">
          
          {/* Header */}
          <header className="p-4 border-b border-amber-500/20 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-500" />
              <h1 className="font-cinzel font-bold text-lg tracking-widest text-amber-500">FreeFam</h1>
            </div>
            <div className="text-xs font-mono text-slate-500">EST. 2025</div>
          </header>

          {/* Main Content */}
          <main className="p-4">
            {children}
          </main>

          {/* Bottom Nav */}
          <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-2 z-50">
            <div className="max-w-md mx-auto flex justify-around items-center">
              <Link href="/" className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-amber-500 transition-colors">
                <Calendar size={20} />
                <span className="text-[10px] uppercase tracking-wider">Events</span>
              </Link>
              <Link href="/brain-train" className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-amber-500 transition-colors">
                <BrainCircuit size={20} />
                <span className="text-[10px] uppercase tracking-wider">Train</span>
              </Link>
              <Link href="/profile" className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-amber-500 transition-colors">
                <User size={20} />
                <span className="text-[10px] uppercase tracking-wider">ID</span>
              </Link>
            </div>
          </nav>

        </div>
      </body>
    </html>
  )
}