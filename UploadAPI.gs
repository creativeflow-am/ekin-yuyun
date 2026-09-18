// =========================================================================
// SCRIPT UPLOAD FILE KE GOOGLE DRIVE (API)
// =========================================================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var base64Data = data.fileBase64;
    var fileName = data.fileName;
    var mimeType = data.mimeType;
    var folderId = "1cxw1Wg-_sCryWaTa7Lk0BYe2kf5A7OZl"; // Folder khusus e-Kinerja Anda
    
    // Konversi base64 kembali ke blob
    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, mimeType, fileName);
    
    var folder = null;
    if (folderId && folderId !== "YOUR_FOLDER_ID_HERE") {
      folder = DriveApp.getFolderById(folderId);
    } else {
      folder = DriveApp.getRootFolder();
    }
    
    // Simpan file ke Drive
    var file = folder.createFile(blob);
    
    // Ubah hak akses agar siapa saja yang punya link bisa melihat (Viewer)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Ambil URL link
    var fileUrl = file.getUrl();
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      url: fileUrl,
      fileName: fileName
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Fitur pre-flight (CORS) untuk Web API
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
