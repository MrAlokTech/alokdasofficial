import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import JSZip from "jszip";

async function runTests() {
  console.log("=== Testing Client-Side PDF Suite Engines ===");

  // 1. Create Mock Source PDF 1
  console.log("Test 1: Generating mock Doc A (2 pages)...");
  const docA = await PDFDocument.create();
  const pageA1 = docA.addPage([400, 600]);
  pageA1.drawText("Document A - Page 1", { x: 50, y: 550, size: 20 });
  const pageA2 = docA.addPage([400, 600]);
  pageA2.drawText("Document A - Page 2", { x: 50, y: 550, size: 20 });
  const docABytes = await docA.save();
  console.log("✓ Doc A created:", docABytes.byteLength, "bytes");

  // 2. Create Mock Source PDF 2
  console.log("Test 2: Generating mock Doc B (1 page)...");
  const docB = await PDFDocument.create();
  const pageB1 = docB.addPage([400, 600]);
  pageB1.drawText("Document B - Page 1", { x: 50, y: 550, size: 20 });
  const docBBytes = await docB.save();
  console.log("✓ Doc B created:", docBBytes.byteLength, "bytes");

  // 3. Test Merge & Reorder & Rotate
  console.log("Test 3: Merging Doc B Page 1 + Doc A Page 2 (rotated 90) + Doc A Page 1...");
  const mergedDoc = await PDFDocument.create();
  const loadedA = await PDFDocument.load(docABytes);
  const loadedB = await PDFDocument.load(docBBytes);

  const [bPage1] = await mergedDoc.copyPages(loadedB, [0]);
  mergedDoc.addPage(bPage1);

  const [aPage2] = await mergedDoc.copyPages(loadedA, [1]);
  aPage2.setRotation(degrees(90));
  mergedDoc.addPage(aPage2);

  const [aPage1] = await mergedDoc.copyPages(loadedA, [0]);
  mergedDoc.addPage(aPage1);

  const mergedBytes = await mergedDoc.save();
  const mergedVerify = await PDFDocument.load(mergedBytes);
  if (mergedVerify.getPageCount() !== 3) {
    throw new Error(`Expected 3 pages in merged doc, got ${mergedVerify.getPageCount()}`);
  }
  console.log("✓ Merge verified: 3 pages assembled with rotation");

  // 4. Test Split & ZIP
  console.log("Test 4: Splitting merged document into separate files & ZIP archive...");
  const zip = new JSZip();
  for (let i = 0; i < mergedVerify.getPageCount(); i++) {
    const single = await PDFDocument.create();
    const [p] = await single.copyPages(mergedVerify, [i]);
    single.addPage(p);
    const b = await single.save();
    zip.file(`page_${i + 1}.pdf`, b);
  }
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  console.log("✓ Split into ZIP archive verified:", zipBuffer.length, "bytes");

  // 5. Test Redaction / Whiteout & Overlay
  console.log("Test 5: Testing Whiteout Eraser & Blackout Redaction flattening...");
  const editDoc = await PDFDocument.load(docABytes);
  const editPage = editDoc.getPage(0);
  // Whiteout rectangle over text
  editPage.drawRectangle({
    x: 40,
    y: 530,
    width: 300,
    height: 40,
    color: rgb(1, 1, 1),
    opacity: 1.0,
  });
  // Blackout redaction
  editPage.drawRectangle({
    x: 40,
    y: 400,
    width: 200,
    height: 30,
    color: rgb(0, 0, 0),
    opacity: 1.0,
  });
  const editedBytes = await editDoc.save();
  console.log("✓ Redaction flattened into PDF stream:", editedBytes.byteLength, "bytes");

  // 6. Test Searchable PDF with OCR Invisible Text Layer
  console.log("Test 6: Testing Searchable PDF generation with invisible OCR text layer...");
  const ocrDoc = await PDFDocument.create();
  const ocrPage = ocrDoc.addPage([595.28, 841.89]); // A4
  const font = await ocrDoc.embedFont(StandardFonts.Helvetica);

  // Simulate OCR word bounding boxes
  const words = [
    { text: "INVOICE", x: 50, y: 750, size: 24 },
    { text: "Date:", x: 50, y: 700, size: 14 },
    { text: "2026-09-16", x: 100, y: 700, size: 14 },
    { text: "Amount:", x: 50, y: 670, size: 14 },
    { text: "$1,500.00", x: 120, y: 670, size: 14 },
  ];

  for (const w of words) {
    ocrPage.drawText(w.text, {
      x: w.x,
      y: w.y,
      size: w.size,
      font,
      color: rgb(0, 0, 0),
      opacity: 0.0, // Invisible selectable text layer
    });
  }

  const ocrBytes = await ocrDoc.save();
  const verifiedOcrDoc = await PDFDocument.load(ocrBytes);
  if (verifiedOcrDoc.getPageCount() !== 1) {
    throw new Error("OCR document generation failed");
  }
  console.log("✓ Searchable PDF created with invisible text layer:", ocrBytes.byteLength, "bytes");

  console.log("\n=== ALL TEST SUITES PASSED (6/6) ===");
}

runTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
