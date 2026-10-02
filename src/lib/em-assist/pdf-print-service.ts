/**
 * EM Assist PDF Print & Export Service
 * Produces vector-quality printable PDFs matching the Flutter/Dart QrPrintScreen:
 * 1. Double-Sided Responder Card (CR80 standard: Front & Back)
 * 2. Keychain Tag (50mm x 50mm square with red border)
 * 3. Plain QR (60mm x 60mm sticker with quiet zone)
 * 4. All-In-One Emergency Kit (Multi-page PDF or printable A4 sheet)
 */

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont, PDFImage } from "pdf-lib";
import QRCode from "qrcode";
import { EmProfile } from "@/types/em-assist";

export type CardTemplateType = "allInOne" | "infoCard" | "keychainTag" | "plainQr" | "a4Sheet";

// Conversion: 1 mm = 72 / 25.4 pt (~2.834645 pt)
const MM_TO_PT = 72 / 25.4;

// Standard CR80 Card: 85.6 mm x 53.98 mm (~242.65 pt x 153.01 pt)
const CR80_WIDTH = 85.6 * MM_TO_PT;
const CR80_HEIGHT = 53.98 * MM_TO_PT;

// Keychain Tag: 50 mm x 50 mm (~141.73 pt x 141.73 pt)
const KEYCHAIN_SIZE = 50 * MM_TO_PT;

// Plain QR: 60 mm x 60 mm (~170.08 pt x 170.08 pt)
const PLAIN_QR_SIZE = 60 * MM_TO_PT;

// ISO A4: 210 mm x 297 mm (595.28 pt x 841.89 pt)
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

// Brand Colors matching Flutter QrPrintScreen
const CARD_RED = rgb(232 / 255, 59 / 255, 59 / 255); // #E83B3B
const DARK_HEADER = rgb(28 / 255, 28 / 255, 28 / 255); // #1C1C1C
const COLOR_WHITE = rgb(1, 1, 1);
const COLOR_BLACK = rgb(0, 0, 0);
const COLOR_GREY_300 = rgb(0.82, 0.82, 0.82);
const COLOR_GREY_400 = rgb(0.70, 0.70, 0.70);
const COLOR_GREY_600 = rgb(0.45, 0.45, 0.45);
const COLOR_GREY_700 = rgb(0.35, 0.35, 0.35);
const COLOR_GREY_800 = rgb(0.20, 0.20, 0.20);

/**
 * Generates high-resolution QR PNG data URL with an embedded center circular badge & EM Assist cross logo.
 */
export async function generateQrWithLogoDataUrl(payloadUrl: string): Promise<string> {
  // Generate base QR code with High error correction (up to 30% damage tolerance)
  const qrDataUrl = await QRCode.toDataURL(payloadUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 800,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });

  // If not running in browser (e.g. server-side compilation), return raw QR
  if (typeof window === "undefined" || typeof document === "undefined") {
    return qrDataUrl;
  }

  return new Promise((resolve) => {
    const qrImage = new Image();
    qrImage.crossOrigin = "anonymous";
    qrImage.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = qrImage.width || 800;
      canvas.height = qrImage.height || 800;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(qrDataUrl);
        return;
      }

      // 1. Draw QR code
      ctx.drawImage(qrImage, 0, 0, canvas.width, canvas.height);

      // 2. Center circular badge
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = canvas.width * 0.11; // ~88px radius (22% diameter)

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#E83B3B";
      ctx.stroke();

      // 3. Draw EM Assist Heart Pulse Logo in center badge
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.onload = () => {
        const logoSize = radius * 1.45;
        // Clip to circle so the black background of the logo looks neat inside the badge
        ctx.beginPath();
        ctx.arc(cx, cy, radius - 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logoImg, cx - logoSize / 2, cy - logoSize / 2, logoSize, logoSize);
        ctx.restore();
        resolve(canvas.toDataURL("image/png"));
      };
      logoImg.onerror = () => {
        // Fallback: Draw red medical cross
        const crossSize = radius * 1.05;
        const barThickness = crossSize * 0.34;
        ctx.fillStyle = "#E83B3B";
        ctx.beginPath();
        ctx.roundRect(
          cx - barThickness / 2,
          cy - crossSize / 2,
          barThickness,
          crossSize,
          barThickness * 0.25
        );
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(
          cx - crossSize / 2,
          cy - barThickness / 2,
          crossSize,
          barThickness,
          barThickness * 0.25
        );
        ctx.fill();
        ctx.restore();
        resolve(canvas.toDataURL("image/png"));
      };
      logoImg.src = "/em-assist-logo.png";
    };

    qrImage.onerror = () => {
      resolve(qrDataUrl);
    };

    qrImage.src = qrDataUrl;
  });
}

