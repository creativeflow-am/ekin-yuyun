# Google Apps Script (Kode.gs)

Berikut adalah kode backend Google Apps Script yang digunakan untuk aplikasi E-Kinerja Anda (bersih tanpa komentar).

```javascript
const SPREADSHEET_ID = "1_lTJjQ9ZNprbPH-M08b3Ejr9QQRT0xaFVGdF6tHgkGE"; 
const FOLDER_ID = "1cxw1Wg-_sCryWaTa7Lk0BYe2kf5A7OZl";

function doGet(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    var action = e.parameter.action;
    
    if (action === 'getSKP') {
      var skpData = getMasterSKP();
      output.setContent(JSON.stringify(skpData));
      return output;
    } 
    else if (action === 'getHistory') {
      var filterBulan = e.parameter.bulan || 'Semua';
      var filterSkp = e.parameter.skp || 'Semua';
      
      var historyData = ambilRiwayatHarian(filterBulan, filterSkp);
      output.setContent(JSON.stringify(historyData));
      return output;
    }
    
    output.setContent(JSON.stringify({error: "Invalid action"}));
    return output;
  } catch (err) {
    output.setContent(JSON.stringify({error: err.toString()}));
    return output;
  }
}

function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    if (!e.postData || !e.postData.contents) {
      throw new Error("Payload body is missing or empty.");
    }
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    
    if (action === 'save') {
      var result = simpanDataBanyak(data.tasks);
      output.setContent(JSON.stringify({status: 'success', message: result}));
      return output;
    } 
    else if (action === 'delete') {
      var result = hapusData(data.id);
      if (result) {
        output.setContent(JSON.stringify({status: 'success', message: "Data berhasil dihapus"}));
      } else {
        output.setContent(JSON.stringify({status: 'error', message: "Data tidak ditemukan"}));
      }
      return output;
    }
    
    output.setContent(JSON.stringify({status: 'error', message: "Invalid action"}));
    return output;
    
  } catch (err) {
    output.setContent(JSON.stringify({status: 'error', message: err.toString()}));
    return output;
  }
}

function getMasterSKP() {
  if (!SPREADSHEET_ID) throw new Error("ID Spreadsheet belum dikonfigurasi.");

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName('Master_SKP');
  
  if (!sheet) {
    sheet = ss.insertSheet('Master_SKP');
    sheet.getRange('A1').setValue('Butir SKP').setFontWeight('bold');
    
    const defaultSKP = [
      ["Analisis data informasi media & masyarakat"],
      ["Rancangan konferensi pers/seminar/rapat humas"],
      ["Pengumpulan isu publik"],
      ["Pengolahan konten media"],
      ["Penyusunan berita media daring"],
      ["Penyusunan naskah pidato"],
      ["Penulisan latar fakta (Factsheet)"],
      ["Pelaksanaan peliputan lembaga"],
      ["Siaran melalui media internal"],
      ["Peningkatan Kapasitas Kehumasan"]
    ];
    sheet.getRange(2, 1, defaultSKP.length, 1).setValues(defaultSKP);
  }

  getOrCreateDataHarian(ss);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return []; 
  
  const data = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  return data.map(row => row[0]).filter(item => item !== "");
}

function getOrCreateDataHarian(ss) {
  let sheet = ss.getSheetByName('Data_Harian');
  if (!sheet) {
    sheet = ss.insertSheet('Data_Harian');
    const headers = ['ID', 'Tanggal', 'Triwulan', 'SKP', 'Deskripsi', 'Kuantitas', 'Tipe Evidence', 'Evidence URL', 'Tipe Kerja', 'Jam Masuk', 'Jam Pulang'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function hitungTriwulan(tanggalStr) {
  let bulan = 1;
  let parts = tanggalStr.split('-');
  if (parts.length === 3) {
    if (parts[0].length === 4) { 
      bulan = parseInt(parts[1], 10);
    } else { 
      bulan = parseInt(parts[1], 10);
    }
  }
  const triwulan = Math.ceil(bulan / 3);
  return `Triwulan ${triwulan}`;
}

function simpanDataBanyak(tasks) {
  try {
    if (!SPREADSHEET_ID || !FOLDER_ID) throw new Error("ID belum dikonfigurasi.");

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateDataHarian(ss);
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const rowsToInsert = [];
    
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      let evidenceUrl = task.evidence;
      
      if (task.type === 'file' && task.fileData && task.fileName) {
        const mimeType = task.fileMimeType || "application/octet-stream";
        let base64Data = task.fileData;
        if (base64Data.indexOf(',') !== -1) {
          base64Data = base64Data.split(',')[1];
        }
        
        const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, task.fileName);
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        evidenceUrl = file.getUrl();
      }
      
      const triwulan = hitungTriwulan(task.tanggal);
      const timestamp = new Date().getTime().toString().slice(-5);
      const uniqueId = `HK-${task.tanggal.replace(/-/g, '')}-${timestamp}-${i}`;
      
      rowsToInsert.push([
        uniqueId,
        task.tanggal,
        triwulan,
        task.skp,
        task.deskripsi,
        task.kuantitas,
        task.type === 'file' ? 'Dokumen' : 'Tautan',
        evidenceUrl,
        task.tipeKerja || 'WFO',
        task.jamMasuk || '',
        task.jamPulang || ''
      ]);
    }
    
    if (rowsToInsert.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, rowsToInsert.length, rowsToInsert[0].length).setValues(rowsToInsert);
    }
    
    return "Data berhasil disimpan & disinkronkan!";
  } catch (error) {
    throw new Error(error.toString());
  }
}

function ambilRiwayatHarian(filterBulan, filterSkp) {
  if (!SPREADSHEET_ID) throw new Error("ID Spreadsheet belum dikonfigurasi.");

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = getOrCreateDataHarian(ss);
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return []; 
  
  const data = sheet.getRange(2, 1, lastRow - 1, 11).getValues();
  let result = [];
  
  for(let i=0; i<data.length; i++) {
    let row = data[i];
    let tanggalStr = row[1];
    if (tanggalStr instanceof Date) {
      const y = tanggalStr.getFullYear();
      const m = String(tanggalStr.getMonth() + 1).padStart(2, '0');
      const d = String(tanggalStr.getDate()).padStart(2, '0');
      tanggalStr = `${y}-${m}-${d}`;
    }

    if (filterBulan && filterBulan !== 'Semua') {
      const b = tanggalStr.split('-')[1];
      if (b !== filterBulan) continue;
    }
    if (filterSkp && filterSkp !== 'Semua') {
      if (row[3] !== filterSkp) continue;
    }

    result.push({
      id: row[0],
      tanggal: tanggalStr,
      triwulan: row[2],
      skp: row[3],
      deskripsi: row[4],
      kuantitas: row[5],
      tipe_evidence: row[6],
      evidence_url: row[7],
      tipe_kerja: row[8] || 'WFO',
      jam_masuk: (row[9] instanceof Date) ? Utilities.formatDate(row[9], ss.getSpreadsheetTimeZone(), "HH:mm") : (row[9] ? String(row[9]).substring(0,5) : ''),
      jam_pulang: (row[10] instanceof Date) ? Utilities.formatDate(row[10], ss.getSpreadsheetTimeZone(), "HH:mm") : (row[10] ? String(row[10]).substring(0,5) : '')
    });
  }
  
  return result.reverse();
}

function hapusData(id) {
  try {
    if (!SPREADSHEET_ID) throw new Error("ID Spreadsheet belum dikonfigurasi.");
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateDataHarian(ss);
    
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return false;
    
    const data = sheet.getRange(2, 1, lastRow - 1, 1).getValues(); 
    
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === id) {
        sheet.deleteRow(i + 2);
        return true;
      }
    }
    return false;
  } catch (e) {
    throw new Error(e.toString());
  }
}
```
