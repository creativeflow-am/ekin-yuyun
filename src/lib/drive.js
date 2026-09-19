const DRIVE_API_URL = "https://script.google.com/macros/s/AKfycby0V0loJ06trXsOJsuix7b_W-EhJQnMrRfajpw1OSulQQQ0QTA9E-Qv7MCpRUxo8bhy-w/exec";

/**
 * Uploads a base64 encoded file to Google Drive via Apps Script Web App
 * @param {string} base64Data - The base64 string of the file
 * @param {string} fileName - The name of the file
 * @param {string} mimeType - The mime type of the file
 * @returns {Promise<string>} The URL of the uploaded file
 */
export async function uploadToGoogleDrive(base64Data, fileName, mimeType) {
  try {
    // Menghapus prefix "data:image/png;base64," dsb jika ada
    const base64Clean = base64Data.split(',')[1] || base64Data;
    
    const payload = {
      fileBase64: base64Clean,
      fileName: fileName,
      mimeType: mimeType
    };

    const response = await fetch(DRIVE_API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      }
    });

    // Check if the response is HTML (Google Login Page because of wrong deployment access)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      const text = await response.text();
      throw new Error("CORS_HTML_ERROR: Apps Script meminta login. Pastikan deploy Web App diset 'Who has access: Anyone'.");
    }

    const result = await response.json();
    
    if (result.status === "success") {
      return result.url;
    } else {
      throw new Error("GAS_ERROR: " + (result.message || "Gagal mengunggah file ke Google Drive."));
    }
  } catch (error) {
    console.error("Upload error:", error);
    if (error.name === 'SyntaxError') {
      throw new Error("Pastikan URL Apps Script benar dan di-deploy dengan akses 'Anyone'.");
    }
    throw error;
  }
}
