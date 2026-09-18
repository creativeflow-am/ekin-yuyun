"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { TaskProvider } from "@/context/TaskContext";

export default function ClientLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  const isTambah = pathname === '/tambah';
  const urlType = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('type') : null;
  const isWfoActive = pathname === '/wfo' || (isTambah && urlType === 'wfo');
  const isWfaActive = pathname === '/wfa' || (isTambah && urlType === 'wfa');
  
  return (
    <TaskProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Top Header Bar */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 shadow-sm bg-[#158684] print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md overflow-hidden bg-white/10 flex-shrink-0 border border-white/20">
              <img src="/logo.svg" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-white font-extrabold text-base leading-tight">Jurnal Yuyun</h1>
              <p className="text-white/70 text-[10px] font-medium -mt-0.5">Humas Ditjen Pendis</p>
            </div>
          </div>
        </header>

        {/* Desktop Sidebar */}
        <div className="print:hidden">
          <Sidebar 
            activeTab={pathname} 
            setActiveTab={() => setIsSidebarOpen(false)} 
            isOpen={isSidebarOpen} 
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative w-full h-screen overflow-hidden">
          <main className="flex-1 overflow-y-auto pt-20 lg:pt-8 px-4 pb-28 sm:px-8 lg:pb-10 w-full z-10">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-slate-200 flex justify-around items-stretch pb-safe z-50 shadow-lg print:hidden">
          <Link href="/overview" className={`flex-1 pt-2 pb-3 px-2 flex flex-col items-center gap-1 transition-colors relative ${pathname === '/overview' ? 'text-[#158684]' : 'text-slate-400'}`}>
            <span className={`absolute top-0 left-3 right-3 h-0.5 rounded-b-full transition-colors ${pathname === '/overview' ? 'bg-[#158684]' : 'bg-transparent'}`}></span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            <span className="text-[10px] font-semibold tracking-wide">Overview</span>
          </Link>
          <Link href="/wfo" className={`flex-1 pt-2 pb-3 px-2 flex flex-col items-center gap-1 transition-colors relative ${isWfoActive ? 'text-[#158684]' : 'text-slate-400'}`}>
            <span className={`absolute top-0 left-3 right-3 h-0.5 rounded-b-full transition-colors ${isWfoActive ? 'bg-[#158684]' : 'bg-transparent'}`}></span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <span className="text-[10px] font-semibold tracking-wide">WFO</span>
          </Link>
          <Link href="/wfa" className={`flex-1 pt-2 pb-3 px-2 flex flex-col items-center gap-1 transition-colors relative ${isWfaActive ? 'text-[#158684]' : 'text-slate-400'}`}>
            <span className={`absolute top-0 left-3 right-3 h-0.5 rounded-b-full transition-colors ${isWfaActive ? 'bg-[#158684]' : 'bg-transparent'}`}></span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-semibold tracking-wide">WFA</span>
          </Link>
        </nav>
      </div>
    </TaskProvider>
  );
}
