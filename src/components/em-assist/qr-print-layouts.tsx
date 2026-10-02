"use client";

import React, { useEffect, useRef, useState } from "react";
import { EmProfile, CardTemplateType } from "@/types/em-assist";
import {
  generateQrWithLogoDataUrl,
  downloadEmergencyPdf,
  printEmergencyPdf,
} from "@/lib/em-assist/pdf-print-service";
import {
  Printer,
  Download,
  Copy,
  Check,
  CreditCard,
  Tag,
  KeyRound,
  Layers,
  FileText,
  PhoneCall,
  HeartPulse,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface QrPrintLayoutsProps {
  profile: EmProfile;
}

export function QrPrintLayouts({ profile }: QrPrintLayoutsProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplateType>("allInOne");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const profileUrl = `https://alokdasofficial.in/u/${profile.id}`;
  const bloodGroup = profile.bloodGroup && profile.bloodGroup !== "Unknown" ? profile.bloodGroup : "--";
  const primaryContact = profile.primaryContact;
  const shortId = profile.id || "EM-XXXXXX";

  useEffect(() => {
    let isMounted = true;
    generateQrWithLogoDataUrl(profileUrl).then((url) => {
      if (isMounted && url) {
        setQrDataUrl(url);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [profileUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQrPng = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `EM-ASSIST-QR-${profile.id}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleDownloadPdf = async () => {
    try {
      setIsPdfLoading(true);
      await downloadEmergencyPdf(profile, selectedTemplate);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handlePrintPdf = async () => {
    try {
      setIsPdfLoading(true);
      await printEmergencyPdf(profile, selectedTemplate);
    } catch (err) {
      console.error("Failed to print PDF:", err);
      window.print();
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Selector & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm print:hidden">
        {/* Format Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-bold text-muted-foreground mr-1 hidden lg:inline">Format:</span>
          <button
            type="button"
            onClick={() => setSelectedTemplate("allInOne")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedTemplate === "allInOne"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All (Kit)</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTemplate("infoCard")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedTemplate === "infoCard"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Card (Front & Back)</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTemplate("keychainTag")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedTemplate === "keychainTag"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Keychain Tag</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTemplate("plainQr")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedTemplate === "plainQr"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>QR Only</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedTemplate("a4Sheet")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedTemplate === "a4Sheet"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>A4 Sheet</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            title="Copy Responder Profile URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy Link"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadQrPng}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            title="Download QR Code as PNG"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">QR PNG</span>
          </button>

          <button
            type="button"
            disabled={isPdfLoading}
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs sm:text-sm font-bold shadow hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isPdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            disabled={isPdfLoading}
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs sm:text-sm font-bold shadow hover:bg-rose-700 disabled:opacity-50 transition-all"
          >
            {isPdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Stage / Visual Preview */}
      <div
        ref={printRef}
        className="w-full flex flex-col justify-center items-center p-4 sm:p-8 md:p-12 rounded-3xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 print:bg-white print:p-0 print:border-none min-h-[460px]"
      >
        {/* TEMPLATE 1: CARD (FRONT & BACK) */}
        {selectedTemplate === "infoCard" && (
          <div className="space-y-6 w-full max-w-4xl">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Double-Sided Responder Card (CR80 Standard: 85.6 × 53.98 mm)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Page 1 (Front) &amp; Page 2 (Back)
              </span>
            </div>

            <div className="flex flex-col xl:flex-row items-center justify-center gap-8">
              {/* Front Face */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-center text-slate-500 dark:text-slate-400">
                  FRONT FACE
                </div>
                <CardFrontPreview
                  profile={profile}
                  bloodGroup={bloodGroup}
                  qrDataUrl={qrDataUrl}
                  shortId={shortId}
                />
              </div>

              {/* Back Face */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-center text-slate-500 dark:text-slate-400">
                  BACK FACE
                </div>
                <CardBackPreview
                  profile={profile}
                  primaryContact={primaryContact}
                  qrDataUrl={qrDataUrl}
                  shortId={shortId}
                />
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 2: ALL (KIT) */}
        {selectedTemplate === "allInOne" && (
          <div className="space-y-8 w-full max-w-5xl">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-foreground">Complete Emergency Print Kit</h3>
              <p className="text-xs text-muted-foreground">
                Contains CR80 double-sided wallet card, 50x50 mm keychain tag, and 60x60 mm plain QR sticker in a multi-page PDF.
              </p>
            </div>

            {/* Front & Back Cards */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-black uppercase tracking-wider text-foreground">
                  1. Double-Sided Responder Card (Wallet CR80)
                </span>
              </div>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                <CardFrontPreview
                  profile={profile}
                  bloodGroup={bloodGroup}
                  qrDataUrl={qrDataUrl}
                  shortId={shortId}
                />
                <CardBackPreview
                  profile={profile}
                  primaryContact={primaryContact}
                  qrDataUrl={qrDataUrl}
                  shortId={shortId}
                />
              </div>
            </div>

            {/* Keychain Tag & Plain QR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
              {/* Keychain Tag */}
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center gap-2 self-start">
                  <KeyRound className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-foreground">
                    2. Keychain / Bag Tag (50 × 50 mm)
                  </span>
                </div>
                <KeychainTagPreview
                  profile={profile}
                  bloodGroup={bloodGroup}
                  qrDataUrl={qrDataUrl}
                  shortId={shortId}
                />
              </div>

              {/* Plain QR Sticker */}
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center gap-2 self-start">
                  <Tag className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-black uppercase tracking-wider text-foreground">
                    3. Sticker / Vehicle QR (60 × 60 mm)
                  </span>
                </div>
                <PlainQrPreview
                  profile={profile}
                  qrDataUrl={qrDataUrl}
                  shortId={shortId}
                />
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 3: KEYCHAIN TAG */}
        {selectedTemplate === "keychainTag" && (
          <div className="space-y-4 flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Keychain / Luggage Tag (50 × 50 mm)
            </span>
            <KeychainTagPreview
              profile={profile}
              bloodGroup={bloodGroup}
              qrDataUrl={qrDataUrl}
              shortId={shortId}
            />
            <p className="text-xs text-muted-foreground text-center max-w-sm">
              Punch a hole at the top marker and attach to keys, school bags, or backpacks.
            </p>
          </div>
        )}

        {/* TEMPLATE 4: PLAIN QR */}
        {selectedTemplate === "plainQr" && (
          <div className="space-y-4 flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Plain QR Sticker (60 × 60 mm with quiet zone)
            </span>
            <PlainQrPreview
              profile={profile}
              qrDataUrl={qrDataUrl}
              shortId={shortId}
            />
            <p className="text-xs text-muted-foreground text-center max-w-sm">
              Generous quiet zone ensures quick camera lock. Perfect for motorcycle helmets, car windshields, or bicycle frames.
            </p>
          </div>
        )}

        {/* TEMPLATE 5: A4 SHEET */}
        {selectedTemplate === "a4Sheet" && (
          <div className="space-y-4 w-full max-w-2xl">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                All-In-One Single-Page A4 Sheet (210 × 297 mm)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Print ready for standard home printers
              </span>
            </div>

            {/* A4 Sheet Preview Mockup */}
            <div className="w-full bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-300 select-none">
              {/* Top Banner */}
              <div className="bg-[#1C1C1C] text-white p-3 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm tracking-wide">
                    EM ASSIST — COMPLETE EMERGENCY PRINT KIT
                  </h4>
                  <p className="text-[10px] text-slate-300">
                    Cut along dashed lines. Laminate for durability.
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-black flex items-center justify-center border border-slate-700 p-0.5 shrink-0">
                  <img src="/em-assist-logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
              </div>

              {/* Section 1: Front and Back */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-600">
                  1. RESPONDER CARD — FRONT &amp; BACK (CR80)
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="scale-75 origin-top-left -mr-16 -mb-10 sm:scale-90 sm:-mr-8 sm:-mb-5">
                    <CardFrontPreview
                      profile={profile}
                      bloodGroup={bloodGroup}
                      qrDataUrl={qrDataUrl}
                      shortId={shortId}
                    />
                  </div>
                  <div className="scale-75 origin-top-left -mr-16 -mb-10 sm:scale-90 sm:-mr-8 sm:-mb-5">
                    <CardBackPreview
                      profile={profile}
                      primaryContact={primaryContact}
                      qrDataUrl={qrDataUrl}
                      shortId={shortId}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Keychain & Sticker */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 items-center">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-600 mb-1">
                    2. KEYCHAIN TAG (50x50 mm)
                  </span>
                  <div className="scale-75 origin-top sm:scale-90">
                    <KeychainTagPreview
                      profile={profile}
                      bloodGroup={bloodGroup}
                      qrDataUrl={qrDataUrl}
                      shortId={shortId}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-600 mb-1">
                    3. STICKER QR (60x60 mm)
                  </span>
                  <div className="scale-75 origin-top sm:scale-90">
                    <PlainQrPreview
                      profile={profile}
                      qrDataUrl={qrDataUrl}
                      shortId={shortId}
                    />
                  </div>
                </div>
              </div>

              {/* A4 Instructions */}
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-[11px] text-rose-900 font-medium space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-700">
                  <HeartPulse className="w-4 h-4" />
                  <span>EMERGENCY HELPLINES ACROSS INDIA (24x7 TOLL-FREE)</span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-bold pt-1">
                  <span>National Helpline: <strong className="text-rose-600">112</strong></span>
                  <span>Ambulance: <strong className="text-rose-600">108</strong></span>
                  <span>Police: <strong className="text-rose-600">100</strong></span>
                  <span>Fire: <strong className="text-rose-600">101</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Information Tip Banner */}
      <div className="p-4 rounded-2xl bg-card border border-border flex items-start gap-3 text-xs text-muted-foreground print:hidden">
        <HeartPulse className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            Print Optimization &amp; PVC Laminator Ready
          </p>
          <p>
            The generated PDF adheres strictly to international ISO/IEC 7810 ID-1 standard dimensions (85.6 × 53.98 mm).
            You can print it directly onto PVC plastic cards, adhesive sticker sheets, or laminate paper prints.
            The dynamic QR code is embedded with high error-correction so first responders can scan it instantly even in low light or with slight smudges.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Subcomponent: Card Front Face Preview                                      */
/* -------------------------------------------------------------------------- */
function CardFrontPreview({
  profile,
  bloodGroup,
  qrDataUrl,
  shortId,
}: {
  profile: EmProfile;
  bloodGroup: string;
  qrDataUrl: string;
  shortId: string;
}) {
  return (
    <div className="w-[360px] h-[225px] rounded-2xl overflow-hidden shadow-2xl border border-slate-300 bg-[#E83B3B] text-white flex flex-col justify-between relative select-none">
      {/* Dark Header */}
      <div className="h-10 bg-[#1C1C1C] px-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo badge */}
          <div className="w-5 h-5 rounded-full overflow-hidden bg-black flex items-center justify-center shrink-0 border border-slate-700">
            <img src="/em-assist-logo.png" alt="Logo" className="w-full h-full object-contain p-0.5" />
          </div>
          <div>
            <div className="flex items-center leading-none">
              <span className="text-[#E83B3B] font-extrabold text-[11px]">EM&nbsp;</span>
              <span className="text-white font-extrabold text-[11px]">Assist</span>
            </div>
            <span className="text-slate-400 text-[8px] font-medium leading-none block">
              Responder Card
            </span>
          </div>
        </div>

        <span className="text-[9px] font-mono bg-neutral-800 text-slate-300 px-1.5 py-0.5 rounded font-bold">
          CR80 ID
        </span>
      </div>

      {/* Red Body */}
      <div className="flex-1 flex items-stretch p-3 gap-2">
        {/* Left Section */}
        <div className="flex-1 flex flex-col justify-between pr-1">
          <div>
            <div className="font-black text-base leading-tight text-white line-clamp-2">
              {profile.fullName || "Emergency Patient"}
            </div>
            <div className="text-[9px] font-bold text-slate-950 uppercase tracking-wider mt-1.5">
              BLOOD GROUP:
            </div>
            <div className="text-4xl font-black text-slate-950 leading-none mt-0.5">
              {bloodGroup}
            </div>
          </div>

          <div className="text-[8px] font-medium text-white/90 leading-tight">
            Allergies, medications &amp; history via scan
          </div>
        </div>

        {/* Right Inset White QR Panel */}
        <div className="w-[125px] bg-white rounded-xl p-2 flex flex-col items-center justify-between text-slate-900 shadow-md">
          {/* Top banner */}
          <div className="text-[8.5px] font-black uppercase tracking-tight">
            <span>SCAN IN </span>
            <span className="text-[#E83B3B]">EMERGENCY</span>
          </div>

          {/* QR code */}
          <div className="w-24 h-24 flex items-center justify-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Emergency QR Code"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-20 h-20 bg-slate-200 animate-pulse rounded" />
            )}
          </div>

          {/* URL / shortId */}
          <div className="text-[8.5px] font-semibold text-slate-500 flex items-center justify-center">
            <span>alokdasofficial.in/u/</span>
            <span className="text-[#E83B3B] font-bold">{shortId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Subcomponent: Card Back Face Preview                                       */
/* -------------------------------------------------------------------------- */
function CardBackPreview({
  profile,
  primaryContact,
  qrDataUrl,
  shortId,
}: {
  profile: EmProfile;
  primaryContact?: EmProfile["primaryContact"];
  qrDataUrl: string;
  shortId: string;
}) {
  const contactName = primaryContact?.name
    ? `${primaryContact.name} (${primaryContact.relation || "Contact"})`
    : "No primary contact listed";
  const contactPhone = primaryContact?.phone || profile.ownMobile || "See online profile";

  return (
    <div className="w-[360px] h-[225px] rounded-2xl overflow-hidden shadow-2xl border border-slate-300 bg-white text-slate-900 flex flex-col justify-between relative select-none">
      {/* Red Header */}
      <div className="h-10 bg-[#E83B3B] px-3.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-sm tracking-wide">EMERGENCY</span>
          <span className="font-semibold text-xs opacity-90">INFO</span>
        </div>
        <div className="w-5 h-5 rounded-full overflow-hidden bg-white flex items-center justify-center border border-white/40 shrink-0">
          <img src="/em-assist-logo.png" alt="Logo" className="w-4 h-4 object-contain" />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex items-stretch p-3 pb-1 gap-2">
        {/* Left Section: Emergency Contact Details */}
        <div className="flex-1 flex flex-col justify-center space-y-1.5 pr-1">
          <div>
            <div className="text-[8.5px] font-extrabold text-[#E83B3B] uppercase tracking-wider">
              EMERGENCY CONTACT NAME:
            </div>
            <div className="font-black text-xs sm:text-sm text-slate-900 line-clamp-1">
              {contactName}
            </div>
          </div>

          <div>
            <div className="text-[8.5px] font-extrabold text-[#E83B3B] uppercase tracking-wider">
              EMERGENCY NUMBER:
            </div>
            <div className="font-black text-xs sm:text-sm text-slate-900">
              {contactPhone}
            </div>
          </div>
        </div>

        {/* Right Inset White QR Panel */}
        <div className="w-[110px] bg-slate-50 border border-slate-200 rounded-xl p-1.5 flex flex-col items-center justify-between text-slate-900">
          <div className="text-[8px] font-black uppercase tracking-tight">
            <span>SCAN IN </span>
            <span className="text-[#E83B3B]">EMERGENCY</span>
          </div>

          <div className="w-20 h-20 flex items-center justify-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Emergency QR Code"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-16 h-16 bg-slate-200 animate-pulse rounded" />
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-slate-200" />

      {/* Footer: Hotlines + ShortId */}
      <div className="px-3 pb-2 pt-1 space-y-1">
        <div className="text-[7.5px] text-slate-500 font-medium">
          In emergency: Don't wait, call below numbers and navigate to nearest hospital
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 108 */}
            <div className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-[#E83B3B]" />
              <div>
                <div className="text-[10px] font-black text-[#E83B3B] leading-none">108</div>
                <div className="text-[7px] text-slate-500 leading-none">Ambulance</div>
              </div>
            </div>

            {/* 112 */}
            <div className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-[#E83B3B]" />
              <div>
                <div className="text-[10px] font-black text-[#E83B3B] leading-none">112</div>
                <div className="text-[7px] text-slate-500 leading-none">Emergency</div>
              </div>
            </div>
          </div>

          {/* Short ID */}
          <div className="text-right">
            <div className="text-[11px] font-black text-[#E83B3B] leading-tight font-mono">
              {shortId}
            </div>
            <div className="text-[7.5px] text-slate-500 leading-tight">
              alokdasofficial.in/u/
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Subcomponent: Keychain Tag Preview (50x50 mm)                              */
/* -------------------------------------------------------------------------- */
function KeychainTagPreview({
  profile,
  bloodGroup,
  qrDataUrl,
  shortId,
}: {
  profile: EmProfile;
  bloodGroup: string;
  qrDataUrl: string;
  shortId: string;
}) {
  return (
    <div className="w-[200px] h-[200px] bg-white rounded-2xl border-2 border-[#E83B3B] shadow-xl p-2 flex flex-col justify-between items-center text-center relative select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-center gap-1.5 leading-none">
          <div className="w-3.5 h-3.5 rounded-full overflow-hidden bg-black flex items-center justify-center shrink-0 border border-slate-700">
            <img src="/em-assist-logo.png" alt="Logo" className="w-full h-full object-contain p-0.5" />
          </div>
          <span className="text-[#E83B3B] font-extrabold text-xs">EM&nbsp;</span>
          <span className="text-slate-900 font-extrabold text-xs">Assist</span>
        </div>
        <div className="text-[7.5px] font-black text-[#E83B3B] uppercase tracking-wide mt-0.5">
          SCAN ME DURING EMERGENCY
        </div>
      </div>

      {/* QR Code */}
      <div className="w-24 h-24 flex items-center justify-center">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="Emergency QR Code"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-20 h-20 bg-slate-200 animate-pulse rounded" />
        )}
      </div>

      {/* Domain + ID */}
      <div className="text-[7.5px] font-medium text-slate-500 flex items-center justify-center">
        <span>alokdasofficial.in/u/</span>
        <span className="text-[#E83B3B] font-bold">{shortId}</span>
      </div>

      {/* Bottom Red Banner */}
      <div className="w-full bg-[#E83B3B] text-white py-1 px-1.5 rounded-lg">
        <div className="text-[9.5px] font-black truncate max-w-[180px]">
          {profile.fullName || "Emergency Patient"}
        </div>
        <div className="text-[8px] font-bold opacity-95">
          BLOOD: {bloodGroup}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Subcomponent: Plain QR Sticker Preview (60x60 mm)                          */
/* -------------------------------------------------------------------------- */
function PlainQrPreview({
  profile,
  qrDataUrl,
  shortId,
}: {
  profile: EmProfile;
  qrDataUrl: string;
  shortId: string;
}) {
  return (
    <div className="w-[200px] h-[200px] bg-white rounded-2xl border border-slate-300 shadow-xl p-3 flex flex-col justify-between items-center text-center select-none">
      {/* Large QR with Quiet Zone */}
      <div className="w-36 h-36 flex items-center justify-center my-auto">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="Emergency QR Code"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-32 h-32 bg-slate-200 animate-pulse rounded" />
        )}
      </div>

      {/* Bottom Label */}
      <div className="text-[9.5px] font-bold text-slate-800 truncate max-w-[180px]">
        {profile.fullName || "Emergency ID"} (ID: {shortId})
      </div>
    </div>
  );
}
