import { useState } from "react";
import { generatePdfWfo } from "@/lib/pdf";
import { SKP_LIST } from "@/lib/constants";
import { deleteTask } from "@/lib/data";

export default function DashboardWfo({ tasks, refreshData, onOpenForm }) {
  const [filterBulan, setFilterBulan] = useState("Semua");
  const [filterSkp, setFilterSkp] = useState("Semua");
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Hapus data ini?")) return;
    setDeletingId(id);
    try {
      await deleteTask(id);
      await refreshData();
    } catch (e) {
      alert("Gagal menghapus: " + e.message);
    } finally {
      setDeletingId(null);
    }
  };

  const wfoTasks = tasks.filter(task => task.tipeKerja === "WFO");
  const filteredTasks = wfoTasks.filter(task => {
    const matchBulan = filterBulan === "Semua" || (task.tanggal && task.tanggal.split("-")[1] === filterBulan);
    const matchSkp = filterSkp === "Semua" || task.skp === filterSkp;
    return matchBulan && matchSkp;
  });

  return (
    <div className="fade-in w-full">
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-center sm:text-left">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Work From Office</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Laporan kegiatan kantor (WFO)</p>
        </div>
      </div>

      <div className="w-full">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-end mb-6 pb-6 border-b border-slate-200/80">
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">Bulan</label>
            <select value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)} className="input-field w-full p-2.5 sm:p-3 bg-slate-50 lg:bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#158684] outline-none text-slate-700 text-sm cursor-pointer">
              <option value="Semua">Semua</option>
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

          <div className="w-full md:w-1/2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">SKP</label>
            <select value={filterSkp} onChange={(e) => setFilterSkp(e.target.value)} className="input-field w-full p-2.5 sm:p-3 bg-slate-50 lg:bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#158684] outline-none text-slate-700 text-sm cursor-pointer">
              <option value="Semua">Semua SKP</option>
              {SKP_LIST.map((skp) => (
                <option key={skp} value={skp}>{skp}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-auto ml-auto mt-2 md:mt-0 flex flex-row gap-2">
            <button onClick={onOpenForm} className="w-full text-white font-extrabold py-2.5 px-5 rounded-md transition-all shadow-md flex justify-center items-center gap-2 text-sm sm:text-base whitespace-nowrap" style={{backgroundColor: "#158684"}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Tambah Kegiatan</span>
            </button>
            <button onClick={() => generatePdfWfo(filteredTasks, filterBulan)} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-5 rounded-md transition-all shadow-md flex justify-center items-center gap-2 text-sm sm:text-base whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Unduh PDF</span>
            </button>
          </div>
        </div>

        {/* Table (visible on desktop only) */}
        <div className="hidden lg:block overflow-x-auto border-t border-slate-300 mt-4 shadow-sm rounded-md">
          <table className="w-full text-sm text-left text-slate-800">
          <thead className="text-xs text-slate-800 uppercase border-b border-slate-300 bg-slate-50/50">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold text-center">Tanggal</th>
                <th scope="col" className="px-4 py-3 font-bold">Rencana Hasil Kerja</th>
                <th scope="col" className="px-4 py-3 font-bold">Realisasi Deskripsi</th>
                <th scope="col" className="px-4 py-3 font-bold text-center">Bukti / Link</th>
                <th scope="col" className="px-4 py-3 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60 bg-white">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Belum ada data WFO</td>
                </tr>
              ) : (
                (() => {
                  let grouped = [];
                  filteredTasks.forEach(item => {
                    let key = item.tanggal + '|' + item.skp;
                    let group = grouped.find(g => g.key === key);
                    if (!group) {
                      group = { key, tanggal: item.tanggal, skp: item.skp, items: [] };
                      grouped.push(group);
                    }
                    group.items.push(item);
                  });

                  return grouped.map((group, groupIndex) => {
                    let rowSpan = group.items.length;
                    return group.items.map((item, index) => {
                      let evUrl = item.evidence_url || item.evidence;
                      let isLink = item.tipe_evidence === 'Tautan' || item.type === 'link';
                      
                      return (
                        <tr key={item.id || `${groupIndex}-${index}`} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                          {index === 0 && (
                            <td rowSpan={rowSpan} className="px-4 py-3 font-medium text-slate-800 align-top border-r border-slate-100 bg-slate-50/30 whitespace-nowrap text-center">
                              {item.tanggal}
                            </td>
                          )}
                          {index === 0 && (
                            <td rowSpan={rowSpan} className="px-4 py-3 align-top border-r border-slate-100 bg-slate-50/30">
                              {item.skp}
                            </td>
                          )}
                          <td className="px-4 py-3">
                            <div className="text-sm text-slate-800">{item.deskripsi}</div>
                          </td>
                          <td className="px-4 py-3 text-center align-top">
                            {evUrl && evUrl !== '#' ? (
                              isLink ? (
                                <a href={evUrl} target="_blank" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg hover:bg-indigo-100">Tautan</a>
                              ) : (
                                <a href={evUrl} target="_blank" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg hover:bg-emerald-100">File</a>
                              )
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-center align-top">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => handleDelete(item.id)}
                                disabled={deletingId === item.id}
                                title="Hapus"
                                className="text-red-500 bg-red-50 hover:bg-red-100 disabled:opacity-50 p-1.5 rounded transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  });
                })()
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list (visible on mobile only) */}
        <div className="lg:hidden space-y-0 mt-4">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-slate-500 py-8 font-medium">Tidak ada data WFO.</p>
          ) : (
            (() => {
              let grouped = [];
              filteredTasks.forEach(item => {
                let key = item.tanggal + '|' + item.skp;
                let group = grouped.find(g => g.key === key);
                if (!group) {
                  group = { key, tanggal: item.tanggal, skp: item.skp, items: [] };
                  grouped.push(group);
                }
                group.items.push(item);
              });

              return grouped.map((group, groupIndex) => {
                return group.items.map((item, index) => {
                  let evUrl = item.evidence_url || item.evidence;
                  let isLink = item.tipe_evidence === 'Tautan' || item.type === 'link';
                  
                  return (
                    <div key={item.id || `${groupIndex}-${index}`} className="bg-white border border-slate-200 rounded-xl p-3.5 mb-2.5 shadow-sm active:bg-slate-50">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          {index === 0 && (
                            <span className="inline-flex text-[10px] font-bold text-white px-2 py-0.5 rounded-full mr-1" style={{ backgroundColor: "#158684" }}>
                              {group.tanggal}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 leading-tight block mt-1 truncate">{group.skp}</span>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button className="p-1.5 rounded-lg border border-red-100 bg-red-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-800 font-medium leading-snug mb-2">{item.deskripsi}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-800 line-clamp-1">{item.skp}</span>
                        {evUrl && evUrl !== '#' && (
                          isLink ? (
                            <a href={evUrl} target="_blank" className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: "#158684", backgroundColor: "rgba(21,134,132,0.1)" }}>Tautan ↗</a>
                          ) : (
                            <a href={evUrl} target="_blank" className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">File ↗</a>
                          )
                        )}
                      </div>
                    </div>
                  );
                });
              });
            })()
          )}
        </div>
      </div>
    </div>
  );
}