/**
 * Loads the application logo image if available, else returns null.
 */
async function loadLogoImage(pdfDoc: PDFDocument): Promise<PDFImage | null> {
  if (typeof window === "undefined") return null;
  try {
    const response = await fetch("/em-assist-logo.png");
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      return await pdfDoc.embedPng(arrayBuffer);
    }
    const fallback = await fetch("/logo.png");
    if (!fallback.ok) return null;
    const arrayBuffer = await fallback.arrayBuffer();
    return await pdfDoc.embedPng(arrayBuffer);
  } catch {
    return null;
  }
}

/**
 * Helper to draw a phone handset icon using vector primitives
 */
function drawPhoneIcon(page: PDFPage, x: number, y: number, color = CARD_RED, scale = 1) {
  // Base circle with inner cutout styling
  const r = 3.5 * scale;
  page.drawCircle({
    x: x + r,
    y: y + r,
    size: r,
    color,
  });

  // Inner white handset dot
  page.drawCircle({
    x: x + r,
    y: y + r,
    size: r * 0.45,
    color: COLOR_WHITE,
  });
}

/**
 * Helper to draw a crisp EM cross inside a badge
 */
function drawCrossBadge(
  page: PDFPage,
  x: number,
  y: number,
  size: number,
  bgColor = COLOR_WHITE,
  crossColor = CARD_RED
) {
  // Circular background
  const r = size / 2;
  page.drawCircle({
    x: x + r,
    y: y + r,
    size: r,
    color: bgColor,
  });

  const barLen = size * 0.58;
  const barThick = size * 0.20;

  // Vertical bar
  page.drawRectangle({
    x: x + (size - barThick) / 2,
    y: y + (size - barLen) / 2,
    width: barThick,
    height: barLen,
    color: crossColor,
  });

  // Horizontal bar
  page.drawRectangle({
    x: x + (size - barLen) / 2,
    y: y + (size - barThick) / 2,
    width: barLen,
    height: barThick,
    color: crossColor,
  });
}

/**
 * Build Front Face of CR80 Info Card (Page 1)
 */
