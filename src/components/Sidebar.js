export default function Sidebar({ activeTab, setActiveTab, isOpen }) {
  const navItems = [
    { 
      id: "overview", 
      label: "Overview", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      )
    },
    { 
      id: "wfo", 
      label: "Work From Office", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      )
    },
    { 
      id: "wfa", 
      label: "Work From Anywhere", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      )
    }
  ];

  return (
    <aside 
      className={`${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 h-screen bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out shadow-none flex-shrink-0`}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-11 w-11 rounded-md shadow-sm shadow-indigo-200 overflow-hidden border-2 border-slate-200 flex-shrink-0 bg-white">
            <img src="/logo.svg" alt="Logo Jurnal Yuyun" className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: "#158684" }}>Jurnal Yuyun</h2>
            <p className="text-xs text-slate-500 font-medium">Humas Ditjen Pendis</p>
          </div>
        </div>
        
        <nav className="space-y-2 flex-grow">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-none transition-colors border-l-4 ${
                activeTab === item.id 
                  ? "border-[#158684] bg-[#158684]/10 text-[#158684]" 
                  : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold border border-slate-300">
              YW
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">Yuyun Wulandari</p>
              <p className="text-xs text-slate-500">Pranata Humas</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
