import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import {
  EmProfile,
  AccessLog,
  ResponderDeviceInfo,
  ResponderGeoLocation,
  FieldVisibility,
} from "@/types/em-assist";

const COLLECTION_NAME = "em_profiles";
const LOGS_COLLECTION = "em_access_logs";

/**
 * Generates an 8-12 character alphanumeric ID suitable for emergency tags and QR codes.
 * Format: EM-XXXX-XXXX or EM-XXXXXXXX (uppercase alphanumeric)
 */
export function generateEmId(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // Omitting easily confused 0, O, 1, I
  let part1 = "";
  let part2 = "";
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `EM-${part1}${part2}`;
}

/**
 * Default visibility configuration for newly created emergency profiles.
 */
export const DEFAULT_FIELD_VISIBILITY: FieldVisibility = {
  fullName: true,
  bloodGroup: true,
  ownMobile: true,
  primaryContact: true,
  secondaryContact: true,
  medications: true,
  allergies: true,
  illnesses: true,
  notes: true,
  address: true,
  abhaId: true,
};

/**
 * Recursively removes keys with `undefined` values from an object,
 * because Firestore rejects objects containing `undefined`.
 */
export function removeUndefinedFields<T extends Record<string, any>>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => removeUndefinedFields(item)) as unknown as T;
  }
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== undefined) {
      if (val !== null && typeof val === "object") {
        result[key] = removeUndefinedFields(val);
      } else {
        result[key] = val;
      }
    }
  }
  return result as T;
}

/**
 * Save or create an EM Assist profile.
 */
export async function saveProfile(
  profile: Partial<EmProfile> & {
    ownerUid: string;
    ownerEmail: string;
    fullName: string;
  }
): Promise<EmProfile> {
  const db = getFirebaseDb("em-assist");
  const profileId = profile.id ? profile.id.trim().toUpperCase() : generateEmId();
  const now = new Date().toISOString();

  const finalProfile: EmProfile = {
    id: profileId,
    ownerUid: profile.ownerUid,
    ownerEmail: profile.ownerEmail.toLowerCase().trim(),
    relation: profile.relation || "Self",
    label: profile.label || profile.fullName,
    fullName: profile.fullName,
    ownMobile: profile.ownMobile || "",
    bloodGroup: profile.bloodGroup || "Unknown",
    primaryContact: profile.primaryContact || {
      name: "",
      relation: "Parent",
      phone: "",
    },
    medications: profile.medications || [],
    allergies: profile.allergies || [],
    illnesses: profile.illnesses || [],
    notes: profile.notes || "",
    address: profile.address || {
      flatHouse: "",
      streetLocality: "",
      cityDistrict: "",
      state: "Assam",
      pinCode: "",
    },
    abhaId: profile.abhaId || "",
    fieldVisibility: profile.fieldVisibility || DEFAULT_FIELD_VISIBILITY,
    createdAt: profile.createdAt || now,
    updatedAt: now,
  };

  // Only assign optional fields if they have truthy values to prevent Firestore undefined errors
  if (profile.linkedEmail && profile.linkedEmail.trim()) {
    finalProfile.linkedEmail = profile.linkedEmail.toLowerCase().trim();
  }
  if (profile.secondaryContact && profile.secondaryContact.name) {
    finalProfile.secondaryContact = profile.secondaryContact;
  }

  const cleanedData = removeUndefinedFields(finalProfile);
  const docRef = doc(db, COLLECTION_NAME, profileId);
  await setDoc(docRef, cleanedData, { merge: true });
  return finalProfile;
}

/**
 * Update an existing profile.
 */