function buildInfoCardFront(
  page: PDFPage,
  profile: EmProfile,
  qrImage: PDFImage,
  logoImage: PDFImage | null,
  fontBold: PDFFont,
  fontRegular: PDFFont,
  displayDomain: string,
  originX = 0,
  originY = 0
) {
  const shortId = profile.id || "EM-XXXXXX";
  const bloodGroup = profile.bloodGroup && profile.bloodGroup !== "Unknown" ? profile.bloodGroup : "--";
  const W = CR80_WIDTH;
  const H = CR80_HEIGHT;

  // 1. Red background container with light grey border
  page.drawRectangle({
    x: originX,
    y: originY,
    width: W,
    height: H,
    color: CARD_RED,
    borderColor: COLOR_GREY_400,
    borderWidth: 0.5,
  });

  // 2. Dark Header (height 36pt at top)
  const headerHeight = 36;
  const headerY = originY + H - headerHeight;
  page.drawRectangle({
    x: originX,
    y: headerY,
    width: W,
    height: headerHeight,
    color: DARK_HEADER,
  });

  // Header Logo / Emblem
  if (logoImage) {
    try {
      page.drawImage(logoImage, {
        x: originX + 9,
        y: headerY + 9,
        width: 18,
        height: 18,
      });
    } catch {
      drawCrossBadge(page, originX + 9, headerY + 9, 18, COLOR_WHITE, CARD_RED);
    }
  } else {
    drawCrossBadge(page, originX + 9, headerY + 9, 18, COLOR_WHITE, CARD_RED);
  }

  // Header Brand Name
  const emText = "EM ";
  const emWidth = fontBold.widthOfTextAtSize(emText, 9.5);
  page.drawText(emText, {
    x: originX + 32,
    y: headerY + 19,
    size: 9.5,
    font: fontBold,
    color: CARD_RED,
  });
  page.drawText("Assist", {
    x: originX + 32 + emWidth,
    y: headerY + 19,
    size: 9.5,
    font: fontBold,
    color: COLOR_WHITE,
  });
  page.drawText("Responder Card", {
    x: originX + 32,
    y: headerY + 9,
    size: 5.5,
    font: fontRegular,
    color: COLOR_GREY_400,
  });

  // 3. Body Left: Name, Blood Group Label, Huge Blood Group, Tagline
  const bodyHeight = H - headerHeight;
  const leftX = originX + 10;

  // Person's Name (bold, white)
  const displayName = profile.fullName ? profile.fullName.trim() : "Emergency Patient";
  const nameSize = displayName.length > 20 ? 12 : 14.5;
  page.drawText(displayName, {
    x: leftX,
    y: originY + bodyHeight - 20,
    size: nameSize,
    font: fontBold,
    color: COLOR_WHITE,
    maxWidth: 124,
  });

  // Blood group label
  page.drawText("BLOOD GROUP:", {
    x: leftX,
    y: originY + bodyHeight - 34,
    size: 6.5,
    font: fontBold,
    color: COLOR_BLACK,
  });

  // Blood group value (Very large, black)
  const bgSize = bloodGroup.length > 2 ? 34 : 39;
  page.drawText(bloodGroup, {
    x: leftX,
    y: originY + 22,
    size: bgSize,
    font: fontBold,
    color: COLOR_BLACK,
  });

  // Tagline at bottom
  page.drawText("Allergies, medications & history via scan", {
    x: leftX,
    y: originY + 8,
    size: 5.2,
    font: fontRegular,
    color: COLOR_WHITE,
  });

  // 4. Body Right: Inset White QR Panel
  const panelWidth = 100;
  const panelMargin = 5;
  const panelHeight = bodyHeight - panelMargin * 2;
  const panelX = originX + W - panelWidth - panelMargin;
  const panelY = originY + panelMargin;

  page.drawRectangle({
    x: panelX,
    y: panelY,
    width: panelWidth,
    height: panelHeight,
    color: COLOR_WHITE,
  });

  // "SCAN IN EMERGENCY" banner
  const scanText = "SCAN IN ";
  const emerText = "EMERGENCY";
  const scanW = fontBold.widthOfTextAtSize(scanText, 5.5);
  const emerW = fontBold.widthOfTextAtSize(emerText, 5.5);
  const totalBannerW = scanW + emerW;
  const bannerStartX = panelX + (panelWidth - totalBannerW) / 2;
  const bannerY = panelY + panelHeight - 12;

  page.drawText(scanText, {
    x: bannerStartX,
    y: bannerY,
    size: 5.5,
    font: fontBold,
    color: COLOR_BLACK,
  });
  page.drawText(emerText, {
    x: bannerStartX + scanW,
    y: bannerY,
    size: 5.5,
    font: fontBold,
    color: CARD_RED,
  });

  // QR Code Image
  const qrSize = 58;
  const qrX = panelX + (panelWidth - qrSize) / 2;
  const qrY = panelY + 16;
  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  // URL Footer: domain/u/ + shortId
  const urlPrefix = `${displayDomain}/u/`;
  const prefW = fontRegular.widthOfTextAtSize(urlPrefix, 4.5);
  const idW = fontBold.widthOfTextAtSize(shortId, 4.5);
  const totalUrlW = prefW + idW;
  const urlStartX = panelX + (panelWidth - totalUrlW) / 2;
  const urlY = panelY + 6;

  page.drawText(urlPrefix, {
    x: urlStartX,
    y: urlY,
    size: 4.5,
    font: fontRegular,
    color: COLOR_GREY_700,
  });
  page.drawText(shortId, {
    x: urlStartX + prefW,
    y: urlY,
    size: 4.5,
    font: fontBold,
    color: CARD_RED,
  });
}

