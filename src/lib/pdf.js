// Helper function to format month
const getMonthName = (monthStr) => {
  const months = {
    "01": "Januari", "02": "Februari", "03": "Maret", "04": "April",
    "05": "Mei", "06": "Juni", "07": "Juli", "08": "Agustus",
    "09": "September", "10": "Oktober", "11": "November", "12": "Desember"
  };
  return months[monthStr] || "Semua Bulan";
};

// ==========================================
// 1. REPORT WFO
// ==========================================
export async function generatePdfWfo(data, filterBulan) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const doc = new jsPDF('p', 'pt', 'a4');
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("LAPORAN PELAKSANAAN KEGIATAN KEHUMASAN", 297, 50, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const labelX = 40, colonX = 140, valueX = 150;

  doc.text("Nama Lengkap", labelX, 90); doc.text(":", colonX, 90); doc.text("Yuyun Wulandari", valueX, 90);
  doc.text("NIP", labelX, 105); doc.text(":", colonX, 105); doc.text("199207012020122008", valueX, 105);
  doc.text("Jabatan", labelX, 120); doc.text(":", colonX, 120); doc.text("Pranata Humas Ahli Pertama", valueX, 120);
  doc.text("Pangkat/Golongan", labelX, 135); doc.text(":", colonX, 135); doc.text("Penata Muda Tk. I/IIIb", valueX, 135);
  doc.text("Unit Kerja", labelX, 150); doc.text(":", colonX, 150); doc.text("Sekretariat Direktorat Jenderal Pendidikan Islam", valueX, 150);

  const namaBulan = getMonthName(filterBulan);
  doc.text("Bulan", labelX, 165); doc.text(":", colonX, 165); doc.text(namaBulan + " 2026", valueX, 165);

  let tableBody = [];
  if (data.length === 0) {
      tableBody.push(["-", "-", "Tidak ada data", "-", "-"]);
  } else {
      let pdfGrouped = [];
      data.forEach(item => {
          let key = item.tanggal + '|' + item.skp;
          let group = pdfGrouped.find(g => g.key === key);
          if (!group) {
              group = { key: key, tanggal: item.tanggal, skp: item.skp, items: [] };
              pdfGrouped.push(group);
          }
          group.items.push(item);
      });

      let no = 1;
      pdfGrouped.forEach(group => {
          let len = group.items.length;
          group.items.forEach((item, index) => {
              let evUrl = item.evidence_url || item.evidence;
              let evidenceObj = {
                  content: (evUrl && evUrl !== '#' && evUrl !== 'Tersimpan di Drive') ? evUrl : '-',
                  styles: (evUrl && evUrl !== '#' && evUrl !== 'Tersimpan di Drive') ? { textColor: [37, 99, 235], halign: 'left' } : { halign: 'center' }
              };

              if (index === 0) {
                  tableBody.push([
                      { rowSpan: len, content: String(no++), styles: { valign: 'middle', halign: 'center' } },
                      { rowSpan: len, content: group.tanggal, styles: { valign: 'middle', halign: 'center' } },
                      { rowSpan: len, content: group.skp, styles: { valign: 'middle' } },
                      item.deskripsi,
                      evidenceObj
                  ]);
              } else {
                  tableBody.push([item.deskripsi, evidenceObj]);
              }
          });
      });
  }

  autoTable(doc, {
      startY: 195,
      margin: { top: 40, right: 40, bottom: 40, left: 40 },
      head: [['No', 'Tanggal', 'Butir Kegiatan SKP', 'Deskripsi / Output', 'Evidence URL']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center', valign: 'middle', lineWidth: 1, lineColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 5, lineColor: [0, 0, 0], lineWidth: 1, textColor: [0, 0, 0] },
      rowPageBreak: 'auto',
      columnStyles: {
          0: { cellWidth: 25, halign: 'center' },
          1: { cellWidth: 55, halign: 'center' },
          2: { cellWidth: 100 },
          4: { cellWidth: 120, halign: 'left' },
      }
  });

  doc.save("Laporan_WFO.pdf");
}

// ==========================================
// 2. REPORT WFA
// ==========================================
export async function generatePdfWfa(data, filterBulan) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const doc = new jsPDF('p', 'pt', 'a4');

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("LAPORAN PELAKSANAAN TUGAS WORK FROM ANYWHERE (WFA)", 297, 50, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const labelX = 40, colonX = 140, valueX = 150;
  doc.text("Nama Lengkap", labelX, 90); doc.text(":", colonX, 90); doc.text("Yuyun Wulandari", valueX, 90);
  doc.text("NIP", labelX, 105); doc.text(":", colonX, 105); doc.text("199207012020122008", valueX, 105);
  doc.text("Jabatan", labelX, 120); doc.text(":", colonX, 120); doc.text("Pranata Humas Ahli Pertama", valueX, 120);
  doc.text("Pangkat/Golongan", labelX, 135); doc.text(":", colonX, 135); doc.text("Penata Muda Tk. I/IIIb", valueX, 135);
  doc.text("Unit Kerja", labelX, 150); doc.text(":", colonX, 150); doc.text("Sekretariat Direktorat Jenderal Pendidikan Islam", valueX, 150);

  const namaBulan = getMonthName(filterBulan);
  doc.text("Bulan", labelX, 165); doc.text(":", colonX, 165); doc.text(namaBulan + " 2026", valueX, 165);

  let pdfGroupedWfa = [];
  data.forEach(item => {
      let dateGroup = pdfGroupedWfa.find(g => g.tanggal === item.tanggal);
      if (!dateGroup) {
          dateGroup = {
              tanggal: item.tanggal,
              jam_masuk: item.jam_masuk,
              jam_pulang: item.jam_pulang,
              skpGroups: [],
              totalItems: 0
          };
          pdfGroupedWfa.push(dateGroup);
      }
      let skpGroup = dateGroup.skpGroups.find(s => s.skp === item.skp);
      if (!skpGroup) {
          skpGroup = { skp: item.skp, items: [] };
          dateGroup.skpGroups.push(skpGroup);
      }
      skpGroup.items.push(item);
      dateGroup.totalItems++;
  });

  let tableBody = [];
  let no = 1;
  pdfGroupedWfa.forEach(dateGroup => {
      let isFirstDate = true;
      let dateRowSpan = dateGroup.totalItems;

      dateGroup.skpGroups.forEach(skpGroup => {
          let isFirstSkp = true;
          let skpRowSpan = skpGroup.items.length;

          skpGroup.items.forEach(item => {
              let evUrl = item.evidence_url || item.evidence;
              let evidenceObj = {
                  content: (evUrl && evUrl !== '#' && evUrl !== 'Tersimpan di Drive') ? evUrl : '-',
                  styles: (evUrl && evUrl !== '#' && evUrl !== 'Tersimpan di Drive') ? { textColor: [37, 99, 235], halign: 'left' } : { halign: 'center' }
              };

              let row = [];
              if (isFirstDate) {
                  row.push({ rowSpan: dateRowSpan, content: String(no++), styles: { valign: 'middle', halign: 'center' } });
                  row.push({ rowSpan: dateRowSpan, content: dateGroup.tanggal, styles: { valign: 'middle', halign: 'center' } });
                  row.push({ rowSpan: dateRowSpan, content: dateGroup.jam_masuk || "-", styles: { valign: 'middle', halign: 'center' } });
                  row.push({ rowSpan: dateRowSpan, content: dateGroup.jam_pulang || "-", styles: { valign: 'middle', halign: 'center' } });
                  isFirstDate = false;
              }
              if (isFirstSkp) {
                  row.push({ rowSpan: skpRowSpan, content: item.skp, styles: { valign: 'middle' } });
                  isFirstSkp = false;
              }
              row.push(item.deskripsi);
              row.push(evidenceObj);
              tableBody.push(row);
          });
      });
  });

  autoTable(doc, {
      startY: 195,
      margin: { top: 40, right: 40, bottom: 40, left: 40 },
      head: [['No', 'Tanggal', 'Masuk', 'Pulang', 'Hasil Kerja', 'Realisasi', 'Evidence URL']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center', valign: 'middle', lineWidth: 1, lineColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 5, minCellHeight: 20, lineColor: [0, 0, 0], lineWidth: 1, textColor: [0, 0, 0] },
      rowPageBreak: 'auto',
      columnStyles: {
          0: { cellWidth: 25, halign: 'center' },
          1: { cellWidth: 55, halign: 'center' },
          2: { cellWidth: 40, halign: 'center' },
          3: { cellWidth: 40, halign: 'center' },
          6: { cellWidth: 120, halign: 'left' }
      }
  });

  // Tanda Tangan
  let finalY = doc.lastAutoTable.finalY + 40;
  if (finalY + 115 > doc.internal.pageSize.getHeight()) {
      doc.addPage();
      finalY = 50;
  }
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const leftX = 40, rightX = 380;
  doc.text("Pegawai Yang Dinilai,", leftX, finalY);
  doc.text("Yuyun Wulandari, S.Pd.I", leftX, finalY + 85);
  doc.text("NIP. 199207012020122008", leftX, finalY + 100);

  doc.text("Mengetahui,", rightX, finalY - 15);
  doc.text("Pejabat Penilai Kerja", rightX, finalY);
  doc.text("M. Arskal Salim GP", rightX, finalY + 85);
  doc.text("NIP. 19700901199603", rightX, finalY + 100);

  doc.save("Laporan_WFA.pdf");
}

// ==========================================
// 3. REPORT OVERVIEW
// ==========================================
export async function generatePdfOverview(data, filterBulan) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const doc = new jsPDF('p', 'pt', 'a4');
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("LAPORAN PELAKSANAAN TUGAS", 297, 50, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const labelX = 40, colonX = 140, valueX = 150;
  doc.text("Nama Lengkap", labelX, 90); doc.text(":", colonX, 90); doc.text("Yuyun Wulandari", valueX, 90);
  doc.text("NIP", labelX, 105); doc.text(":", colonX, 105); doc.text("199207012020122008", valueX, 105);
  doc.text("Jabatan", labelX, 120); doc.text(":", colonX, 120); doc.text("Pranata Humas Ahli Pertama", valueX, 120);
  doc.text("Pangkat/Golongan", labelX, 135); doc.text(":", colonX, 135); doc.text("Penata Muda Tk. I/IIIb", valueX, 135);
  doc.text("Unit Kerja", labelX, 150); doc.text(":", colonX, 150); doc.text("Sekretariat Direktorat Jenderal Pendidikan Islam", valueX, 150);
  
  const namaBulan = getMonthName(filterBulan);
  doc.text("Bulan", labelX, 165); doc.text(":", colonX, 165); doc.text(namaBulan + " 2026", valueX, 165);

  let pdfGrouped = [];
  data.forEach(item => {
      let key = item.tanggal + '|' + item.skp + '|' + (item.tipeKerja || 'WFO');
      let group = pdfGrouped.find(g => g.key === key);
      if (!group) {
          group = { key: key, tanggal: item.tanggal, skp: item.skp, tipe: item.tipeKerja || 'WFO', items: [] };
          pdfGrouped.push(group);
      }
      group.items.push(item);
  });

  let tableData = [];
  let no = 1;
  pdfGrouped.forEach(group => {
      let len = group.items.length;
      group.items.forEach((item, index) => {
          let evUrl = item.evidence_url || item.evidence;
          let evidenceObj = {
              content: (evUrl && evUrl !== '#' && evUrl !== 'Tersimpan di Drive') ? evUrl : '-',
              styles: (evUrl && evUrl !== '#' && evUrl !== 'Tersimpan di Drive') ? { textColor: [37, 99, 235], halign: 'left' } : { halign: 'center' }
          };
          
          if (index === 0) {
              tableData.push([
                  { rowSpan: len, content: String(no++), styles: { valign: 'middle', halign: 'center' } },
                  { rowSpan: len, content: group.tanggal, styles: { valign: 'middle', halign: 'center' } },
                  { rowSpan: len, content: group.tipe, styles: { valign: 'middle', halign: 'center' } },
                  { rowSpan: len, content: group.skp, styles: { valign: 'middle' } },
                  item.deskripsi,
                  evidenceObj
              ]);
          } else {
              tableData.push([item.deskripsi, evidenceObj]);
          }
      });
  });

  autoTable(doc, {
      startY: 195,
      margin: { top: 40, right: 40, bottom: 40, left: 40 },
      head: [['No', 'Tanggal', 'Tipe', 'Butir SKP', 'Deskripsi / Output', 'Evidence URL']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center', valign: 'middle', lineWidth: 1, lineColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 5, lineColor: [0, 0, 0], lineWidth: 1, textColor: [0, 0, 0] },
      rowPageBreak: 'auto',
      columnStyles: {
          0: { cellWidth: 20, halign: 'center' },
          1: { cellWidth: 55, halign: 'center' },
          2: { cellWidth: 35, halign: 'center' },
          3: { cellWidth: 100 },
          5: { cellWidth: 120, halign: 'left' }
      }
  });

  doc.save("Laporan_Overview.pdf");
}