export async function updateProfile(
  profileId: string,
  updates: Partial<EmProfile>
): Promise<void> {
  const db = getFirebaseDb("em-assist");
  const docRef = doc(db, COLLECTION_NAME, profileId);
  const cleanedUpdates = removeUndefinedFields({
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  await updateDoc(docRef, cleanedUpdates);
}

/**
 * Delete a profile.
 */
export async function deleteProfile(profileId: string): Promise<void> {
  const db = getFirebaseDb("em-assist");
  const docRef = doc(db, COLLECTION_NAME, profileId);
  await deleteDoc(docRef);
}

/**
 * Fetches all profiles associated with the user:
 * 1. Profiles owned directly by ownerUid
 * 2. Profiles linked to user's email (family sync: e.g. sibling who logged in)
 */
export function subscribeUserProfiles(
  ownerUid: string,
  userEmail: string | null | undefined,
  onUpdate: (profiles: EmProfile[]) => void
): () => void {
  const db = getFirebaseDb("em-assist");
  const profilesRef = collection(db, COLLECTION_NAME);

  // Realtime subscription on owned profiles
  const ownedQuery = query(profilesRef, where("ownerUid", "==", ownerUid));

  const unsubOwned = onSnapshot(
    ownedQuery,
    (ownedSnap) => {
      const ownedList: EmProfile[] = [];
      ownedSnap.forEach((d: any) => ownedList.push(d.data() as EmProfile));

      // If user has email, also query linked email for family member sync
      if (userEmail) {
        const normalizedEmail = userEmail.toLowerCase().trim();
        const linkedQuery = query(
          profilesRef,
          where("linkedEmail", "==", normalizedEmail)
        );
        getDocs(linkedQuery)
          .then((linkedSnap) => {
            const map = new Map<string, EmProfile>();
            ownedList.forEach((p) => map.set(p.id, p));
            linkedSnap.forEach((d) => {
              const p = d.data() as EmProfile;
              map.set(p.id, p);
            });
            onUpdate(Array.from(map.values()));
          })
          .catch(() => {
            onUpdate(ownedList);
          });
      } else {
        onUpdate(ownedList);
      }
    },
    (err) => {
      console.error("Error subscribing to user profiles:", err);
    }
  );

  return unsubOwned;
}

// Session-level memory cache for lightning-fast 0ms re-renders
const profileMemoryCache = new Map<string, { profile: EmProfile; fetchedAt: number }>();
const inFlightFetches = new Map<string, Promise<EmProfile | null>>();

function decodeFirestoreRestValue(val: any): any {
  if (!val || typeof val !== "object") return val;
  if ("stringValue" in val) return val.stringValue;
  if ("booleanValue" in val) return Boolean(val.booleanValue);
  if ("integerValue" in val) return Number(val.integerValue);
  if ("doubleValue" in val) return Number(val.doubleValue);
  if ("timestampValue" in val) return val.timestampValue;
  if ("nullValue" in val) return null;
  if ("arrayValue" in val) {
    const list = val.arrayValue?.values || [];
    return list.map(decodeFirestoreRestValue);
  }
  if ("mapValue" in val) {
    const obj: Record<string, any> = {};
    const fields = val.mapValue?.fields || {};
    for (const k of Object.keys(fields)) {
      obj[k] = decodeFirestoreRestValue(fields[k]);
    }
    return obj;
  }
  return val;
}

function parseFirestoreRestDoc(docJson: any): any {
  if (!docJson || !docJson.fields) return null;
  const result: Record<string, any> = {};
  for (const [key, valueObj] of Object.entries(docJson.fields)) {
    result[key] = decodeFirestoreRestValue(valueObj);
  }
  return result;
}

export function applyResponderPrivacyFilter(data: EmProfile): EmProfile {
  const vis = data.fieldVisibility || DEFAULT_FIELD_VISIBILITY;
  return {
    ...data,
    fullName: vis.fullName ? data.fullName : "Emergency Patient",
    bloodGroup: vis.bloodGroup ? data.bloodGroup : "Unknown",
    ownMobile: vis.ownMobile ? data.ownMobile : "",
    primaryContact: vis.primaryContact
      ? data.primaryContact
      : { name: "", relation: "", phone: "" },
    secondaryContact: vis.secondaryContact ? data.secondaryContact : undefined,
    medications: vis.medications ? data.medications : [],
    allergies: vis.allergies ? data.allergies : [],
    illnesses: vis.illnesses ? data.illnesses : [],
    notes: vis.notes ? data.notes : "",
    address: vis.address
      ? data.address
      : {
          flatHouse: "",
          streetLocality: "",
          cityDistrict: "",
          state: "",
          pinCode: "",
        },
    abhaId: vis.abhaId ? data.abhaId : "",
  };
}

/**
 * Ultra-fast Direct HTTP REST Fetcher.
 * Bypasses heavy Firebase WebChannel client SDK initialization.
 * Returns decoded profile in sub-second time directly from Google's edge.
 */
export async function fetchProfileViaDirectRest(profileId: string): Promise<EmProfile | null> {
  const cleanId = profileId.trim().toUpperCase();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const url = `https://firestore.googleapis.com/v1/projects/alokdasofficial/databases/(default)/documents/${COLLECTION_NAME}/${cleanId}`;
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-cache",
      headers: {
        Accept: "application/json",
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`REST fetch failed with status ${response.status}`);
    }

    const json = await response.json();
    const rawData = parseFirestoreRestDoc(json);
    if (!rawData || !rawData.id) return null;

    return applyResponderPrivacyFilter(rawData as EmProfile);
  } catch (err) {
    console.warn("Direct REST profile fetch note:", err);
    return null;
  }
}

