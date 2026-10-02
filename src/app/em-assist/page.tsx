"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  saveProfile,
  updateProfile,
  deleteProfile,
  subscribeUserProfiles,
  subscribeToAccessLogs,
  generateEmId,
  DEFAULT_FIELD_VISIBILITY,
} from "@/lib/em-assist/em-service";
import {
  EmProfile,
  AccessLog,
  IndianRelation,
  EmBloodGroup,
  INDIAN_STATES_AND_UTS,
  MedicationItem,
} from "@/types/em-assist";
import { getFirebaseAuth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from "firebase/auth";
import { QrPrintLayouts } from "@/components/em-assist/qr-print-layouts";
import {
  HeartPulse,
  User as UserIcon,
  Users,
  Shield,
  Eye,
  EyeOff,
  QrCode,
  History,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Pill,
  ExternalLink,
  Lock,
  LogOut,
  Mail,
  Smartphone,
  PhoneCall,
  Clock,
  Navigation,
  Globe,
  RefreshCw,
  Sparkles,
  Vote,
  ArrowRight,
} from "lucide-react";

export default function EmAssistPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  // Profiles State
  const [profiles, setProfiles] = useState<EmProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"edit" | "qr" | "logs">("edit");
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);

  // Form State for Active Profile
  const [formData, setFormData] = useState<Partial<EmProfile>>({});
  const [newMedName, setNewMedName] = useState("");
  const [newMedDose, setNewMedDose] = useState("");
  const [newMedFreq, setNewMedFreq] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newIllness, setNewIllness] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Monitor Authentication
  useEffect(() => {
    try {
      const auth = getFirebaseAuth("em-assist");
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setAuthLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Auth initialization note:", e);
      setAuthLoading(false);
    }
  }, []);

  // Subscribe to User Profiles
  useEffect(() => {
    if (!currentUser) {
      setProfiles([]);
      return;
    }

    const unsubscribe = subscribeUserProfiles(
      currentUser.uid,
      currentUser.email,
      (fetchedProfiles) => {
        setProfiles(fetchedProfiles);
        if (fetchedProfiles.length > 0) {
          // If no active profile selected, or previous active was removed, default to first
          setActiveProfileId((prev) => {
            if (!prev || !fetchedProfiles.some((p) => p.id === prev)) {
              return fetchedProfiles[0].id;
            }
            return prev;
          });
        }
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Sync Form State with Active Profile
  useEffect(() => {
    if (!activeProfileId) {
      setFormData({});
      return;
    }
    const current = profiles.find((p) => p.id === activeProfileId);
    if (current) {
      setFormData({ ...current });
    }
  }, [activeProfileId, profiles]);

  // Subscribe to Realtime Access Logs for Active Profile
  useEffect(() => {
    if (!activeProfileId) {
      setAccessLogs([]);
      return;
    }

    const unsubscribe = subscribeToAccessLogs(activeProfileId, (logs) => {
      setAccessLogs(logs);
    });

    return () => unsubscribe();
  }, [activeProfileId]);

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setAuthError("");
    try {
      const auth = getFirebaseAuth("em-assist");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setAuthError(err.message || "Failed to sign in with Google.");
    }
  };

  const handleSignOut = async () => {
    const auth = getFirebaseAuth("em-assist");
    await signOut(auth);
    setProfiles([]);
    setActiveProfileId("");
  };

  // Create New Profile
  const handleCreateNewProfile = async (relation: IndianRelation = "Self") => {
    if (!currentUser) return;
    const newId = generateEmId();
    const newProfile: Partial<EmProfile> = {
      id: newId,
      ownerUid: currentUser.uid,
      ownerEmail: currentUser.email || "",
      fullName: relation === "Self" ? currentUser.displayName || "My Profile" : `Family Member (${relation})`,
      relation,
      label: relation === "Self" ? "Self (Primary)" : relation,
      ownMobile: "",
      bloodGroup: "Unknown",
      primaryContact: {
        name: "",
        relation: "Father",
        phone: "",
      },
      medications: [],
      allergies: [],
      illnesses: [],
      notes: "",
      address: {
        flatHouse: "",
        streetLocality: "",
        landmark: "",
        cityDistrict: "",
        state: "Assam",
        pinCode: "",
      },
      fieldVisibility: DEFAULT_FIELD_VISIBILITY,
    };

    setSaving(true);
    try {
      const saved = await saveProfile(newProfile as any);
      setActiveProfileId(saved.id);
      setActiveTab("edit");
    } catch (err) {
      console.error("Error creating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  // Save Profile Changes
  const handleSaveProfile = async () => {
    if (!currentUser || !formData.id) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      await saveProfile({
        ...formData,
        ownerUid: currentUser.uid,
        ownerEmail: currentUser.email || "",
        fullName: formData.fullName || "Emergency Patient",
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile. Please check connection.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Active Profile
  const handleDeleteActiveProfile = async () => {
    if (!formData.id) return;
    if (confirm(`Are you sure you want to delete profile "${formData.label || formData.id}"? This action cannot be undone.`)) {
      try {
        await deleteProfile(formData.id);
      } catch (err) {
        console.error("Error deleting profile:", err);
      }
    }
  };

  // Toggle Field Visibility Helper
  const toggleVisibility = (field: keyof typeof DEFAULT_FIELD_VISIBILITY) => {
    setFormData((prev) => ({
      ...prev,
      fieldVisibility: {
        ...DEFAULT_FIELD_VISIBILITY,
        ...prev.fieldVisibility,
        [field]: !prev.fieldVisibility?.[field],
      },
    }));
  };

  // Add Medication
  const handleAddMedication = () => {
    if (!newMedName.trim()) return;
    const item: MedicationItem = {
      name: newMedName.trim(),
      dosage: newMedDose.trim() || "As advised",
      frequency: newMedFreq.trim() || "Daily",
    };
    setFormData((prev) => ({
      ...prev,
      medications: [...(prev.medications || []), item],
    }));
    setNewMedName("");
    setNewMedDose("");
    setNewMedFreq("");
  };

  const handleRemoveMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications?.filter((_, i) => i !== index),
    }));
  };

  // Add Allergy
  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;
    setFormData((prev) => ({
      ...prev,
      allergies: [...(prev.allergies || []), newAllergy.trim()],
    }));
    setNewAllergy("");
  };

  const handleRemoveAllergy = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies?.filter((_, i) => i !== index),
    }));
  };

  // Add Illness
  const handleAddIllness = () => {
    if (!newIllness.trim()) return;
    setFormData((prev) => ({
      ...prev,
      illnesses: [...(prev.illnesses || []), newIllness.trim()],
    }));
    setNewIllness("");
  };

  const handleRemoveIllness = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      illnesses: prev.illnesses?.filter((_, i) => i !== index),
    }));
  };

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  // Authentication Loading State
  if (authLoading) {
    return (
      <div className="py-24 container mx-auto px-4 text-center max-w-md space-y-4">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Initializing EM Assist Platform...</p>
      </div>
    );
  }

  // If NOT Logged In: Show Auth Landing Screen
  if (!currentUser) {
    return (
      <div className="py-16 md:py-24 container mx-auto px-4 max-w-lg">
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto shadow-xl border border-border/80 p-2.5">
              <img src="/em-assist-logo.png" alt="EM Assist Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                EM Assist
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                Beta
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              India&apos;s dynamic emergency medical identity &amp; real-time responder protection network.
            </p>
          </div>

          <div className="p-4 bg-muted/60 border border-border rounded-2xl text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Shield className="w-4 h-4 text-rose-600" />
              <span>Built for High Security &amp; Dynamic Privacy</span>
            </div>
            <ul className="text-muted-foreground space-y-1 pl-6 list-disc">
              <li>Permanent static QR code pointing to <code>/u/{'{userId}'}</code></li>
              <li>Dynamic real-time cloud data synced across family</li>
              <li>Granular visibility toggles on every medical field</li>
              <li>Live alerts &amp; coordinates when someone views your data</li>
            </ul>
          </div>

          {/* Survey Banner on Landing Screen */}
          <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-background to-rose-500/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                <Vote className="w-4 h-4" />
                <span>EM ASSIST IDEA VALIDATION SURVEY</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Help validate and steer India&apos;s emergency medical identity network. 2-minute public survey.
              </p>
            </div>
            <Link
              href="/polls/em-assist"
              className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>Take Survey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {authError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs rounded-xl">
              {authError}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-background border border-border hover:bg-muted text-foreground rounded-2xl font-bold text-sm shadow-sm transition-all hover:border-primary/50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
            </button>
            <p className="text-center text-[12px] text-muted-foreground">
              One-click instant authentication via Google. No passwords required.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Logged In Dashboard View
  return (
    <div className="py-8 md:py-12 container mx-auto px-4 max-w-6xl space-y-8">
      {/* Community Idea Validation Survey Banner */}
      <div className="rounded-3xl border border-rose-500/25 bg-gradient-to-r from-rose-500/10 via-card to-rose-500/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-600 dark:text-rose-400">
            <Vote className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-foreground">
                We&apos;re validating EM Assist with early community members
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                Beta Survey
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your feedback directly shapes emergency responder features, printable card layouts, and privacy controls. Takes under 2 minutes.
            </p>
          </div>
        </div>
        <Link
          href="/polls/em-assist"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm transition-all"
        >
          <span>Share Feedback</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Top Header & Account Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-card border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-2xl border border-border/80 p-1.5 shadow-md flex items-center justify-center shrink-0">
            <img src="/em-assist-logo.png" alt="EM Assist Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-foreground">EM Assist Manager</h1>
              <span className="text-[10px] font-extrabold uppercase tracking-wide bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full">
                Beta
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Logged in as <strong className="text-foreground">{currentUser.email || currentUser.displayName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleCreateNewProfile("Self")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Profile</span>
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Profile Selector Strip (Self, Parents, Siblings, Pets) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-600" />
            <span>Managed Family &amp; Dependent Profiles</span>
          </h2>
          <span className="text-xs text-muted-foreground">
            {profiles.length} profile{profiles.length === 1 ? "" : "s"} linked
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {profiles.map((p) => {
            const isActive = p.id === activeProfileId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveProfileId(p.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20"
                    : "bg-card border-border text-foreground hover:border-slate-400"
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>{p.label || p.fullName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {p.bloodGroup}
                </span>
              </button>
            );
          })}

          {profiles.length === 0 && (
            <div className="p-4 rounded-2xl bg-muted/40 border border-dashed border-border w-full text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                No emergency profiles created yet. Create your first profile to generate your dynamic emergency QR.
              </p>
              <button
                onClick={() => handleCreateNewProfile("Self")}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow"
              >
                Create My First Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {activeProfile && (
        <div className="space-y-6">
          {/* Main Action Tabs: Edit Details | QR & Print Studio | Live Access Logs */}
          <div className="flex border-b border-border gap-2">
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-2 px-4 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "edit"
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>Edit Details &amp; Privacy Toggles</span>
            </button>
            <button
              onClick={() => setActiveTab("qr")}
              className={`flex items-center gap-2 px-4 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "qr"
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code &amp; 4 Print Layouts</span>
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-2 px-4 py-3 font-bold text-sm border-b-2 transition-all ${
                activeTab === "logs"
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Live Responder Access Logs</span>
              {accessLogs.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-600 text-white font-black">
                  {accessLogs.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: EDIT PROFILE & PRIVACY TOGGLES */}
          {activeTab === "edit" && (
            <div className="space-y-6">
              {/* Profile Identity Card */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
                  <div>
                    <h3 className="text-lg font-black text-foreground">
                      Emergency Profile Identity
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      ID: <span className="font-mono font-bold text-foreground">{formData.id}</span> • Dynamic URL:{" "}
                      <a
                        href={`/u/${formData.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-rose-600 underline font-mono inline-flex items-center gap-0.5"
                      >
                        alokdasofficial.in/u/{formData.id}
                        <ExternalLink className="w-3 h-3 inline" />
                      </a>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {saveSuccess && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Saved!
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? "Saving..." : "Save Changes"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteActiveProfile}
                      className="p-2 border border-border text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Basic Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                      Profile Label / Name
                    </label>
                    <input
                      type="text"
                      value={formData.label || ""}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="e.g. Alok (Self) or Mom"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                      Relationship
                    </label>
                    <select
                      value={formData.relation || "Self"}
                      onChange={(e) => setFormData({ ...formData, relation: e.target.value as IndianRelation })}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                    >
                      <option value="Self">Self (Primary)</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Grandparent">Grandparent</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Pet">Pet (Dog/Cat)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-muted-foreground uppercase">
                        Family Auto-Sync Email
                      </label>
                      <span className="text-[10px] text-rose-600 font-semibold">Shared Sync</span>
                    </div>
                    <input
                      type="email"
                      value={formData.linkedEmail || ""}
                      onChange={(e) => setFormData({ ...formData, linkedEmail: e.target.value })}
                      placeholder="sibling@gmail.com"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      When this person logs in with this email, this profile automatically syncs with them!
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-muted-foreground uppercase">
                        Full Legal Name
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleVisibility("fullName")}
                        className={`text-[10px] flex items-center gap-1 font-semibold ${
                          formData.fieldVisibility?.fullName ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        {formData.fieldVisibility?.fullName ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {formData.fieldVisibility?.fullName ? "Visible" : "Hidden"}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.fullName || ""}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Full Name"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-muted-foreground uppercase">
                        Blood Group
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleVisibility("bloodGroup")}
                        className={`text-[10px] flex items-center gap-1 font-semibold ${
                          formData.fieldVisibility?.bloodGroup ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        {formData.fieldVisibility?.bloodGroup ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {formData.fieldVisibility?.bloodGroup ? "Visible" : "Hidden"}
                      </button>
                    </div>
                    <select
                      value={formData.bloodGroup || "Unknown"}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as EmBloodGroup })}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm font-bold text-rose-600 focus:outline-none focus:border-rose-500"
                    >
                      <option value="Unknown">Unknown / Not Tested</option>
                      <option value="A+">A+ (A Positive)</option>
                      <option value="A-">A- (A Negative)</option>
                      <option value="B+">B+ (B Positive)</option>
                      <option value="B-">B- (B Negative)</option>
                      <option value="AB+">AB+ (AB Positive)</option>
                      <option value="AB-">AB- (AB Negative)</option>
                      <option value="O+">O+ (O Positive)</option>
                      <option value="O-">O- (O Negative)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-muted-foreground uppercase">
                        Own Mobile Number (+91)
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleVisibility("ownMobile")}
                        className={`text-[10px] flex items-center gap-1 font-semibold ${
                          formData.fieldVisibility?.ownMobile ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        {formData.fieldVisibility?.ownMobile ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {formData.fieldVisibility?.ownMobile ? "Visible" : "Hidden"}
                      </button>
                    </div>
                    <input
                      type="tel"
                      value={formData.ownMobile || ""}
                      onChange={(e) => setFormData({ ...formData, ownMobile: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contacts Section */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-base font-black text-foreground flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-rose-600" />
                    <span>Emergency Contacts (Maximum of 2)</span>
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    First responders call these directly in an emergency
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary Contact */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-rose-600">
                        Primary Emergency Contact
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleVisibility("primaryContact")}
                        className={`text-[10px] flex items-center gap-1 font-semibold ${
                          formData.fieldVisibility?.primaryContact ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        {formData.fieldVisibility?.primaryContact ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {formData.fieldVisibility?.primaryContact ? "Visible" : "Hidden"}
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        value={formData.primaryContact?.name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            primaryContact: {
                              ...formData.primaryContact!,
                              name: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. Ramesh Das"
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                          Relationship
                        </label>
                        <select
                          value={formData.primaryContact?.relation || "Parent"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              primaryContact: {
                                ...formData.primaryContact!,
                                relation: e.target.value,
                              },
                            })
                          }
                          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                        >
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Brother">Brother</option>
                          <option value="Sister">Sister</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Doctor">Doctor</option>
                          <option value="Friend">Friend</option>
                          <option value="Neighbor">Neighbor</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                          Phone Number (+91)
                        </label>
                        <input
                          type="tel"
                          value={formData.primaryContact?.phone || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              primaryContact: {
                                ...formData.primaryContact!,
                                phone: e.target.value,
                              },
                            })
                          }
                          placeholder="+91 98765 43210"
                          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Secondary Contact */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-foreground">
                        Secondary Emergency Contact
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleVisibility("secondaryContact")}
                        className={`text-[10px] flex items-center gap-1 font-semibold ${
                          formData.fieldVisibility?.secondaryContact ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        {formData.fieldVisibility?.secondaryContact ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {formData.fieldVisibility?.secondaryContact ? "Visible" : "Hidden"}
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        value={formData.secondaryContact?.name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            secondaryContact: {
                              name: e.target.value,
                              relation: formData.secondaryContact?.relation || "Family",
                              phone: formData.secondaryContact?.phone || "",
                            },
                          })
                        }
                        placeholder="e.g. Anjali Sharma"
                        className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                          Relationship
                        </label>
                        <select
                          value={formData.secondaryContact?.relation || "Family"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              secondaryContact: {
                                name: formData.secondaryContact?.name || "",
                                relation: e.target.value,
                                phone: formData.secondaryContact?.phone || "",
                              },
                            })
                          }
                          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                        >
                          <option value="Mother">Mother</option>
                          <option value="Father">Father</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Brother">Brother</option>
                          <option value="Sister">Sister</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Doctor">Doctor</option>
                          <option value="Friend">Friend</option>
                          <option value="Neighbor">Neighbor</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                          Phone Number (+91)
                        </label>
                        <input
                          type="tel"
                          value={formData.secondaryContact?.phone || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              secondaryContact: {
                                name: formData.secondaryContact?.name || "",
                                relation: formData.secondaryContact?.relation || "Family",
                                phone: e.target.value,
                              },
                            })
                          }
                          placeholder="+91 98765 43210"
                          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information (Medications, Allergies, Illnesses, Notes) */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-base font-black text-foreground flex items-center gap-2">
                    <Pill className="w-5 h-5 text-rose-600" />
                    <span>Medical Conditions &amp; On-going Medications</span>
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Vital clinical alerts for paramedics and doctors
                  </span>
                </div>

                {/* Critical Allergies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Known Allergies (Food, Drug, Environmental)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleVisibility("allergies")}
                      className={`text-[10px] flex items-center gap-1 font-semibold ${
                        formData.fieldVisibility?.allergies ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {formData.fieldVisibility?.allergies ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {formData.fieldVisibility?.allergies ? "Visible to Responder" : "Hidden"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="e.g. Penicillin, Peanuts, Sulfa Drugs"
                      className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAllergy())}
                    />
                    <button
                      type="button"
                      onClick={handleAddAllergy}
                      className="px-3.5 py-2 bg-muted hover:bg-slate-200 dark:hover:bg-slate-800 text-foreground rounded-xl text-xs font-bold transition-colors"
                    >
                      Add Allergy
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.allergies?.map((allergy, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold"
                      >
                        <span>{allergy}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAllergy(i)}
                          className="hover:text-rose-900 dark:hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {(!formData.allergies || formData.allergies.length === 0) && (
                      <span className="text-xs text-muted-foreground italic">No allergies listed.</span>
                    )}
                  </div>
                </div>

                {/* On-going Medications */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      On-going Medications (Daily Prescriptions)
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleVisibility("medications")}
                      className={`text-[10px] flex items-center gap-1 font-semibold ${
                        formData.fieldVisibility?.medications ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {formData.fieldVisibility?.medications ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {formData.fieldVisibility?.medications ? "Visible to Responder" : "Hidden"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      placeholder="Medicine name (e.g. Metformin)"
                      className="sm:col-span-2 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                    />
                    <input
                      type="text"
                      value={newMedDose}
                      onChange={(e) => setNewMedDose(e.target.value)}
                      placeholder="Dosage (500mg)"
                      className="bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMedFreq}
                        onChange={(e) => setNewMedFreq(e.target.value)}
                        placeholder="Twice daily"
                        className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddMedication}
                        className="px-3 py-2 bg-muted hover:bg-slate-200 dark:hover:bg-slate-800 text-foreground rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {formData.medications?.map((med, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border text-xs"
                      >
                        <div>
                          <strong className="text-foreground">{med.name}</strong>
                          <span className="text-muted-foreground ml-2">
                            {med.dosage} • {med.frequency}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(i)}
                          className="text-muted-foreground hover:text-rose-600 text-base px-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diagnosed Illnesses */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      Known Illnesses / Diagnoses / Pre-existing Conditions
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleVisibility("illnesses")}
                      className={`text-[10px] flex items-center gap-1 font-semibold ${
                        formData.fieldVisibility?.illnesses ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {formData.fieldVisibility?.illnesses ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {formData.fieldVisibility?.illnesses ? "Visible to Responder" : "Hidden"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newIllness}
                      onChange={(e) => setNewIllness(e.target.value)}
                      placeholder="e.g. Asthma, Type-2 Diabetes, Hypertension, Epilepsy"
                      className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddIllness())}
                    />
                    <button
                      type="button"
                      onClick={handleAddIllness}
                      className="px-3.5 py-2 bg-muted hover:bg-slate-200 dark:hover:bg-slate-800 text-foreground rounded-xl text-xs font-bold transition-colors"
                    >
                      Add Illness
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.illnesses?.map((ill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-muted border border-border text-xs font-semibold text-foreground"
                      >
                        <span>{ill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIllness(i)}
                          className="hover:text-rose-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Special Emergency Notes */}
                <div className="space-y-2 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      Special First Responder Instructions / Notes
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleVisibility("notes")}
                      className={`text-[10px] flex items-center gap-1 font-semibold ${
                        formData.fieldVisibility?.notes ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {formData.fieldVisibility?.notes ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {formData.fieldVisibility?.notes ? "Visible to Responder" : "Hidden"}
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Has pacemaker. Carry emergency inhaler in backpack. Severe bee sting reaction."
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Indian Address & ABHA ID */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rose-600" />
                    <h3 className="text-base font-black text-foreground">
                      Residential Address &amp; Indian National Health ID
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleVisibility("address")}
                    className={`text-[10px] flex items-center gap-1 font-semibold ${
                      formData.fieldVisibility?.address ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    {formData.fieldVisibility?.address ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {formData.fieldVisibility?.address ? "Visible to Responder" : "Hidden"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      House / Flat / Building
                    </label>
                    <input
                      type="text"
                      value={formData.address?.flatHouse || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address!, flatHouse: e.target.value },
                        })
                      }
                      placeholder="e.g. Flat 302, Green Valley Apartments"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Street / Locality / Sector
                    </label>
                    <input
                      type="text"
                      value={formData.address?.streetLocality || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address!, streetLocality: e.target.value },
                        })
                      }
                      placeholder="e.g. College Road, Ward No. 4"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.address?.landmark || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address!, landmark: e.target.value },
                        })
                      }
                      placeholder="Near Rabindranath Tagore University"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      City / District / Town
                    </label>
                    <input
                      type="text"
                      value={formData.address?.cityDistrict || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address!, cityDistrict: e.target.value },
                        })
                      }
                      placeholder="e.g. Hojai / Guwahati"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      State / Union Territory
                    </label>
                    <select
                      value={formData.address?.state || "Assam"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address!, state: e.target.value },
                        })
                      }
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-rose-500"
                    >
                      {INDIAN_STATES_AND_UTS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      PIN Code (6 digits)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.address?.pinCode || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address!, pinCode: e.target.value },
                        })
                      }
                      placeholder="782435"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-muted-foreground">
                      ABHA ID (Ayushman Bharat Health Account)
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleVisibility("abhaId")}
                      className={`text-[10px] flex items-center gap-1 font-semibold ${
                        formData.fieldVisibility?.abhaId ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {formData.fieldVisibility?.abhaId ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {formData.fieldVisibility?.abhaId ? "Visible" : "Hidden"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.abhaId || ""}
                    onChange={(e) => setFormData({ ...formData, abhaId: e.target.value })}
                    placeholder="14-digit ABHA number (e.g. 91-1234-5678-9012)"
                    className="w-full max-w-sm bg-background border border-border rounded-xl px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border shadow-md">
                <span className="text-xs text-muted-foreground">
                  Permanent QR points to: <code className="text-foreground">https://alokdasofficial.in/u/{formData.id}</code>
                </span>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-sm shadow transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving Changes..." : "Save All Changes"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: QR CODE & 4 PRINT LAYOUTS */}
          {activeTab === "qr" && (
            <QrPrintLayouts profile={activeProfile} />
          )}

          {/* TAB 3: REAL-TIME ACCESS LOGS & RESPONDER AUDIT */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-card border border-border shadow-sm">
                <div>
                  <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                    <Shield className="w-5 h-5 text-rose-600" />
                    <span>Real-Time Responder Access Audit</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Live record of responders scanning or viewing emergency profile ID:{" "}
                    <strong className="font-mono text-foreground">{activeProfile.id}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-xl border border-border">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Live Sync Active</span>
                </div>
              </div>

              {accessLogs.length === 0 ? (
                <div className="p-12 text-center bg-card border border-dashed border-border rounded-3xl space-y-3">
                  <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mx-auto text-muted-foreground">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-foreground">No Access Logs Yet</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    When someone scans your physical QR code or opens your profile link, their timestamp, device info, and verified identity will be recorded here immediately.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {accessLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              log.isAuthenticated ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          <span className="font-bold text-sm text-foreground">
                            {log.responderName || "First Responder"}
                          </span>
                          {log.responderEmail && (
                            <span className="text-xs text-muted-foreground font-mono">
                              ({log.responderEmail})
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {new Date(log.timestamp).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        {/* Device Info */}
                        <div className="space-y-1 bg-muted/40 p-3 rounded-xl border border-border">
                          <span className="font-bold text-muted-foreground uppercase text-[10px] flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-rose-600" />
                            <span>Device Identification</span>
                          </span>
                          <div className="text-foreground font-semibold">
                            {log.deviceInfo.deviceType || "Unknown Device"} • {log.deviceInfo.os || "OS"}
                          </div>
                          <div className="text-muted-foreground text-[11px] truncate">
                            Browser: {log.deviceInfo.browser || "Web"} • {log.deviceInfo.screenResolution || ""}
                          </div>
                        </div>

                        {/* Location / Coordinates */}
                        <div className="space-y-1 bg-muted/40 p-3 rounded-xl border border-border">
                          <span className="font-bold text-muted-foreground uppercase text-[10px] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span>Emergency Location</span>
                          </span>
                          {log.location?.isPermissionGranted &&
                          log.location?.latitude &&
                          log.location?.longitude ? (
                            <div>
                              <div className="text-foreground font-mono text-[11px]">
                                {log.location.latitude.toFixed(5)}, {log.location.longitude.toFixed(5)}
                              </div>
                              <a
                                href={`https://www.google.com/maps?q=${log.location.latitude},${log.location.longitude}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-rose-600 underline text-[11px] font-semibold inline-flex items-center gap-1 mt-1"
                              >
                                <Navigation className="w-3 h-3" />
                                <span>Open Pin in Google Maps</span>
                              </a>
                            </div>
                          ) : (
                            <div className="text-muted-foreground text-[11px] italic">
                              GPS coordinates not shared by device
                            </div>
                          )}
                        </div>

                        {/* Timezone & Security */}
                        <div className="space-y-1 bg-muted/40 p-3 rounded-xl border border-border">
                          <span className="font-bold text-muted-foreground uppercase text-[10px] flex items-center gap-1">
                            <Globe className="w-3 h-3 text-blue-500" />
                            <span>Timezone &amp; Security</span>
                          </span>
                          <div className="text-foreground font-semibold">
                            {log.deviceInfo.timeZone || "Asia/Kolkata"}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Status:{" "}
                            <span className="text-emerald-600 font-semibold">
                              Verified Identity Logged
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
