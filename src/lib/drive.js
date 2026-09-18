const DRIVE_API_URL = "https://script.google.com/macros/s/AKfycbzGNOLdkP_S3mXTMuH6SjpSvqC6eoj3K5el9IVOZI5_ep8CRaSS5WCABLUyxgxJXCi0RQ/exec";

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
      // Set mode to no-cors or standard depending on GAS setup. 
      // Usually standard JSON POST requires text/plain for GAS to avoid CORS preflight issues.
      headers: {
        "Content-Type": "text/plain"
      }
    });

    const result = await response.json();
    
    if (result.status === "success") {
      return result.url;
    } else {
      throw new Error(result.message || "Gagal mengunggah file ke Google Drive.");
    }
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
