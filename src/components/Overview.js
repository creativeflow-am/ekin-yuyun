import { useState, useRef } from "react";
import { generatePdfOverview } from "@/lib/pdf";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';

export default function Overview({ tasks }) {
  const [filterBulan, setFilterBulan] = useState("Semua");
  const [previewData, setPreviewData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const chartContainerRef = useRef(null);
  
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

  const handleExportChart = async () => {
    if (!chartContainerRef.current) return;
    setIsExporting(true);
    try {
      const element = chartContainerRef.current;
      // Add temporary watermark
      const watermark = document.createElement('div');
      watermark.id = "temp-watermark-export";
      watermark.className = "text-center text-xs text-slate-500 py-6 font-semibold mt-4 border-t border-slate-200 w-full";
      watermark.innerHTML = `Diunduh dari Jurnal Yuyun - Humas Ditjen Pendis pada ${new Date().toLocaleString('id-ID')}`;
      element.appendChild(watermark);

      const canvas = await html2canvas(element, { 
        scale: 2, 
        backgroundColor: '#f8fafc',
        logging: false 
      });
      
      const pngUrl = canvas.toDataURL('image/png');
      const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
      
      setPreviewData({
        png: pngUrl,
        jpg: jpgUrl,
        width: canvas.width,
        height: canvas.height,
        filename: `Statistik_Overview_${filterBulan === 'Semua' ? 'Keseluruhan' : monthNames[filterBulan]}_2026`
      });

      element.removeChild(watermark);
    } catch (e) {
      console.error("Export failed", e);
      const wm = document.getElementById("temp-watermark-export");
      if (wm) wm.parentNode.removeChild(wm);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = async (format) => {
    if (!previewData) return;
    
    if (format === 'pdf') {
      const { default: jsPDF } = await import("jspdf");
      // Calculate aspect ratio to fit A4
      const a4Width = 595.28;
      const a4Height = 841.89;
      
      // We will create a landscape or portrait PDF depending on aspect ratio
      const orientation = previewData.width > previewData.height ? 'l' : 'p';
      const pdf = new jsPDF(orientation, 'pt', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // margin
      const margin = 20;
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - (margin * 2);
      
      let finalWidth = availableWidth;
      let finalHeight = (previewData.height * availableWidth) / previewData.width;
      
      if (finalHeight > availableHeight) {
        finalHeight = availableHeight;
        finalWidth = (previewData.width * availableHeight) / previewData.height;
      }
      
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(previewData.png, 'PNG', x, y, finalWidth, finalHeight);
      pdf.save(`${previewData.filename}.pdf`);
    } else {
      const link = document.createElement('a');
      link.download = `${previewData.filename}.${format}`;
      link.href = format === 'png' ? previewData.png : previewData.jpg;
      link.click();
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 lg:mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
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
            <button onClick={handleExportChart} disabled={isExporting} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-2.5 px-4 rounded-md transition-all shadow-md flex justify-center items-center gap-2 text-sm sm:text-base whitespace-nowrap">
              {isExporting ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              )}
              <span>Unduh Grafik</span>
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

      <div ref={chartContainerRef} className="pb-4 bg-[#f8fafc]">
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

      {/* Image Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-900/95 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800 text-white shadow-md border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-md text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-200">Preview Grafik & Statistik</h3>
            </div>
            <button onClick={() => setPreviewData(null)} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-xs sm:text-sm font-semibold transition-colors">Batal</button>
          </div>
          
          <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
            <img src={previewData.png} alt="Preview Grafik" className="max-w-full h-auto shadow-2xl rounded-lg ring-4 ring-white/10" />
          </div>

          <div className="bg-slate-800 p-4 border-t border-slate-700/50 flex flex-wrap justify-center gap-3">
            <button onClick={() => downloadFile('png')} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Unduh PNG
            </button>
            <button onClick={() => downloadFile('jpg')} className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Unduh JPG
            </button>
            <button onClick={() => downloadFile('pdf')} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Unduh PDF
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
