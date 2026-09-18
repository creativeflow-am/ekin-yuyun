import { useState } from "react";
import { addTask } from "@/lib/data";
import { uploadToGoogleDrive } from "@/lib/drive";
import { SKP_LIST } from "@/lib/constants";

export default function TaskForm({ isOpen, onClose, refreshData, addTaskLocal, defaultTipeKerja = "WFO" }) {
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split("T")[0], // default hari ini
    tipeKerja: defaultTipeKerja,
    jamMasuk: "08:00",
    jamPulang: "17:00",
    skp: "",
    deskripsi: "",
    tipeEvidence: "file",
    tautan: "",
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  if (!isOpen) return null;

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        showToast("Ukuran file maksimal 10MB", "error");
        e.target.value = "";
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.skp) {
      showToast("Pilih Butir Kegiatan SKP terlebih dahulu", "error");
      return;
    }
    setIsSubmitting(true);
    
    try {
      if (formData.tipeEvidence === "link" && !formData.tautan) {
        showToast("Tautan bukti kegiatan tidak boleh kosong!", "error");
        setIsSubmitting(false);
        return;
      }
      
      if (formData.tipeEvidence === "file" && !file) {
        showToast("File bukti kegiatan wajib diunggah!", "error");
        setIsSubmitting(false);
        return;
      }

      let finalEvidenceUrl = "";
      if (formData.tipeEvidence === "link") {
        finalEvidenceUrl = formData.tautan;
      }

      // Upload file ke Google Drive jika ada
      if (formData.tipeEvidence === "file" && file) {
        showToast("Mengunggah berkas ke Google Drive...", "info");
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
        reader.readAsDataURL(file);
        const base64Data = await base64Promise;
        finalEvidenceUrl = await uploadToGoogleDrive(base64Data, file.name, file.type);
      }

      const taskPayload = {
        tanggal: formData.tanggal,
        tipeKerja: formData.tipeKerja,
        jamMasuk: formData.tipeKerja === "WFA" ? formData.jamMasuk : "",
        jamPulang: formData.tipeKerja === "WFA" ? formData.jamPulang : "",
        skp: formData.skp,
        deskripsi: formData.deskripsi,
        evidence: finalEvidenceUrl,
        tipe_evidence: formData.tipeEvidence === "file" ? "File" : formData.tipeEvidence === "link" ? "Tautan" : "",
      };

      const addedTask = await addTask(taskPayload);
      setShowSuccessOverlay(true);
      
      if (addTaskLocal) {
        addTaskLocal(addedTask);
      } else if (refreshData) {
        await refreshData();
      }
      
      setTimeout(() => {
        onClose(formData.tipeKerja);
        setTimeout(() => setShowSuccessOverlay(false), 300); // reset after animation
      }, 700);

    } catch (error) {
      console.error("Submit error:", error);
      if (error.message && error.message.includes("Drive")) {
        showToast("Gagal upload file. Pastikan GAS sudah di-deploy. Data lain bisa tetap disimpan tanpa bukti.", "error");
      } else {
        showToast("Gagal menyimpan: " + (error.message || "Cek koneksi internet"), "error");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* Success Overlay */}
      {showSuccessOverlay && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Berhasil!</h3>
          <p className="text-sm text-slate-500 font-medium">Data kegiatan telah disimpan.</p>
        </div>
      )}

      {toast.show && (
        <div className={`mb-4 p-3 rounded-md text-sm font-semibold text-white transition-all ${toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tanggal */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal Kegiatan <span className="text-red-500">*</span></label>
          <input type="date" name="tanggal" required value={formData.tanggal} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#82B29A]/30 focus:border-[#82B29A] outline-none text-slate-700" />
        </div>

        {/* Jenis Kegiatan */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Kegiatan <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-3">
            {["WFO", "WFA"].map(tipe => (
              <label key={tipe} className={`flex items-center gap-3 p-3 rounded-md border-2 cursor-pointer transition-all ${formData.tipeKerja === tipe ? 'border-[#82B29A] bg-[#82B29A]/5' : 'border-slate-200 hover:border-slate-300'}`}>
                <input type="radio" name="tipeKerja" value={tipe} checked={formData.tipeKerja === tipe} onChange={handleInputChange} className="w-4 h-4 cursor-pointer accent-[#82B29A]" />
                <div>
                  <span className="text-sm font-bold text-slate-800">{tipe}</span>
                  <p className="text-xs text-slate-500">{tipe === "WFO" ? "Work From Office" : "Work From Anywhere"}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Jam Masuk / Pulang - hanya WFA */}
        {formData.tipeKerja === "WFA" && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jam Masuk <span className="text-red-500">*</span></label>
              <input type="time" name="jamMasuk" required value={formData.jamMasuk} onChange={handleInputChange} className="w-full p-2.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#82B29A]/30 focus:border-[#82B29A] outline-none text-slate-700 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jam Pulang <span className="text-red-500">*</span></label>
              <input type="time" name="jamPulang" required value={formData.jamPulang} onChange={handleInputChange} className="w-full p-2.5 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-[#82B29A]/30 focus:border-[#82B29A] outline-none text-slate-700 text-sm" />
            </div>
          </div>
        )}

        {/* Butir Kegiatan SKP */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Butir Kegiatan SKP <span className="text-red-500">*</span></label>
          <select name="skp" required value={formData.skp} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#82B29A]/30 focus:border-[#82B29A] outline-none text-slate-700 text-sm">
            <option value="">-- Pilih Butir Kegiatan SKP --</option>
            {SKP_LIST.map((skp) => (
              <option key={skp} value={skp}>{skp}</option>
            ))}
          </select>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi / Output Spesifik <span className="text-red-500">*</span></label>
          <textarea
            name="deskripsi"
            required
            value={formData.deskripsi}
            onChange={handleInputChange}
            rows="3"
            placeholder="Contoh: Membuat konten carousel untuk Instagram @ditjenpendis tentang penerimaan CPNS 2025..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#82B29A]/30 focus:border-[#82B29A] outline-none text-slate-700 text-sm resize-none"
          ></textarea>
        </div>

        {/* Evidence */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Bukti Kegiatan <span className="text-red-500">*</span></label>
          <div className="flex gap-3 mb-3">
            {[
              { value: "file", label: "Upload File" },
              { value: "link", label: "Tautan URL" },
            ].map(opt => (
              <label key={opt.value} className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer text-sm transition-all ${formData.tipeEvidence === opt.value ? 'border-[#82B29A] bg-[#82B29A]/5 text-[#82B29A] font-semibold' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                <input type="radio" name="tipeEvidence" value={opt.value} checked={formData.tipeEvidence === opt.value} onChange={handleInputChange} className="sr-only" />
                {opt.label}
              </label>
            ))}
          </div>

          {formData.tipeEvidence === "file" && (
            <div>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#82B29A]/10 file:text-[#82B29A] hover:file:bg-[#82B29A]/20 cursor-pointer"
              />
              {file && (
                <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  {file.name} ({(file.size/1024).toFixed(0)} KB)
                </p>
              )}
              <p className="text-xs text-slate-400 mt-1">Maks. 10MB. File akan diunggah ke Google Drive.</p>
            </div>
          )}

          {formData.tipeEvidence === "link" && (
            <input
              type="url"
              name="tautan"
              value={formData.tautan}
              onChange={handleInputChange}
              placeholder="https://drive.google.com/file/..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#82B29A]/30 focus:border-[#82B29A] outline-none text-slate-700 text-sm"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-extrabold py-3.5 px-6 rounded-md transition-all shadow-md text-white disabled:opacity-60 text-base flex items-center justify-center gap-2"
          style={{ backgroundColor: isSubmitting ? "#0d6462" : "#82B29A" }}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Menyimpan...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Simpan Jurnal
            </>
          )}
        </button>
      </form>
    </div>
  );
}