/**
 * Build Back Face of CR80 Info Card (Page 2)
 */
function buildInfoCardBack(
  page: PDFPage,
  profile: EmProfile,
  qrImage: PDFImage,
  logoImage: PDFImage | null,
  fontBold: PDFFont,
  fontRegular: PDFFont,
  displayDomain: string,
  originX = 0,
  originY = 0
) {
  const shortId = profile.id || "EM-XXXXXX";
  const W = CR80_WIDTH;
  const H = CR80_HEIGHT;

  const contactName = profile.primaryContact?.name
    ? `${profile.primaryContact.name} (${profile.primaryContact.relation || "Contact"})`
    : "No primary contact listed";
  const contactPhone = profile.primaryContact?.phone || profile.ownMobile || "See online profile";

  // 1. White card background with light grey border
  page.drawRectangle({
    x: originX,
    y: originY,
    width: W,
    height: H,
    color: COLOR_WHITE,
    borderColor: COLOR_GREY_400,
    borderWidth: 0.5,
  });

  // 2. Red Header (height 36pt at top)
  const headerHeight = 36;
  const headerY = originY + H - headerHeight;
  page.drawRectangle({
    x: originX,
    y: headerY,
    width: W,
    height: headerHeight,
    color: CARD_RED,
  });

  // Header Title
  const emTitle = "EMERGENCY ";
  const emTitleW = fontBold.widthOfTextAtSize(emTitle, 13);
  page.drawText(emTitle, {
    x: originX + 10,
    y: headerY + 13,
    size: 13,
    font: fontBold,
    color: COLOR_WHITE,
  });
  page.drawText("INFO", {
    x: originX + 10 + emTitleW,
    y: headerY + 13,
    size: 10,
    font: fontRegular,
    color: COLOR_WHITE,
  });

  // White cross badge on header right
  drawCrossBadge(page, originX + W - 28, headerY + 9, 18, COLOR_WHITE, CARD_RED);

  // 3. Body Left: Primary contact details
  const bodyTop = headerY;
  const leftX = originX + 10;

  page.drawText("EMERGENCY CONTACT NAME:", {
    x: leftX,
    y: bodyTop - 14,
    size: 6,
    font: fontBold,
    color: CARD_RED,
  });

  const contactNameSize = contactName.length > 22 ? 11 : 13;
  page.drawText(contactName, {
    x: leftX,
    y: bodyTop - 28,
    size: contactNameSize,
    font: fontBold,
    color: COLOR_BLACK,
    maxWidth: 124,
  });

  page.drawText("EMERGENCY NUMBER:", {
    x: leftX,
    y: bodyTop - 42,
    size: 6,
    font: fontBold,
    color: CARD_RED,
  });

  page.drawText(contactPhone, {
    x: leftX,
    y: bodyTop - 56,
    size: 13,
    font: fontBold,
    color: COLOR_BLACK,
    maxWidth: 124,
  });

  // 4. Body Right: Secondary QR panel
  const panelWidth = 100;
  const panelMargin = 5;
  const panelHeight = H - headerHeight - 40; // Leaves space for footer
  const panelX = originX + W - panelWidth - panelMargin;
  const panelY = originY + 36;

  page.drawRectangle({
    x: panelX,
    y: panelY,
    width: panelWidth,
    height: panelHeight,
    color: COLOR_WHITE,
  });

  // Banner
  const scanText = "SCAN IN ";
  const emerText = "EMERGENCY";
  const scanW = fontBold.widthOfTextAtSize(scanText, 5.5);
  const emerW = fontBold.widthOfTextAtSize(emerText, 5.5);
  const bannerStartX = panelX + (panelWidth - (scanW + emerW)) / 2;
  const bannerY = panelY + panelHeight - 10;

  page.drawText(scanText, {
    x: bannerStartX,
    y: bannerY,
    size: 5.5,
    font: fontBold,
    color: COLOR_BLACK,
  });
  page.drawText(emerText, {
    x: bannerStartX + scanW,
    y: bannerY,
    size: 5.5,
    font: fontBold,
    color: CARD_RED,
  });

  // QR
  const qrSize = 54;
  const qrX = panelX + (panelWidth - qrSize) / 2;
  const qrY = panelY + 6;
  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  // 5. Divider Line
  const dividerY = originY + 33;
  page.drawLine({
    start: { x: originX + 10, y: dividerY },
    end: { x: originX + W - 10, y: dividerY },
    thickness: 0.5,
    color: COLOR_GREY_300,
  });

  // 6. Footer: Tagline, 108 Ambulance, 112 Emergency, short ID
  page.drawText("In emergency: Don't wait, call below numbers and navigate to nearest hospital", {
    x: originX + 10,
    y: originY + 23,
    size: 5,
    font: fontRegular,
    color: COLOR_GREY_600,
  });

  // 108 Ambulance Badge
  drawPhoneIcon(page, originX + 10, originY + 8, CARD_RED, 0.9);
  page.drawText("108", {
    x: originX + 19,
    y: originY + 12,
    size: 8.5,
    font: fontBold,
    color: CARD_RED,
  });
  page.drawText("Ambulance", {
    x: originX + 19,
    y: originY + 6,
    size: 4.8,
    font: fontRegular,
    color: COLOR_GREY_600,
  });

  // 112 Emergency Badge
  drawPhoneIcon(page, originX + 68, originY + 8, CARD_RED, 0.9);
  page.drawText("112", {
    x: originX + 77,
    y: originY + 12,
    size: 8.5,
    font: fontBold,
    color: CARD_RED,
  });
  page.drawText("Emergency", {
    x: originX + 77,
    y: originY + 6,
    size: 4.8,
    font: fontRegular,
    color: COLOR_GREY_600,
  });

  // Short ID & domain at bottom right
  const idSize = 9.5;
  const idTextWidth = fontBold.widthOfTextAtSize(shortId, idSize);
  const domainText = `${displayDomain}/u/`;
  const domTextWidth = fontRegular.widthOfTextAtSize(domainText, 5);

  page.drawText(shortId, {
    x: originX + W - 10 - idTextWidth,
    y: originY + 14,
    size: idSize,
    font: fontBold,
    color: CARD_RED,
  });
  page.drawText(domainText, {
    x: originX + W - 10 - domTextWidth,
    y: originY + 6,
    size: 5,
    font: fontRegular,
    color: COLOR_GREY_700,
  });
}

