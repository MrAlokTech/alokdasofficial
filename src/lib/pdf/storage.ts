/**
 * LocalStorage Signature Manager
 * Saves signatures as transparent PNG data URLs locally on device
 */

export interface SavedSignature {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: number;
}

const STORAGE_KEY = "agy_pdf_saved_signatures";

export function getSavedSignatures(): SavedSignature[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load saved signatures:", err);
    return [];
  }
}

export function saveSignature(name: string, dataUrl: string): SavedSignature {
  const existing = getSavedSignatures();
  const newSig: SavedSignature = {
    id: "sig_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    name: name || `Signature ${existing.length + 1}`,
    dataUrl,
    createdAt: Date.now(),
  };

  const updated = [newSig, ...existing].slice(0, 10); // keep up to 10 signatures
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save signature to localStorage:", err);
  }
  return newSig;
}

export function deleteSavedSignature(id: string): void {
  const existing = getSavedSignatures();
  const updated = existing.filter((s) => s.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to delete signature from localStorage:", err);
  }
}
