import { useState } from "react";
import { addTask } from "@/lib/data";
import { uploadToGoogleDrive } from "@/lib/drive";

export default function TaskForm({ isOpen, onClose, refreshData }) {
  const [formData, setFormData] = useState({
    tanggal: "",
    tipeKerja: "WFO",
    jamMasuk: "",
    jamPulang: "",
    skp: "",
    deskripsi: "",
    tipeEvidence: "file",
    tautan: "",
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  if (!isOpen) return null;

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        showToast("Ukuran file maksimal 5MB", "error");
        e.target.value = "";
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let finalEvidenceUrl = formData.tautan;

      // Handle File Upload to Google Drive if selected
      if (formData.tipeEvidence === "file" && file) {
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
        reader.readAsDataURL(file);
        const base64Data = await base64Promise;

        finalEvidenceUrl = await uploadToGoogleDrive(base64Data, file.name, file.type);
      }

      // Add to Firestore
      const taskPayload = {
        tanggal: formData.tanggal,
        tipeKerja: formData.tipeKerja,
        jam_masuk: formData.tipeKerja === "WFA" ? formData.jamMasuk : "",
        jam_pulang: formData.tipeKerja === "WFA" ? formData.jamPulang : "",
        skp: formData.skp,
        deskripsi: formData.deskripsi,
        evidence: finalEvidenceUrl,
        tipe_evidence: formData.tipeEvidence === "file" ? "File" : "Tautan",
      };

      await addTask(taskPayload);
      showToast("Data berhasil disimpan!");
      refreshData();
      
      setTimeout(() => {
        onClose();
        setIsSubmitting(false);
      }, 1000);

    } catch (error) {
      console.error(error);
      showToast("Gagal menyimpan data", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {toast.show && (
        <div className={`mb-4 p-3 rounded-md text-sm font-semibold text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal Kegiatan</label>
              <input type="date" name="tanggal" required value={formData.tanggal} onChange={handleInputChange} className="input-field w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-700" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Kegiatan</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative flex items-center gap-3 p-3.5 rounded-md border-2 cursor-pointer transition-colors ${formData.tipeKerja === 'WFO' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400'}`}>
                  <input type="radio" name="tipeKerja" value="WFO" checked={formData.tipeKerja === 'WFO'} onChange={handleInputChange} className="w-4 h-4 text-indigo-600 cursor-pointer" />
                  <div>
                    <span className="text-sm font-bold text-slate-800">WFO</span>
                    <p className="text-xs text-slate-500">Work From Office</p>
                  </div>
                </label>
                <label className={`relative flex items-center gap-3 p-3.5 rounded-md border-2 cursor-pointer transition-colors ${formData.tipeKerja === 'WFA' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400'}`}>
                  <input type="radio" name="tipeKerja" value="WFA" checked={formData.tipeKerja === 'WFA'} onChange={handleInputChange} className="w-4 h-4 text-indigo-600 cursor-pointer" />
                  <div>
                    <span className="text-sm font-bold text-slate-800">WFA</span>
                    <p className="text-xs text-slate-500">Work From Anywhere</p>
                  </div>
                </label>
              </div>
            </div>

            {formData.tipeKerja === "WFA" && (
              <div className="grid grid-cols-2 gap-4 fade-in">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Jam Masuk</label>
                  <input type="time" name="jamMasuk" required value={formData.jamMasuk} onChange={handleInputChange} className="input-field w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Jam Pulang</label>
                  <input type="time" name="jamPulang" required value={formData.jamPulang} onChange={handleInputChange} className="input-field w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-700" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Butir Kegiatan SKP</label>
              <select name="skp" required value={formData.skp} onChange={handleInputChange} className="input-field w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-700 text-sm">
                <option value="">-- Pilih SKP --</option>
                <option value="Menyusun naskah informasi publik">Menyusun naskah informasi publik</option>
                <option value="Membuat bahan publikasi di media sosial">Membuat bahan publikasi di media sosial</option>
                <option value="Mendokumentasikan kegiatan pimpinan">Mendokumentasikan kegiatan pimpinan</option>
                <option value="Menyusun laporan kegiatan">Menyusun laporan kegiatan</option>
              </select>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi Pekerjaan / Output Spesifik</label>
                <textarea name="deskripsi" required value={formData.deskripsi} onChange={handleInputChange} rows="2" placeholder="Contoh: Menyusun naskah pidato..." className="input-field w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-700 text-sm resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Bukti / Evidence</label>
                <div className="flex gap-4 p-2 bg-slate-50 rounded-md border border-slate-200 w-max">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="tipeEvidence" value="file" checked={formData.tipeEvidence === 'file'} onChange={handleInputChange} className="text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm font-medium">Dokumen</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="tipeEvidence" value="link" checked={formData.tipeEvidence === 'link'} onChange={handleInputChange} className="text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm font-medium">Tautan (URL)</span>
                  </label>
                </div>

                {formData.tipeEvidence === "file" ? (
                  <div className="mt-3">
                    <input type="file" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    {file && <p className="text-xs text-slate-500 mt-2">Terpilih: {file.name}</p>}
                  </div>
                ) : (
                  <div className="mt-3">
                    <input type="url" name="tautan" value={formData.tautan} onChange={handleInputChange} placeholder="https://drive.google.com/..." className="input-field w-full p-3 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-700 text-sm" />
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-extrabold py-3.5 px-6 rounded-md transition-all shadow-md mt-6">
              {isSubmitting ? "Menyimpan & Mengunggah..." : "Simpan Jurnal"}
            </button>
          </form>
    </div>
  );
}
