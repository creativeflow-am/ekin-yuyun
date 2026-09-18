import { useState } from "react";
import { updateTask } from "@/lib/data";
import { SKP_LIST } from "@/lib/constants";

export default function EditModal({ task, onClose, refreshData }) {
  const [formData, setFormData] = useState({
    tanggal: task.tanggal || "",
    tipeKerja: task.tipeKerja || "WFO",
    jamMasuk: task.jamMasuk || task.jam_masuk || "",
    jamPulang: task.jamPulang || task.jam_pulang || "",
    skp: task.skp || "",
    deskripsi: task.deskripsi || "",
    evidence: task.evidence || "",
    tipe_evidence: task.tipe_evidence || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.skp) {
      setError("Pilih Butir Kegiatan SKP");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const payload = {
        tanggal: formData.tanggal,
        tipeKerja: formData.tipeKerja,
        jamMasuk: formData.tipeKerja === "WFA" ? formData.jamMasuk : "",
        jamPulang: formData.tipeKerja === "WFA" ? formData.jamPulang : "",
        jam_masuk: formData.tipeKerja === "WFA" ? formData.jamMasuk : "",
        jam_pulang: formData.tipeKerja === "WFA" ? formData.jamPulang : "",
        skp: formData.skp,
        deskripsi: formData.deskripsi,
        evidence: formData.evidence,
        tipe_evidence: formData.tipe_evidence,
      };
      await updateTask(task.id, payload);
      await refreshData();
      onClose();
    } catch (err) {
      setError("Gagal menyimpan: " + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">Edit Jurnal Kegiatan</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{task.tanggal}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Tanggal */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal</label>
            <input type="date" name="tanggal" required value={formData.tanggal} onChange={handleChange}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#158684]/30 focus:border-[#158684] outline-none text-slate-700 text-sm" />
          </div>

          {/* Jenis Kegiatan */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Kegiatan</label>
            <div className="grid grid-cols-2 gap-2">
              {["WFO", "WFA"].map(tipe => (
                <label key={tipe} className={`flex items-center gap-2 p-2.5 rounded-md border-2 cursor-pointer transition-all ${formData.tipeKerja === tipe ? 'border-[#158684] bg-[#158684]/5' : 'border-slate-200'}`}>
                  <input type="radio" name="tipeKerja" value={tipe} checked={formData.tipeKerja === tipe} onChange={handleChange} className="accent-[#158684]" />
                  <span className="text-sm font-bold text-slate-800">{tipe}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Jam (WFA only) */}
          {formData.tipeKerja === "WFA" && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Jam Masuk</label>
                <input type="time" name="jamMasuk" required value={formData.jamMasuk} onChange={handleChange}
                  className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#158684]/30 focus:border-[#158684] outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Jam Pulang</label>
                <input type="time" name="jamPulang" required value={formData.jamPulang} onChange={handleChange}
                  className="w-full p-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#158684]/30 focus:border-[#158684] outline-none text-sm" />
              </div>
            </div>
          )}

          {/* SKP */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Butir Kegiatan SKP</label>
            <select name="skp" required value={formData.skp} onChange={handleChange}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#158684]/30 focus:border-[#158684] outline-none text-slate-700 text-sm">
              <option value="">-- Pilih Butir SKP --</option>
              {SKP_LIST.map(skp => (
                <option key={skp} value={skp}>{skp}</option>
              ))}
            </select>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi / Output</label>
            <textarea name="deskripsi" required value={formData.deskripsi} onChange={handleChange} rows="3"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#158684]/30 focus:border-[#158684] outline-none text-slate-700 text-sm resize-none"></textarea>
          </div>

          {/* Evidence URL (editable) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bukti / Evidence URL (opsional)</label>
            <input type="text" name="evidence" value={formData.evidence} onChange={handleChange}
              placeholder="https://drive.google.com/..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#158684]/30 focus:border-[#158684] outline-none text-slate-700 text-sm" />
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-md border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            form="edit-form"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-md text-white font-bold text-sm disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: "#158684" }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
