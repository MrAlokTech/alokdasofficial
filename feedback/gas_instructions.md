# Google Sheets & Google Apps Script (GAS) Setup Guide

This guide explains how to connect your portfolio's new **Feedback & Survey Screen** directly to a **Google Sheet** using **Google Apps Script** to dynamically serve released apps, pull upcoming prototype ideas (with icon images & live links), and record submissions!

---

## 🛠️ Step-by-Step Setup

### Step 1: Set Up Your Google Sheet workbook

Your Google Sheet workbook will contain **three separate tabs**:

#### Tab 1: `Sheet1` (Feedback Submissions)
This is where user submissions are logged. Ensure columns **A to K** in the first sheet tab are named exactly as follows:
- Column A: `Timestamp`
- Column B: `Form Type`
- Column C: `Selected App`
- Column D: `Rating`
- Column E: `Loved Features`
- Column F: `App Improvements`
- Column G: `New Ideas Interest`
- Column H: `New Idea Suggestions`
- Column I: `Name`
- Column J: `Email`
- Column K: `Role`

#### Tab 2: `Ideas` (Dynamic Prototype Ideas)
1. Add a new sheet tab and rename it exactly to **`Ideas`**.
2. In Row 1, set up columns **A to F** exactly as follows:
   - Column A: `ID` (e.g., `tickly`, `classnotes`, `lab_assistant`)
   - Column B: `Icon` (An emoji fallback icon, e.g., `📋`, `📂`, `🔬` — used if Image is blank)
   - Column C: `Title` (e.g., `Tickly — Minimal ToDo`)
   - Column D: `Description` (A short overview of the idea)
   - Column E: `Image` (Google Drive image link or public icon image URL)
   - Column F: `Link` (Live prototype or detail URL, if any)
3. Add some sample rows in rows 2, 3, etc., to populate your prototype voting room!

#### Tab 3: `Apps` (Dynamic Published Apps dropdown)
1. Add a third sheet tab and rename it exactly to **`Apps`**.
2. In Row 1, set up columns **A to D** exactly as follows:
   - Column A: `ID` (e.g., `alomole`, `mileage`, `portfolio`)
   - Column B: `Title` (e.g., `Alomole — Chemistry Companion ⚗️`)
   - Column C: `Image` (Google Drive image link or public icon image URL)
   - Column D: `Link` (The live link of the published app, e.g., `https://alomolecule.web.app`)
3. Add your published apps in rows 2, 3, etc. This dynamically populates your dropdown and shows a beautiful Preview Card!

---

### Step 2: Open Google Apps Script
1. In the Google Sheets menu, click on **Extensions** → **Apps Script**.
2. Delete any existing code in your editor.

---

### Step 3: Paste the Apps Script Template
Copy the entire block of code below and paste it into your Apps Script editor:

```javascript
/**
 * Alok Das Portfolio Site Feedback & Dynamic Content Processor
 * Routes submissions from the /feedback page straight into Google Sheets,
 * and dynamically serves apps and prototype ideas from their respective tabs.
 */

/**
 * 1. Handles GET requests (Serves Dynamic Apps & Ideas data)
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // --- Fetch Dynamic Ideas ---
    var ideas = [];
    var ideasSheet = ss.getSheetByName("Ideas");
    if (ideasSheet) {
      var ideasData = ideasSheet.getDataRange().getValues();
      if (ideasData.length > 1) {
        var headers = ideasData[0];
        for (var i = 1; i < ideasData.length; i++) {
          var row = ideasData[i];
          var idea = {};
          var isEmptyRow = true;
          for (var j = 0; j < headers.length; j++) {
            var headerName = headers[j].toString().trim().toLowerCase();
            if (headerName) {
              var val = row[j];
              idea[headerName] = val;
              if (val.toString().trim() !== "") {
                isEmptyRow = false;
              }
            }
          }
          if (!isEmptyRow) ideas.push(idea);
        }
      }
    }
    
    // --- Fetch Released Apps ---
    var apps = [];
    var appsSheet = ss.getSheetByName("Apps");
    if (appsSheet) {
      var appsData = appsSheet.getDataRange().getValues();
      if (appsData.length > 1) {
        var headers = appsData[0];
        for (var i = 1; i < appsData.length; i++) {
          var row = appsData[i];
          var app = {};
          var isEmptyRow = true;
          for (var j = 0; j < headers.length; j++) {
            var headerName = headers[j].toString().trim().toLowerCase();
            if (headerName) {
              var val = row[j];
              app[headerName] = val;
              if (val.toString().trim() !== "") {
                isEmptyRow = false;
              }
            }
          }
          if (!isEmptyRow) apps.push(app);
        }
      }
    }
    
    // Return standard JSON response with CORS compatibility
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      ideas: ideas,
      apps: apps
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 2. Handles POST requests (Receives User Feedback Submissions)
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0]; // logs feedback rows into the first sheet in workbook
    
    // Parse the incoming POST data (supports JSON payloads)
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    // Extract variables with fallbacks
    var timestamp          = new Date();
    var formType           = data.formType || "";
    var selectedApp        = data.selectedApp || "";
    var rating             = data.rating || "";
    var lovedFeatures      = data.lovedFeatures || "";
    var appImprovements    = data.appImprovements || "";
    var newIdeasInterest   = data.newIdeasInterest || ""; // interest levels formatted as JSON or string
    var newIdeaSuggestions = data.newIdeaSuggestions || "";
    var name               = data.name || "";
    var email              = data.email || "";
    var role               = data.role || "";
    
    // Append the feedback row matching columns A to K
    sheet.appendRow([
      timestamp,
      formType,
      selectedApp,
      rating,
      lovedFeatures,
      appImprovements,
      newIdeasInterest,
      newIdeaSuggestions,
      name,
      email,
      role
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Heroic feedback recorded successfully!"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 3. Handles CORS Preflight Requests
 */
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

---

### Step 4: Deploy your Script updates
> [!IMPORTANT]
> Because you are updating an existing script, you must deploy a **new version** for the changes to take effect!
> 1. In the upper-right corner of Apps Script, click **Deploy** → **Manage deployments**.
> 2. Click the **pencil icon (Edit)** at the top.
> 3. Under **Version**, click the dropdown and choose **"New version"**.
> 4. Ensure "Execute as" remains set to **Me** and "Who has access" is set to **Anyone**.
> 5. Click **Deploy**.
> 6. Copy the Web app URL (it will remain the same, but Google Sheets will now execute your fresh multi-tab code!).
> 7. Paste this URL into `FEEDBACK_GAS_URL` in [js/config.js](file:///a:/Web/alokdasofficial/js/config.js).

**BAM! ⚡ Your Google Sheet now acts as a fully dynamic database serving apps, loading prototype assets, and receiving submissions!**
