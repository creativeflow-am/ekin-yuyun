import { useState } from "react";
import { generatePdfWfa } from "@/lib/pdf";
import { SKP_LIST } from "@/lib/constants";
import { deleteTask } from "@/lib/data";
import EditModal from "@/components/EditModal";

export default function DashboardWfa({ tasks, refreshData, onOpenForm }) {
  const [filterBulan, setFilterBulan] = useState("Semua");
  const [filterSkp, setFilterSkp] = useState("Semua");
  const [deletingId, setDeletingId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

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

  const wfaTasks = tasks.filter(task => task.tipeKerja === "WFA");
  const filteredTasks = wfaTasks.filter(task => {
    const matchBulan = filterBulan === "Semua" || (task.tanggal && task.tanggal.split("-")[1] === filterBulan);
    const matchSkp = filterSkp === "Semua" || task.skp === filterSkp;
    return matchBulan && matchSkp;
  });

  return (
    <div className="fade-in w-full">
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-center sm:text-left">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Work From Anywhere</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Laporan kegiatan (WFA)</p>
        </div>
      </div>

      <div className="w-full">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-end mb-6 pb-6 border-b border-slate-200/80">
          <div className="w-full md:w-1/4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 ml-1">Bulan</label>
            <select value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)} className="input-field w-full p-2.5 sm:p-3 bg-slate-50 lg:bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#FDB200] outline-none text-slate-700 text-sm cursor-pointer">
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
            <button
              onClick={async () => {
                setPdfLoading(true);
                try { await generatePdfWfa(filteredTasks, filterBulan); }
                finally { setPdfLoading(false); }
              }}
              disabled={pdfLoading}
              className="w-full bg-slate-700 hover:bg-slate-800 disabled:opacity-60 text-white font-bold py-2.5 px-5 rounded-md transition-all shadow-md flex justify-center items-center gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              {pdfLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <span>{pdfLoading ? "Memproses..." : "Unduh PDF"}</span>
            </button>
          </div>
        </div>

        {/* Table (visible on desktop only) */}
        <div className="hidden lg:block overflow-x-auto border-t border-slate-300 mt-4 shadow-sm rounded-md">
          <table className="w-full text-sm text-left text-slate-800">
            <thead className="text-xs text-white uppercase border-b border-slate-300 bg-indigo-600">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold whitespace-nowrap text-center">No</th>
                <th scope="col" className="px-4 py-3 font-bold whitespace-nowrap">Tanggal</th>
                <th scope="col" className="px-4 py-3 font-bold whitespace-nowrap text-center">Jam Masuk</th>
                <th scope="col" className="px-4 py-3 font-bold whitespace-nowrap text-center">Jam Pulang</th>
                <th scope="col" className="px-4 py-3 font-bold min-w-[200px]">Butir Kegiatan SKP</th>
                <th scope="col" className="px-4 py-3 font-bold min-w-[250px]">Realisasi / Output</th>
                <th scope="col" className="px-4 py-3 font-bold text-center">Kuantitas & Bukti</th>
                <th scope="col" className="px-4 py-3 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60 bg-white">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">Belum ada data WFA</td>
                </tr>
              ) : (
                (() => {
                  let groupedWfa = [];
                  filteredTasks.forEach(item => {
                    let dateGroup = groupedWfa.find(g => g.tanggal === item.tanggal);
                    if (!dateGroup) {
                      dateGroup = {
                        tanggal: item.tanggal,
                        jam_masuk: item.jamMasuk || "-",
                        jam_pulang: item.jamPulang || "-",
                        skpGroups: [],
                        totalItems: 0
                      };
                      groupedWfa.push(dateGroup);
                    }

                    let skpGroup = dateGroup.skpGroups.find(s => s.skp === item.skp);
                    if (!skpGroup) {
                      skpGroup = { skp: item.skp, items: [] };
                      dateGroup.skpGroups.push(skpGroup);
                    }

                    skpGroup.items.push(item);
                    dateGroup.totalItems++;
                  });

                  let no = 1;
                  return groupedWfa.map((dateGroup, dateIndex) => {
                    let dateRowSpan = dateGroup.totalItems;
                    
                    return dateGroup.skpGroups.map((skpGroup, skpIndex) => {
                      let skpRowSpan = skpGroup.items.length;
                      
                      return skpGroup.items.map((item, itemIndex) => {
                        let evUrl = item.evidence_url || item.evidence;
                        let isLink = item.tipe_evidence === 'Tautan' || item.type === 'link';
                        
                        return (
                          <tr key={item.id || `${dateIndex}-${skpIndex}-${itemIndex}`} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            {skpIndex === 0 && itemIndex === 0 && (
                              <>
                                <td rowSpan={dateRowSpan} className="px-4 py-3 align-top text-center font-medium border-r border-slate-100 bg-slate-50/30 whitespace-nowrap">{no++}</td>
                                <td rowSpan={dateRowSpan} className="px-4 py-3 align-top font-medium whitespace-nowrap border-r border-slate-100 bg-slate-50/30">{dateGroup.tanggal}</td>
                                <td rowSpan={dateRowSpan} className="px-4 py-3 align-top font-medium whitespace-nowrap text-center border-r border-slate-100 bg-slate-50/30">{dateGroup.jam_masuk}</td>
                                <td rowSpan={dateRowSpan} className="px-4 py-3 align-top font-medium whitespace-nowrap text-center border-r border-slate-100 bg-slate-50/30">{dateGroup.jam_pulang}</td>
                              </>
                            )}
                            
                            {itemIndex === 0 && (
                              <td rowSpan={skpRowSpan} className="px-4 py-3 align-top border-r border-slate-100 bg-slate-50/30">{item.skp}</td>
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
                              <div className="flex justify-center items-center gap-1.5">
                                <button
                                  onClick={() => setEditingTask(item)}
                                  title="Edit"
                                  className="text-[#158684] bg-[#158684]/10 hover:bg-[#158684]/20 p-1.5 rounded transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
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
                  });
                })()
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list (visible on mobile only) */}
        <div className="lg:hidden space-y-0 mt-4">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-slate-500 py-8 font-medium">Tidak ada data WFA.</p>
          ) : (
            (() => {
              let groupedWfa = [];
              filteredTasks.forEach(item => {
                let dateGroup = groupedWfa.find(g => g.tanggal === item.tanggal);
                if (!dateGroup) {
                  dateGroup = {
                    tanggal: item.tanggal,
                    jam_masuk: item.jamMasuk || "-",
                    jam_pulang: item.jamPulang || "-",
                    skpGroups: [],
                    totalItems: 0
                  };
                  groupedWfa.push(dateGroup);
                }

                let skpGroup = dateGroup.skpGroups.find(s => s.skp === item.skp);
                if (!skpGroup) {
                  skpGroup = { skp: item.skp, items: [] };
                  dateGroup.skpGroups.push(skpGroup);
                }

                skpGroup.items.push(item);
                dateGroup.totalItems++;
              });

              return groupedWfa.map((dateGroup, dateIndex) => {
                let dateChip = (
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                    <span className="inline-flex text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: "#158684" }}>{dateGroup.tanggal}</span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                      <span>M: {dateGroup.jam_masuk}</span>
                      <span>&bull;</span>
                      <span>P: {dateGroup.jam_pulang}</span>
                    </div>
                  </div>
                );

                return dateGroup.skpGroups.map((skpGroup, skpIndex) => {
                  return skpGroup.items.map((item, itemIndex) => {
                    let evUrl = item.evidence_url || item.evidence;
                    let isLink = item.tipe_evidence === 'Tautan' || item.type === 'link';
                    
                    return (
                      <div key={item.id || `${dateIndex}-${skpIndex}-${itemIndex}`} className="bg-white border border-slate-200 rounded-xl p-3.5 mb-2.5 shadow-sm active:bg-slate-50">
                        {skpIndex === 0 && itemIndex === 0 && dateChip}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-slate-500 leading-tight block truncate">{item.skp}</span>
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
              });
            })()
          )}
        </div>
      </div>
    </div>

    {/* Edit Modal */}
    {editingTask && (
      <EditModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        refreshData={refreshData}
      />
    )}
  );
}
