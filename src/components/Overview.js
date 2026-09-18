import { useState } from "react";
import { generatePdfOverview } from "@/lib/pdf";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Overview({ tasks }) {
  const [filterBulan, setFilterBulan] = useState("Semua");
  
  const filteredTasks = tasks.filter(task => {
    return filterBulan === "Semua" || (task.tanggal && task.tanggal.split("-")[1] === filterBulan);
  });

  const total = filteredTasks.length;
  const wfoCount = filteredTasks.filter(t => t.tipeKerja === "WFO").length;
  const wfaCount = filteredTasks.filter(t => t.tipeKerja === "WFA").length;

  const activeMonths = new Set(filteredTasks.map(t => t.tanggal.split("-")[1])).size;

  // Chart Data
  const pieData = [
    { name: 'WFO', value: wfoCount },
    { name: 'WFA', value: wfaCount }
  ];
  const COLORS = ['#158684', '#FDB200']; // Kemenag Teal, WFA Yellow

  // Monthly Data
  const monthsDataRaw = filteredTasks.reduce((acc, t) => {
    const month = t.tanggal.split("-")[1];
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const monthNames = { "01":"Jan", "02":"Feb", "03":"Mar", "04":"Apr", "05":"Mei", "06":"Jun", "07":"Jul", "08":"Agt", "09":"Sep", "10":"Okt", "11":"Nov", "12":"Des" };
  const barData = Object.keys(monthsDataRaw).sort().map(k => ({
    name: monthNames[k],
    Jumlah: monthsDataRaw[k]
  }));

  // SKP Data
  const skpDataRaw = filteredTasks.reduce((acc, t) => {
    acc[t.skp] = (acc[t.skp] || 0) + 1;
    return acc;
  }, {});
  const skpData = Object.keys(skpDataRaw).map(k => ({
    name: k,
    Jumlah: skpDataRaw[k]
  })).sort((a, b) => b.Jumlah - a.Jumlah);

  return (
    <div className="w-full relative">
      
      {/* Print Watermark (Hanya Tampil Saat Print) */}
      <div className="hidden print:block text-center text-sm font-bold text-slate-800 mb-8 border-b-2 border-slate-800 pb-4">
        LAPORAN STATISTIK E-KINERJA<br/>
        <span className="font-normal text-xs text-slate-600">Jurnal Yuyun - Humas Ditjen Pendis</span>
      </div>

      <div className="mb-6 lg:mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Ringkasan keseluruhan aktivitas E-Kinerja</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="w-full sm:w-40">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">Bulan Laporan</label>
            <select value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)} className="input-field w-full p-2.5 sm:p-3 bg-slate-50 lg:bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#158684] outline-none text-slate-700 text-sm cursor-pointer transition-all hover:border-[#158684]/50">
              <option value="Semua">Semua Bulan</option>
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>
          <div className="w-full sm:w-auto flex items-end gap-2">
            <button onClick={() => window.print()} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-md transition-all shadow-md flex justify-center items-center gap-2 text-sm sm:text-base whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              <span>Unduh Grafik (Print)</span>
            </button>
            <button onClick={() => generatePdfOverview(filteredTasks, filterBulan)} className="w-full sm:w-auto bg-[#FDB200] hover:bg-yellow-500 text-white font-bold py-2.5 px-4 rounded-md transition-all shadow-md flex justify-center items-center gap-2 text-sm sm:text-base whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Unduh Tabel (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Kegiatan</p>
          <p className="text-3xl font-extrabold text-slate-800 mt-1">{total}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Work From Office</p>
          <p className="text-3xl font-extrabold mt-1 text-[#158684]">{wfoCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Work From Anywhere</p>
          <p className="text-3xl font-extrabold mt-1 text-[#FDB200]">{wfaCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bulan Aktif</p>
          <p className="text-3xl font-extrabold text-slate-700 mt-1">{activeMonths}</p>
        </div>
      </div>

      <div className="pb-4 bg-[#f8fafc] print:bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Distribusi WFO vs WFA</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs font-semibold mt-2">
            <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-[#158684]"></div>WFO</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-[#FDB200]"></div>WFA</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Kegiatan per Bulan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="Jumlah" fill="#71a9a8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm w-full lg:w-2/3">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Rekapitulasi Butir Kegiatan SKP</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={skpData} margin={{top: 0, right: 30, left: 0, bottom: 0}}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={200} axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="Jumlah" fill="#FDB200" barSize={20} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm w-full lg:w-1/3 flex flex-col">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Detail Butir Kegiatan</h3>
          </div>
          <div className="p-4 lg:p-0 flex-grow overflow-y-auto max-h-80">
            {/* Desktop Table */}
            <table className="hidden lg:table w-full text-sm text-left">
              <tbody className="divide-y divide-slate-100">
                {skpData.length === 0 ? (
                  <tr><td colSpan="2" className="px-4 py-4 text-center text-slate-500">Belum ada data</td></tr>
                ) : (
                  skpData.map(skp => (
                    <tr key={skp.name} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-700 text-xs">{skp.name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "rgba(21,134,132,0.1)", color: "#158684" }}>
                          {skp.Jumlah}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {skpData.length === 0 ? (
                <p className="text-center text-slate-500 py-4 font-medium text-sm">Belum ada data</p>
              ) : (
                skpData.map(skp => (
                  <div key={skp.name} className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex justify-between items-center gap-3 shadow-sm">
                    <span className="text-xs font-semibold text-slate-700 leading-snug">{skp.name}</span>
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0" style={{ backgroundColor: "rgba(21,134,132,0.1)", color: "#158684" }}>
                      {skp.Jumlah} kegiatan
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      </div>

      <div className="hidden print:block text-center text-xs text-slate-500 pt-8 mt-8 border-t border-slate-300">
        Dicetak pada {new Date().toLocaleString('id-ID')}
      </div>
    </div>
  );
}
