/**
 * EM Assist Type Definitions
 * Tailored for emergency response, granular privacy toggles, and Indian context.
 */

export type EmBloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-"
  | "Unknown";

export type IndianRelation =
  | "Self"
  | "Father"
  | "Mother"
  | "Spouse"
  | "Brother"
  | "Sister"
  | "Son"
  | "Daughter"
  | "Grandparent"
  | "Guardian"
  | "Friend"
  | "Doctor"
  | "Pet"
  | "Other";

export interface IndianAddress {
  flatHouse: string;
  streetLocality: string;
  landmark?: string;
  cityDistrict: string;
  state: string;
  pinCode: string;
}

export interface EmergencyContact {
  name: string;
  relation: IndianRelation | string;
  phone: string;
  alternatePhone?: string;
}

export interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
  instructions?: string;
}

export interface FieldVisibility {
  fullName: boolean;
  bloodGroup: boolean;
  ownMobile: boolean;
  primaryContact: boolean;
  secondaryContact: boolean;
  medications: boolean;
  allergies: boolean;
  illnesses: boolean;
  notes: boolean;
  address: boolean;
  abhaId: boolean;
}

export interface EmProfile {
  id: string; // 8-16 alphanumeric ID e.g. EM-9A4B2C8D
  ownerUid: string;
  ownerEmail: string;
  linkedEmail?: string; // Optional email of family member (e.g. sibling) for automatic cross-account sync
  relation: IndianRelation;
  label: string; // e.g., "Alok (Self)", "Anjali (Sister)", "Bruno (Dog)"
  fullName: string;
  ownMobile: string;
  bloodGroup: EmBloodGroup;
  primaryContact: EmergencyContact;
  secondaryContact?: EmergencyContact;
  medications: MedicationItem[];
  allergies: string[];
  illnesses: string[]; // Known illnesses, problems, or clinical diagnoses
  notes: string; // Special emergency notes (e.g., "Carry insulin pen in right pocket")
  address: IndianAddress;
  abhaId?: string; // Optional ABHA (Ayushman Bharat Health Account ID)
  fieldVisibility: FieldVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface ResponderDeviceInfo {
  userAgent: string;
  browser?: string;
  os?: string;
  deviceType?: string;
  screenResolution?: string;
  timeZone: string;
  language?: string;
}

export interface ResponderGeoLocation {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  addressEstimate?: string;
  isPermissionGranted: boolean;
}

export interface AccessLog {
  id: string;
  profileId: string;
  timestamp: string; // ISO 8601
  responderUid?: string;
  responderName?: string;
  responderEmail?: string;
  isAuthenticated: boolean;
  deviceInfo: ResponderDeviceInfo;
  location?: ResponderGeoLocation;
}

export type PrintLayoutType = "card" | "sticker" | "keychain" | "document";
export type CardTemplateType = "allInOne" | "infoCard" | "keychainTag" | "plainQr" | "a4Sheet";

// List of Indian States and Union Territories for address selection
export const INDIAN_STATES_AND_UTS = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

// Quick dial numbers for Indian Emergency services
export const INDIAN_EMERGENCY_SERVICES = [
  { number: "112", label: "National Helpline", desc: "Police, Fire & Medical (24x7)" },
  { number: "108", label: "Ambulance", desc: "Trauma & Medical Emergency" },
  { number: "102", label: "Maternal & Child", desc: "Infant & Pregnancy Transport" },
  { number: "100", label: "Police", desc: "Immediate Police Response" },
  { number: "101", label: "Fire & Rescue", desc: "Fire Extrication & Rescue" },
  { number: "1075", label: "Health Helpline", desc: "National Medical Support" },
  { number: "1091", label: "Women Safety", desc: "24x7 Distress Support" },
  { number: "1098", label: "Childline", desc: "Child Care & Protection" },
  { number: "1070", label: "Disaster Relief", desc: "Disaster Management" },
] as const;
