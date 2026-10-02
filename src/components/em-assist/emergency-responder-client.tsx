"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  getProfileForResponder,
  logResponderAccess,
  extractDeviceInfo,
} from "@/lib/em-assist/em-service";
import {
  EmProfile,
  ResponderGeoLocation,
  INDIAN_EMERGENCY_SERVICES,
} from "@/types/em-assist";
import { getFirebaseAuth } from "@/lib/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateAuthProfile,
  onAuthStateChanged,
  User,
  signOut,
} from "firebase/auth";
import {
  HeartPulse,
  PhoneCall,
  MapPin,
  Pill,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Activity,
  LogIn,
  KeyRound,
  RotateCw,
  Stethoscope,
} from "lucide-react";

interface EmergencyResponderClientProps {
  initialProfileId?: string;
  initialData?: EmProfile | null;
}

export function EmergencyResponderClient({
  initialProfileId,
  initialData,
}: EmergencyResponderClientProps) {
  const params = useParams();

  // Robust ID extraction:
  // 1. explicit initialProfileId prop (from server component params.id)
  // 2. route params /u/[id]
  // 3. direct pathname parsing (window.location.pathname)
  let rawId = initialProfileId || (params?.id as string) || "";
  if (!rawId && typeof window !== "undefined") {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const uIdx = parts.indexOf("u");
    if (uIdx !== -1 && parts[uIdx + 1]) {
      rawId = parts[uIdx + 1];
    }
  }
  const profileId = decodeURIComponent(rawId).trim().toUpperCase();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<EmProfile | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [accessLogged, setAccessLogged] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>("Checking location...");

  // Auth state for address unlock
  const [responderName, setResponderName] = useState("");
  const [responderEmail, setResponderEmail] = useState("");
  const [responderPassword, setResponderPassword] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Fallback retry & search state
  const [retrying, setRetrying] = useState(false);
  const [manualIdInput, setManualIdInput] = useState("");

  const handleRetry = async () => {
    if (!profileId) return;
    setRetrying(true);
    setError(null);
    setLoading(true);
    try {
      const fetched = await getProfileForResponder(profileId);
      if (!fetched) {
        setError(`No emergency profile registered under ID: ${profileId}`);
      } else {
        setProfile(fetched);
      }
    } catch (err: any) {
      setError("Unable to connect to emergency database. Please verify internet access.");
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualIdInput.trim().toUpperCase();
    if (clean) {
      window.location.href = `/u/${encodeURIComponent(clean)}`;
    }
  };

  const hasLoggedRef = useRef(false);

  // Monitor auth state on em-assist firebase app
  useEffect(() => {
    try {
      const auth = getFirebaseAuth("em-assist");
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Auth initialization note:", e);
    }
  }, []);

  // Fetch emergency profile immediately on load (basic data is public in emergency)
  useEffect(() => {
    if (!profileId) return;

    // Strict zero-client retention policy:
    // Never persist emergency data into localStorage or sessionStorage
    try {
      sessionStorage.removeItem(`em_profile_${profileId}`);
      localStorage.removeItem(`em_profile_${profileId}`);
    } catch {}

    let isMounted = true;

    async function loadData() {
      try {
        if (!initialData) {
          setLoading(true);
        }
        const fetchedProfile = await getProfileForResponder(profileId);
        if (!isMounted) return;

        if (!fetchedProfile) {
          if (!profile) {
            setError(`No emergency profile found for ID: ${profileId}`);
          }
          setLoading(false);
          return;
        }

        setProfile(fetchedProfile);
        setLoading(false);

        // Log this access session immediately (records device, timestamp, and location)
        if (!hasLoggedRef.current) {
          hasLoggedRef.current = true;
          logAccess(fetchedProfile.id, currentUser);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Error loading emergency profile:", err);
        if (!profile) {
          setError("Unable to load profile. Please verify network connection.");
        }
        setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [profileId, initialData]);

  // If user signs in later (to unlock address), re-log with verified credentials
  useEffect(() => {
    if (currentUser && profile) {
      logAccess(profile.id, currentUser);
    }
  }, [currentUser]);

  // Handle Geolocation capture & logging
  const logAccess = (targetId: string, user: User | null) => {
    const deviceInfo = extractDeviceInfo();
    const responderInfo = user
      ? {
          uid: user.uid,
          displayName: user.displayName || user.email || "Authenticated Responder",
          email: user.email,
        }
      : null;

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const loc: ResponderGeoLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            isPermissionGranted: true,
          };
          setLocationStatus("GPS Location logged & shared with family.");
          await logResponderAccess(targetId, responderInfo, deviceInfo, loc);
          setAccessLogged(true);
        },
        async () => {
          setLocationStatus("GPS Location denied (device info logged).");
          const loc: ResponderGeoLocation = { isPermissionGranted: false };
          await logResponderAccess(targetId, responderInfo, deviceInfo, loc);
          setAccessLogged(true);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      logResponderAccess(targetId, responderInfo, deviceInfo, {
        isPermissionGranted: false,
      }).then(() => setAccessLogged(true));
    }
  };

  // Google Sign-In to unlock address
  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const auth = getFirebaseAuth("em-assist");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Google sign in error:", err);
      setAuthError(err.message || "Failed to sign in with Google.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Email/Password sign-in to unlock address
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responderEmail || !responderPassword) {
      setAuthError("Email and password are required.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    try {
      const auth = getFirebaseAuth("em-assist");
      try {
        await signInWithEmailAndPassword(auth, responderEmail, responderPassword);
      } catch (signInErr: any) {
        if (
          signInErr.code === "auth/user-not-found" ||
          signInErr.code === "auth/invalid-credential"
        ) {
          const userCred = await createUserWithEmailAndPassword(
            auth,
            responderEmail,
            responderPassword
          );
          if (responderName) {
            await updateAuthProfile(userCred.user, { displayName: responderName });
          }
        } else {
          throw signInErr;
        }
      }
    } catch (err: any) {
      console.error("Responder auth error:", err);
      setAuthError(err.message || "Authentication error.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    const auth = getFirebaseAuth("em-assist");
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      {/* Zero storage enforcement banner */}
      <div className="max-w-2xl mx-auto mb-4 flex items-center justify-between text-[11px] text-slate-400 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/60 backdrop-blur">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero-Retention Session</span>
        </div>
        {currentUser ? (
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-semibold truncate max-w-[140px]">
              {currentUser.displayName || currentUser.email}
            </span>
            <button
              onClick={handleSignOut}
              className="text-rose-400 hover:text-rose-300 underline font-medium"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <span className="text-[10px] text-slate-400 font-mono">
            {accessLogged ? "✓ Scan Logged" : locationStatus}
          </span>
        )}
      </div>

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Main Emergency Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 text-white p-4 sm:p-5 rounded-3xl shadow-xl flex items-center justify-between border-2 border-rose-400/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-2xl border border-white/20 p-1.5 shadow-lg flex items-center justify-center shrink-0">
              <img src="/em-assist-logo.png" alt="EM Assist Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-200">
                  EM Assist
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30 leading-none">
                  Beta
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">
                Emergency Profile
              </h1>
              <span className="text-xs font-mono text-rose-100">
                ID: {profileId}
              </span>
            </div>
          </div>

          {/* Quick Dial 112 */}
          <a
            href="tel:112"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-rose-700 rounded-2xl font-black text-xs sm:text-sm shadow hover:bg-rose-50 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <PhoneCall className="w-4 h-4 text-rose-600" />
            <span>Call 112</span>
          </a>
        </div>

        {loading && !profile && (
          <div className="space-y-4">
            <div className="bg-slate-800/90 border border-rose-500/40 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    Connecting Live Edge...
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Direct Helplines:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {INDIAN_EMERGENCY_SERVICES.slice(0, 4).map((svc) => (
                  <a
                    key={svc.number}
                    href={`tel:${svc.number}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 active:scale-95 transition-transform"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
                    <span>{svc.label} ({svc.number})</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Skeleton Pulse Cards */}
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4 animate-pulse">
              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-slate-700 rounded" />
                  <div className="h-7 w-40 bg-slate-700 rounded-lg" />
                </div>
                <div className="h-10 w-16 bg-rose-900/60 rounded-2xl" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="h-20 bg-slate-900/80 rounded-2xl border border-slate-700/60" />
                <div className="h-20 bg-slate-900/80 rounded-2xl border border-slate-700/60" />
              </div>
            </div>
          </div>
        )}

        {/* Generous Emergency Fallback when profile data is not available */}
        {!loading && !profile && (
          <div className="space-y-5">
            {/* 1. Clean Notice Card */}
            <div className="bg-slate-800 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Profile Unavailable ({profileId || "N/A"})</span>
                </div>
                <span className="text-[11px] text-slate-400">Offline or Unregistered</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Patient record could not be loaded. Use official emergency helplines below for immediate dispatch:
              </p>

              {/* Compact Triage Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-slate-900/80 px-2.5 py-2 rounded-xl border border-slate-700/60">
                  <div className="font-bold text-emerald-400">1. Airway</div>
                  <div className="text-slate-400 text-[10px]">Check breathing</div>
                </div>
                <div className="bg-slate-900/80 px-2.5 py-2 rounded-xl border border-slate-700/60">
                  <div className="font-bold text-rose-400">2. Bleeding</div>
                  <div className="text-slate-400 text-[10px]">Direct pressure</div>
                </div>
                <div className="bg-slate-900/80 px-2.5 py-2 rounded-xl border border-slate-700/60">
                  <div className="font-bold text-amber-400">3. Spine</div>
                  <div className="text-slate-400 text-[10px]">Keep neck steady</div>
                </div>
                <div className="bg-slate-900/80 px-2.5 py-2 rounded-xl border border-slate-700/60">
                  <div className="font-bold text-sky-400">4. Reassure</div>
                  <div className="text-slate-400 text-[10px]">Keep warm &amp; calm</div>
                </div>
              </div>

              {/* Action Buttons: Retry & Manual Search */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={retrying}
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${retrying ? "animate-spin text-rose-400" : ""}`} />
                  <span>{retrying ? "Retrying..." : "Retry"}</span>
                </button>

                <form onSubmit={handleManualSearch} className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={manualIdInput}
                    onChange={(e) => setManualIdInput(e.target.value)}
                    placeholder="Search other ID (e.g. EM-XXXX)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

            {/* 2. Helplines Grid */}
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-500" />
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Emergency Helplines
                  </h3>
                </div>
                <span className="text-[10px] text-rose-400 font-bold">24x7 Direct Dial</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {INDIAN_EMERGENCY_SERVICES.map((svc) => (
                  <a
                    key={svc.number}
                    href={`tel:${svc.number}`}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-700 border border-slate-700/80 hover:border-rose-500/50 shadow transition-all group active:scale-[0.98]"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="text-xs font-bold text-white group-hover:text-rose-200 transition-colors">
                        {svc.label}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {svc.desc}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-600 group-hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow transition-colors flex-shrink-0">
                      <PhoneCall className="w-3 h-3" />
                      <span>{svc.number}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {profile && (
          <div className="space-y-5">
            {/* 1. Triage Primary Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Patient
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {profile.fullName || "Emergency Patient"}
                  </h2>
                  {profile.ownMobile && (
                    <p className="text-xs text-slate-300 font-semibold mt-0.5">
                      Tel:{" "}
                      <a
                        href={`tel:${profile.ownMobile}`}
                        className="text-rose-400 underline font-mono"
                      >
                        {profile.ownMobile}
                      </a>
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Blood Group
                  </span>
                  <span className="text-2xl sm:text-3xl font-black px-4 py-1 rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-600/30">
                    {profile.bloodGroup || "Unknown"}
                  </span>
                </div>
              </div>

              {/* Emergency Contacts Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-500" />
                  <span>Emergency Contacts</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Primary Contact */}
                  {profile.primaryContact?.phone ? (
                    <div className="bg-slate-900/90 border-2 border-rose-500/40 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">
                          Primary ({profile.primaryContact.relation || "Contact"})
                        </span>
                        <div className="font-bold text-base text-white mt-1">
                          {profile.primaryContact.name || "Primary Contact"}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {profile.primaryContact.phone}
                        </div>
                      </div>
                      <a
                        href={`tel:${profile.primaryContact.phone}`}
                        className="flex items-center justify-center gap-2 w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Primary</span>
                      </a>
                    </div>
                  ) : (
                    <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-4 text-xs text-slate-400 italic">
                      Primary contact not configured.
                    </div>
                  )}

                  {/* Secondary Contact */}
                  {profile.secondaryContact?.phone ? (
                    <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                          Secondary ({profile.secondaryContact.relation || "Contact"})
                        </span>
                        <div className="font-bold text-base text-white mt-1">
                          {profile.secondaryContact.name || "Secondary Contact"}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {profile.secondaryContact.phone}
                        </div>
                      </div>
                      <a
                        href={`tel:${profile.secondaryContact.phone}`}
                        className="flex items-center justify-center gap-2 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Secondary</span>
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* 2. Indian Address Section (LOCKED until Signed In) */}
              <div className="pt-4 border-t border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Address</span>
                  </h3>
                  {currentUser ? (
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <Lock className="w-3 h-3" />
                      Sign-In Required
                    </span>
                  )}
                </div>

                {/* Case A: Responder IS Signed In */}
                {currentUser ? (
                  profile.address?.cityDistrict ? (
                    <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-xs sm:text-sm text-slate-200">
                        <div>
                          {profile.address.flatHouse} {profile.address.streetLocality}
                        </div>
                        {profile.address.landmark && (
                          <div className="text-xs text-slate-400">
                            Landmark: {profile.address.landmark}
                          </div>
                        )}
                        <div className="text-xs font-semibold text-slate-300 mt-0.5">
                          {profile.address.cityDistrict}, {profile.address.state} — {profile.address.pinCode}
                        </div>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${profile.address.flatHouse} ${profile.address.streetLocality} ${profile.address.cityDistrict} ${profile.address.state} ${profile.address.pinCode}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-600 transition-colors whitespace-nowrap"
                      >
                        <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Open Maps</span>
                      </a>
                    </div>
                  ) : (
                    <div className="bg-slate-900/60 border border-slate-700/60 p-3 rounded-2xl text-xs text-slate-400 italic">
                      Address not provided or hidden.
                    </div>
                  )
                ) : (
                  /* Case B: Responder is NOT Signed In -> Clean, compact Lock Card */
                  <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 flex-shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          Address Protected
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Sign in to view address &amp; directions. Medical vitals are public above.
                        </p>
                      </div>
                    </div>

                    {authError && (
                      <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{authError}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={authLoading}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-bold text-xs shadow transition-all active:scale-[0.99] disabled:opacity-50"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.99 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                          />
                        </svg>
                        <span>Sign in with Google</span>
                      </button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setShowEmailForm(!showEmailForm)}
                          className="text-[11px] text-slate-400 hover:text-white underline font-medium"
                        >
                          {showEmailForm ? "Hide email login" : "Or use email login"}
                        </button>
                      </div>

                      {showEmailForm && (
                        <form onSubmit={handleEmailSignIn} className="space-y-2 pt-2 border-t border-slate-800">
                          <input
                            type="text"
                            value={responderName}
                            onChange={(e) => setResponderName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                          />
                          <input
                            type="email"
                            required
                            value={responderEmail}
                            onChange={(e) => setResponderEmail(e.target.value)}
                            placeholder="Email address"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                          />
                          <input
                            type="password"
                            required
                            value={responderPassword}
                            onChange={(e) => setResponderPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
                          />
                          <button
                            type="submit"
                            disabled={authLoading}
                            className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs shadow transition-all disabled:opacity-50"
                          >
                            {authLoading ? "Verifying..." : "Unlock Address"}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Critical Medical Alerts Card */}
            {(profile.allergies?.length > 0 ||
              profile.illnesses?.length > 0 ||
              profile.medications?.length > 0 ||
              profile.notes) && (
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-500" />
                  <span>Medical Alerts &amp; Conditions</span>
                </h3>

                {/* Allergies Alert */}
                {profile.allergies?.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Allergies</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.allergies.map((allergy, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 bg-rose-600/30 border border-rose-500 text-rose-200 text-xs font-bold rounded-lg"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ongoing Medications */}
                {profile.medications?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Medications</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {profile.medications.map((med, i) => (
                        <div
                          key={i}
                          className="bg-slate-900/90 border border-slate-700/80 p-2.5 rounded-xl"
                        >
                          <div className="font-bold text-xs text-white">
                            {med.name}
                          </div>
                          <div className="text-[11px] text-slate-300">
                            {med.dosage} &bull; {med.frequency}
                          </div>
                          {med.instructions && (
                            <div className="text-[10px] text-slate-400 italic">
                              {med.instructions}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Known Illnesses / Diagnoses */}
                {profile.illnesses?.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Pre-existing Conditions
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.illnesses.map((ill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 bg-slate-900 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg"
                        >
                          {ill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {profile.notes && (
                  <div className="space-y-1 bg-slate-900/90 p-3 rounded-2xl border border-slate-700">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Notes</span>
                    </h4>
                    <p className="text-xs text-slate-200 italic">
                      "{profile.notes}"
                    </p>
                  </div>
                )}

                {profile.abhaId && (
                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-700 flex items-center justify-between">
                    <span>ABHA ID:</span>
                    <span className="font-mono font-bold text-slate-200">{profile.abhaId}</span>
                  </div>
                )}
              </div>
            )}

            {/* 3. Indian Emergency Helplines Direct Dials */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-4 sm:p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Emergency Helplines
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INDIAN_EMERGENCY_SERVICES.slice(0, 4).map((svc) => (
                  <a
                    key={svc.number}
                    href={`tel:${svc.number}`}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-700 border border-slate-700/60 transition-all text-center"
                  >
                    <span className="text-base font-black text-rose-400">
                      {svc.number}
                    </span>
                    <span className="text-[11px] font-bold text-slate-200 truncate max-w-full">
                      {svc.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