/**
 * Standard SDK Fetcher.
 */
async function fetchProfileViaSdk(profileId: string): Promise<EmProfile | null> {
  try {
    const db = getFirebaseDb("em-assist");
    const docRef = doc(db, COLLECTION_NAME, profileId.trim().toUpperCase());
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return applyResponderPrivacyFilter(snap.data() as EmProfile);
  } catch (err) {
    console.warn("SDK profile fetch note:", err);
    return null;
  }
}

/**
 * High-Speed Dual-Channel Responder Profile Retrieval:
 * 1. Checks in-memory cache (0ms).
 * 2. Deduplicates simultaneous requests via inFlightFetches.
 * 3. Races direct Google Edge REST API against Firebase Client SDK.
 * 4. Yields the fastest response immediately to minimize critical time-to-treatment.
 */
export async function getProfileForResponder(
  profileId: string
): Promise<EmProfile | null> {
  const cleanId = profileId.trim().toUpperCase();
  if (!cleanId) return null;

  // 1. In-memory cache check (0ms)
  const cached = profileMemoryCache.get(cleanId);
  if (cached && Date.now() - cached.fetchedAt < 60000) {
    return cached.profile;
  }

  // 2. Check for an active in-flight request
  const existing = inFlightFetches.get(cleanId);
  if (existing) {
    return existing;
  }

  // 3. Initiate Dual-Channel Race
  const fetchPromise = (async () => {
    const restPromise = fetchProfileViaDirectRest(cleanId);
    const sdkPromise = fetchProfileViaSdk(cleanId);

    const winner = await new Promise<EmProfile | null>((resolve) => {
      let settledCount = 0;
      let resolved = false;

      const handleResult = (p: EmProfile | null) => {
        settledCount++;
        if (p && !resolved) {
          resolved = true;
          resolve(p);
        } else if (settledCount === 2 && !resolved) {
          resolve(null);
        }
      };

      restPromise.then(handleResult).catch(() => handleResult(null));
      sdkPromise.then(handleResult).catch(() => handleResult(null));
    });

    if (winner) {
      profileMemoryCache.set(cleanId, { profile: winner, fetchedAt: Date.now() });
    }
    inFlightFetches.delete(cleanId);
    return winner;
  })();

  inFlightFetches.set(cleanId, fetchPromise);
  return fetchPromise;
}