/**
 * Build Keychain Tag (50mm x 50mm square tag)
 */
function buildKeychainTag(
  page: PDFPage,
  profile: EmProfile,
  qrImage: PDFImage,
  fontBold: PDFFont,
  fontRegular: PDFFont,
  displayDomain: string,
  originX = 0,
  originY = 0
) {
  const shortId = profile.id || "EM-XXXXXX";
  const bloodGroup = profile.bloodGroup && profile.bloodGroup !== "Unknown" ? profile.bloodGroup : "?";
  const S = KEYCHAIN_SIZE;

  // Outer red border
  page.drawRectangle({
    x: originX + 2,
    y: originY + 2,
    width: S - 4,
    height: S - 4,
    color: COLOR_WHITE,
    borderColor: CARD_RED,
    borderWidth: 1.2,
  });

  // Top header: EM Assist + SCAN ME DURING EMERGENCY
  const emText = "EM ";
  const assistText = "Assist";
  const emW = fontBold.widthOfTextAtSize(emText, 9);
  const assistW = fontBold.widthOfTextAtSize(assistText, 9);
  const headerStartX = originX + (S - (emW + assistW)) / 2;

  page.drawText(emText, {
    x: headerStartX,
    y: originY + S - 15,
    size: 9,
    font: fontBold,
    color: CARD_RED,
  });
  page.drawText(assistText, {
    x: headerStartX + emW,
    y: originY + S - 15,
    size: 9,
    font: fontBold,
    color: COLOR_BLACK,
  });

  const scanText = "SCAN ME DURING EMERGENCY";
  const scanW = fontBold.widthOfTextAtSize(scanText, 3.8);
  page.drawText(scanText, {
    x: originX + (S - scanW) / 2,
    y: originY + S - 22,
    size: 3.8,
    font: fontBold,
    color: CARD_RED,
  });

  // Center QR code (size 68pt)
  const qrSize = 68;
  const qrX = originX + (S - qrSize) / 2;
  const qrY = originY + 41;
  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  // URL footer: domain/u/ + shortId
  const urlPrefix = `${displayDomain}/u/`;
  const prefW = fontRegular.widthOfTextAtSize(urlPrefix, 4.5);
  const idW = fontBold.widthOfTextAtSize(shortId, 4.5);
  const totalUrlW = prefW + idW;
  const urlX = originX + (S - totalUrlW) / 2;
  const urlY = originY + 31;

  page.drawText(urlPrefix, {
    x: urlX,
    y: urlY,
    size: 4.5,
    font: fontRegular,
    color: COLOR_GREY_700,
  });
  page.drawText(shortId, {
    x: urlX + prefW,
    y: urlY,
    size: 4.5,
    font: fontBold,
    color: CARD_RED,
  });

  // Bottom Banner (red background with patient name & blood group)
  const bannerH = 26;
  page.drawRectangle({
    x: originX + 2,
    y: originY + 2,
    width: S - 4,
    height: bannerH,
    color: CARD_RED,
  });

  const name = profile.fullName ? profile.fullName.trim() : "Emergency Patient";
  const nameSize = name.length > 22 ? 5.5 : 6.8;
  const nameW = fontBold.widthOfTextAtSize(name, nameSize);
  page.drawText(name, {
    x: Math.max(originX + 4, originX + (S - nameW) / 2),
    y: originY + 16,
    size: nameSize,
    font: fontBold,
    color: COLOR_WHITE,
    maxWidth: S - 8,
  });

  const bloodText = `BLOOD: ${bloodGroup}`;
  const bloodW = fontRegular.widthOfTextAtSize(bloodText, 5.2);
  page.drawText(bloodText, {
    x: originX + (S - bloodW) / 2,
    y: originY + 7,
    size: 5.2,
    font: fontRegular,
    color: COLOR_WHITE,
  });
}

