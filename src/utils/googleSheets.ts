import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export async function getGoogleSheets() {
  try {
    const SCOPES = [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ];

    const jwt = new JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: SCOPES,
    });

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID!, jwt);
    await doc.loadInfo();
    return doc;
  } catch (error) {
    console.error("Error al conectar con Google Sheets:", error);
    throw error;
  }
}