/**
 * Logs access by a responder with comprehensive metadata:
 * device, browser, OS, timestamp, geolocation (if granted), and authenticated identity.
 */
export async function logResponderAccess(
  profileId: string,
  responder: {
    uid?: string;
    displayName?: string | null;
    email?: string | null;
  } | null,
  deviceInfo: ResponderDeviceInfo,
  location?: ResponderGeoLocation
): Promise<string> {
  const db = getFirebaseDb("em-assist");
  const logsRef = collection(db, LOGS_COLLECTION);
  const now = new Date().toISOString();

  const accessRecord: Record<string, any> = {
    profileId: profileId.trim().toUpperCase(),
    timestamp: now,
    responderName: responder?.displayName || "Anonymous Responder",
    isAuthenticated: Boolean(responder?.uid),
    deviceInfo,
    createdServerTime: serverTimestamp(),
  };

  if (responder?.uid) {
    accessRecord.responderUid = responder.uid;
  }
  if (responder?.email) {
    accessRecord.responderEmail = responder.email;
  }
  if (location) {
    accessRecord.location = location;
  }

  const cleanedRecord = removeUndefinedFields(accessRecord);
  const docAdded = await addDoc(logsRef, cleanedRecord);
  return docAdded.id;
}

/**
 * Real-time listener for access logs on a specific emergency profile.
 * Normal users see real-time updates as soon as someone scans their QR code.
 */
export function subscribeToAccessLogs(
  profileId: string,
  onUpdate: (logs: AccessLog[]) => void
): () => void {
  const db = getFirebaseDb("em-assist");
  const logsRef = collection(db, LOGS_COLLECTION);
  const q = query(
    logsRef,
    where("profileId", "==", profileId.trim().toUpperCase()),
    orderBy("timestamp", "desc"),
    limit(50)
  );

  return onSnapshot(
    q,
    (snap) => {
      const logs: AccessLog[] = [];
      snap.forEach((d: any) => {
        logs.push({ id: d.id, ...(d.data() as Omit<AccessLog, "id">) });
      });
      onUpdate(logs);
    },
    (err) => {
      // If Firestore composite index is missing, fallback without orderBy
      const fallbackQuery = query(
        logsRef,
        where("profileId", "==", profileId.trim().toUpperCase()),
        limit(50)
      );
      return onSnapshot(fallbackQuery, (snap: any) => {
        const fallbackLogs: AccessLog[] = [];
        snap.forEach((d: any) => {
          fallbackLogs.push({ id: d.id, ...(d.data() as Omit<AccessLog, "id">) });
        });
        fallbackLogs.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
        onUpdate(fallbackLogs);
      });
    }
  );
}

/**
 * Client-side Device & Browser Inspector for logging access
 */
export function extractDeviceInfo(): ResponderDeviceInfo {
  if (typeof window === "undefined") {
    return {
      userAgent: "Server-side",
      timeZone: "UTC",
    };
  }

  const ua = navigator.userAgent;
  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let deviceType = "Desktop";

  if (/android/i.test(ua)) {
    deviceType = "Mobile (Android)";
    os = "Android";
  } else if (/iPad|iPhone|iPod/.test(ua)) {
    deviceType = "Mobile (iOS)";
    os = "iOS";
  } else if (/Windows/i.test(ua)) {
    os = "Windows";
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = "macOS";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
  }

  if (/Chrome|CriOS/i.test(ua) && !/Edg|OPR/i.test(ua)) {
    browser = "Chrome";
  } else if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) {
    browser = "Safari";
  } else if (/Firefox|FxiOS/i.test(ua)) {
    browser = "Firefox";
  } else if (/Edg/i.test(ua)) {
    browser = "Edge";
  }

  const timeZone =
    Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone ||
    "Asia/Kolkata";

  return {
    userAgent: ua,
    browser,
    os,
    deviceType,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timeZone,
    language: navigator.language,
  };
}