/**
 * Build Plain QR (60mm x 60mm square sticker)
 */
function buildPlainQr(
  page: PDFPage,
  profile: EmProfile,
  qrImage: PDFImage,
  fontBold: PDFFont,
  displayDomain: string,
  originX = 0,
  originY = 0
) {
  const shortId = profile.id || "EM-XXXXXX";
  const S = PLAIN_QR_SIZE;

  // White background
  page.drawRectangle({
    x: originX,
    y: originY,
    width: S,
    height: S,
    color: COLOR_WHITE,
  });

  // Large quiet zone QR code (size ~126pt)
  const qrSize = 126;
  const qrX = originX + (S - qrSize) / 2;
  const qrY = originY + 24;
  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  // Bottom caption: Name (ID: EM-XXXXXX)
  const name = profile.fullName ? profile.fullName.trim() : "Emergency ID";
  const caption = `${name} (ID: ${shortId})`;
  const captionSize = 5.8;
  const capW = fontBold.widthOfTextAtSize(caption, captionSize);
  page.drawText(caption, {
    x: Math.max(originX + 4, originX + (S - capW) / 2),
    y: originY + 11,
    size: captionSize,
    font: fontBold,
    color: COLOR_GREY_800,
    maxWidth: S - 8,
  });
}

/**
 * Build A4 Single-Page Sheet containing all templates with cutting guides
 */
