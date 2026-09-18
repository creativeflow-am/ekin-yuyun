"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardWfo from "@/components/DashboardWfo";
import DashboardWfa from "@/components/DashboardWfa";
import Overview from "@/components/Overview";
import TaskForm from "@/components/TaskForm";
import { SkeletonDashboard } from "@/components/Skeleton";
import { getTasks } from "@/lib/data";

export default function Home() {
  const [activeTab, setActiveTab] = useState("wfo");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formSource, setFormSource] = useState("wfo"); // track which tab opened the form

  useEffect(() => {
    fetchData();
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
      });
    }
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (activeTab === "wfo") return <DashboardWfo tasks={tasks} refreshData={fetchData} onOpenForm={() => { setFormSource("wfo"); setActiveTab("tambah"); }} />;
    if (activeTab === "wfa") return <DashboardWfa tasks={tasks} refreshData={fetchData} onOpenForm={() => { setFormSource("wfa"); setActiveTab("tambah"); }} />;
    if (activeTab === "overview") return <Overview tasks={tasks} />;
    if (activeTab === "tambah") return (
      <div className="fade-in w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-6 border-b border-slate-100 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Tambah Jurnal {formSource === "wfa" ? "WFA" : "WFO"}</h2>
            <p className="text-sm text-slate-500 font-medium">Catat aktivitas harian Anda</p>
          </div>
          <button onClick={() => setActiveTab(formSource)} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800">
            &larr; Kembali
          </button>
        </div>
        <TaskForm 
          isOpen={true} 
          onClose={() => setActiveTab(formSource)} 
          refreshData={fetchData}
          defaultTipeKerja={formSource === "wfa" ? "WFA" : "WFO"}
        />
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Top Header Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 shadow-sm bg-[#158684]">
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
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }} 
        isOpen={isSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full h-screen overflow-hidden">
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto pt-20 lg:pt-8 px-4 pb-28 sm:px-8 lg:pb-10 w-full z-10">
          {isLoading ? (
            <SkeletonDashboard />
          ) : (
            renderContent()
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-slate-200 flex justify-around items-stretch pb-safe z-50 shadow-lg">
        <button onClick={() => setActiveTab('overview')} className={`flex-1 pt-2 pb-3 px-2 flex flex-col items-center gap-1 transition-colors relative ${activeTab === 'overview' ? 'text-[#158684]' : 'text-slate-400'}`}>
          <span className={`absolute top-0 left-3 right-3 h-0.5 rounded-b-full transition-colors ${activeTab === 'overview' ? 'bg-[#158684]' : 'bg-transparent'}`}></span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
          <span className="text-[10px] font-semibold tracking-wide">Overview</span>
        </button>
        <button onClick={() => setActiveTab('wfo')} className={`flex-1 pt-2 pb-3 px-2 flex flex-col items-center gap-1 transition-colors relative ${activeTab === 'wfo' || activeTab === 'tambah' ? 'text-[#158684]' : 'text-slate-400'}`}>
          <span className={`absolute top-0 left-3 right-3 h-0.5 rounded-b-full transition-colors ${activeTab === 'wfo' || activeTab === 'tambah' ? 'bg-[#158684]' : 'bg-transparent'}`}></span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <span className="text-[10px] font-semibold tracking-wide">WFO</span>
        </button>
        <button onClick={() => setActiveTab('wfa')} className={`flex-1 pt-2 pb-3 px-2 flex flex-col items-center gap-1 transition-colors relative ${activeTab === 'wfa' ? 'text-[#158684]' : 'text-slate-400'}`}>
          <span className={`absolute top-0 left-3 right-3 h-0.5 rounded-b-full transition-colors ${activeTab === 'wfa' ? 'bg-[#158684]' : 'bg-transparent'}`}></span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-semibold tracking-wide">WFA</span>
        </button>
      </nav>
    </div>
  );
}
