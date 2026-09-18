🗺️ Implementation Plan: Sistem Mandiri e-Kinerja Humas
🏗️ Fase 1: Desain & Persiapan Basis Data (Selesai)
Fokus pada fase ini adalah menyiapkan fondasi penyimpanan data agar rapi dan konsisten.

Langkah 1.1: Membuat Google Sheets utama bernama Database_eKinerja.

Langkah 1.2: Membuat Tab Master_SKP dan mengunci 10 Butir Kegiatan SKP Kehumasan (dari Analisis Data Media hingga Peningkatan Kapasitas).

Langkah 1.3: Membuat Tab Data_Harian sebagai ledger (buku besar) penyimpanan data harian dengan 7 kolom terstandarisasi.

Langkah 1.4: Membuat Folder Khusus di Google Drive untuk holding area file evidence.

📥 Fase 2: Pengembangan Modul Input & Otomatisasi (Selesai)
Fokus pada fase ini adalah membangun mesin pengisi data otomatis tanpa perantara pihak ketiga.

Langkah 2.1: Menulis fungsi doGet() di Kode.gs untuk menyajikan web (HTML-serving).

Langkah 2.2: Membuat fungsi penarik data dinamis untuk mengonversi 10 baris SKP di Sheets menjadi menu dropdown di web.

Langkah 2.3: Membangun file processor berbasis Base64 untuk menangkap file dari form, mengunggahnya ke Drive, mengubah hak akses menjadi Public (View Only), dan mencatat URL-nya.

Langkah 2.4: Menanamkan logika pembagi waktu otomatis (Matematika Bulan ÷ 3 dengan pembulatan ke atas) untuk menentukan label Triwulan 1, 2, 3, atau 4 secara real-time saat tombol simpan diklik.

🔍 Fase 3: Pengujian Arus Data Form (Tahap Saat Ini)
Memastikan pipa saluran data dari Frontend Web menuju Backend Google Drive & Sheets tidak bocor.

Langkah 3.1: Melakukan Deployment awal sebagai Aplikasi Web (Web App) dengan akses Anyone.

Langkah 3.2: Melakukan uji coba penginputan data tiruan (dummy) untuk memastikan:

Apakah 10 butir SKP muncul dengan sempurna di dropdown?

Apakah file terunggah dengan benar ke folder Drive?

Apakah kolom Triwulan terisi otomatis dengan benar di Sheets?

🖥️ Fase 4: Modul Manajemen Data (Riwayat, Edit, & Hapus)
Sebelum melompat ke PDF, kita butuh halaman kendali agar Anda bisa melihat apa saja yang sudah diinput, serta membetulkan data jika ada salah ketik harian.

Langkah 4.1: Membuat fungsi ambilRiwayatHarian() di backend untuk menarik seluruh data dari Tab Data_Harian.

Langkah 4.2: Membuat tab/halaman baru di Frontend (di bawah Form Input) berupa tabel riwayat kegiatan.

Langkah 4.3: Menambahkan fitur Hapus Data berbasis ID unik (HK-...) menggunakan fungsi .deleteRow() di Apps Script.

Langkah 4.4: Menambahkan fitur Edit Data (menampilkan kembali data lama ke form untuk diperbarui lalu disimpan ulang).

🖨️ Fase 5: Modul Filter & Generasi Dokumen Cetak PDF (Fase Akhir)
Tujuan utama Anda: menghasilkan laporan triwulanan yang bersih, rapi, dan siap cetak dalam satu klik.

Langkah 5.1: Membuat halaman khusus bernama "Cetak Laporan Triwulan" di aplikasi web.

Langkah 5.2: Membuat filter interaktif (Tombol/Dropdown: Triwulan 1, Triwulan 2, dst.). Ketika diklik, web hanya akan menampilkan data kegiatan pada triwulan tersebut.

Langkah 5.3: Mendesain tabel laporan agar mengikuti format standar BKN, di mana kolom Evidence otomatis berubah menjadi teks tautan aktif yang rapi (misal: [Buka Bukti Dukung]).

Langkah 5.4: Mengintegrasikan library html2pdf.js atau mengoptimasi CSS @media print + perintah window.print() agar ketika tombol "Print to PDF" diklik, semua tombol navigasi web menghilang, menyisakan dokumen laporan resmi yang siap disimpan sebagai PDF.