function buildA4Sheet(
  page: PDFPage,
  profile: EmProfile,
  qrImage: PDFImage,
  logoImage: PDFImage | null,
  fontBold: PDFFont,
  fontRegular: PDFFont,
  displayDomain: string
) {
  // A4 Page background
  page.drawRectangle({
    x: 0,
    y: 0,
    width: A4_WIDTH,
    height: A4_HEIGHT,
    color: COLOR_WHITE,
  });

  // Header Banner
  page.drawRectangle({
    x: 30,
    y: A4_HEIGHT - 65,
    width: A4_WIDTH - 60,
    height: 35,
    color: DARK_HEADER,
  });

  page.drawText("EM ASSIST — COMPLETE EMERGENCY PRINT KIT", {
    x: 45,
    y: A4_HEIGHT - 44,
    size: 13,
    font: fontBold,
    color: COLOR_WHITE,
  });
  page.drawText("Cut along dashed lines. Laminate for durability. Carry in wallet, keys, & bike/helmet.", {
    x: 45,
    y: A4_HEIGHT - 56,
    size: 7,
    font: fontRegular,
    color: COLOR_GREY_400,
  });

  // SECTION 1: CR80 Front & Back Cards Side-by-Side
  const cardSectionY = A4_HEIGHT - 85 - CR80_HEIGHT;

  // Front Card
  buildInfoCardFront(
    page,
    profile,
    qrImage,
    logoImage,
    fontBold,
    fontRegular,
    displayDomain,
    45,
    cardSectionY
  );

  // Back Card
  buildInfoCardBack(
    page,
    profile,
    qrImage,
    logoImage,
    fontBold,
    fontRegular,
    displayDomain,
    45 + CR80_WIDTH + 20,
    cardSectionY
  );

  // Labels above cards
  page.drawText("1. RESPONDER CARD — FRONT (CR80 Standard)", {
    x: 45,
    y: cardSectionY + CR80_HEIGHT + 6,
    size: 7.5,
    font: fontBold,
    color: COLOR_GREY_700,
  });
  page.drawText("2. RESPONDER CARD — BACK (CR80 Standard)", {
    x: 45 + CR80_WIDTH + 20,
    y: cardSectionY + CR80_HEIGHT + 6,
    size: 7.5,
    font: fontBold,
    color: COLOR_GREY_700,
  });

  // SECTION 2: Keychain Tag & Plain QR Sticker
  const secondSectionY = cardSectionY - 60 - Math.max(KEYCHAIN_SIZE, PLAIN_QR_SIZE);

  // Keychain Tag
  buildKeychainTag(
    page,
    profile,
    qrImage,
    fontBold,
    fontRegular,
    displayDomain,
    45,
    secondSectionY + (PLAIN_QR_SIZE - KEYCHAIN_SIZE)
  );

  // Plain QR
  buildPlainQr(
    page,
    profile,
    qrImage,
    fontBold,
    displayDomain,
    45 + KEYCHAIN_SIZE + 40,
    secondSectionY
  );

  // Labels
  page.drawText("3. KEYCHAIN / LUGGAGE TAG (50x50 mm)", {
    x: 45,
    y: secondSectionY + PLAIN_QR_SIZE + 8,
    size: 7.5,
    font: fontBold,
    color: COLOR_GREY_700,
  });
  page.drawText("4. STICKER / VEHICLE QR (60x60 mm)", {
    x: 45 + KEYCHAIN_SIZE + 40,
    y: secondSectionY + PLAIN_QR_SIZE + 8,
    size: 7.5,
    font: fontBold,
    color: COLOR_GREY_700,
  });

  // Emergency Instructions Footer
  const footerY = 40;
  page.drawRectangle({
    x: 30,
    y: footerY,
    width: A4_WIDTH - 60,
    height: 48,
    color: rgb(0.97, 0.97, 0.98),
    borderColor: COLOR_GREY_300,
    borderWidth: 0.5,
  });

  page.drawText("IMPORTANT USAGE INSTRUCTIONS FOR INDIAN EMERGENCY RESPONSE:", {
    x: 45,
    y: footerY + 33,
    size: 7.5,
    font: fontBold,
    color: CARD_RED,
  });
  page.drawText("• Standard card fits all standard wallet card slots. Both sides can be printed double-sided on plastic PVC cards.", {
    x: 45,
    y: footerY + 21,
    size: 6.8,
    font: fontRegular,
    color: COLOR_GREY_800,
  });
  page.drawText("• National Emergency numbers: 112 (Police/Fire/Medical) & 108 (Trauma Ambulance) work across all Indian states 24x7 without balance.", {
    x: 45,
    y: footerY + 10,
    size: 6.8,
    font: fontRegular,
    color: COLOR_GREY_800,
  });
}

/**
 * Core PDF Generation Function: creates a PDFDocument according to CardTemplateType
 */
export async function generateEmergencyPdf(
  profile: EmProfile,
  templateType: CardTemplateType = "allInOne",
  domain = "alokdasofficial.in"
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Embed standard typography fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Generate high-resolution QR with embedded medical cross emblem
  const payloadUrl = `https://${domain}/u/${profile.id}`;
  const qrDataUrl = await generateQrWithLogoDataUrl(payloadUrl);
  const qrImage = await pdfDoc.embedPng(qrDataUrl);

  // Try loading app logo
  const logoImage = await loadLogoImage(pdfDoc);

  switch (templateType) {
    case "allInOne": {
      // 1. Info Card Front
      const p1 = pdfDoc.addPage([CR80_WIDTH, CR80_HEIGHT]);
      buildInfoCardFront(p1, profile, qrImage, logoImage, fontBold, fontRegular, domain);

      // 2. Info Card Back
      const p2 = pdfDoc.addPage([CR80_WIDTH, CR80_HEIGHT]);
      buildInfoCardBack(p2, profile, qrImage, logoImage, fontBold, fontRegular, domain);

      // 3. Keychain Tag
      const p3 = pdfDoc.addPage([KEYCHAIN_SIZE, KEYCHAIN_SIZE]);
      buildKeychainTag(p3, profile, qrImage, fontBold, fontRegular, domain);

      // 4. Plain QR
      const p4 = pdfDoc.addPage([PLAIN_QR_SIZE, PLAIN_QR_SIZE]);
      buildPlainQr(p4, profile, qrImage, fontBold, domain);
      break;
    }

    case "infoCard": {
      // Page 1: Front
      const p1 = pdfDoc.addPage([CR80_WIDTH, CR80_HEIGHT]);
      buildInfoCardFront(p1, profile, qrImage, logoImage, fontBold, fontRegular, domain);

      // Page 2: Back
      const p2 = pdfDoc.addPage([CR80_WIDTH, CR80_HEIGHT]);
      buildInfoCardBack(p2, profile, qrImage, logoImage, fontBold, fontRegular, domain);
      break;
    }

    case "keychainTag": {
      const p = pdfDoc.addPage([KEYCHAIN_SIZE, KEYCHAIN_SIZE]);
      buildKeychainTag(p, profile, qrImage, fontBold, fontRegular, domain);
      break;
    }

    case "plainQr": {
      const p = pdfDoc.addPage([PLAIN_QR_SIZE, PLAIN_QR_SIZE]);
      buildPlainQr(p, profile, qrImage, fontBold, domain);
      break;
    }

    case "a4Sheet": {
      const p = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      buildA4Sheet(p, profile, qrImage, logoImage, fontBold, fontRegular, domain);
      break;
    }
  }

  return await pdfDoc.save();
}

/**
 * Returns formatted filename for selected template
 */
export function getEmergencyPdfFileName(
  profile: EmProfile,
  templateType: CardTemplateType
): string {
  const baseName = (profile.fullName || "emergency").replace(/\s+/g, "_");
  switch (templateType) {
    case "allInOne":
      return `${baseName}_complete_emergency_kit.pdf`;
    case "infoCard":
      return `${baseName}_emergency_info_card.pdf`;
    case "keychainTag":
      return `${baseName}_emergency_keychain.pdf`;
    case "plainQr":
      return `${baseName}_qr_only.pdf`;
    case "a4Sheet":
      return `${baseName}_emergency_sheet_a4.pdf`;
  }
}

/**
 * Direct file download helper
 */
export async function downloadEmergencyPdf(
  profile: EmProfile,
  templateType: CardTemplateType = "allInOne"
): Promise<void> {
  const pdfBytes = await generateEmergencyPdf(profile, templateType);
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getEmergencyPdfFileName(profile, templateType);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/**
 * Direct print helper: opens print dialog for generated PDF via hidden iframe
 */
export async function printEmergencyPdf(
  profile: EmProfile,
  templateType: CardTemplateType = "allInOne"
): Promise<void> {
  const pdfBytes = await generateEmergencyPdf(profile, templateType);
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.src = url;

  document.body.appendChild(iframe);

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.open(url, "_blank");
    } finally {
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 60000);
    }
  };
}
