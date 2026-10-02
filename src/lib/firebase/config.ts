/**
 * Multi-Firebase Configuration Architecture
 * Allows alokdasofficial.in to connect to multiple distinct Firebase projects
 * seamlessly without namespace collisions.
 */

export interface FirebaseProjectConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
}

// Default / EM Assist Firebase Project Config (medhelperbuddy)
// Supports dynamic overrides from environment variables
export const EM_ASSIST_FIREBASE_CONFIG: FirebaseProjectConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_EM_ASSIST_API_KEY ||
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyDsbYvKOIhJWY7h9G9LzzDhpsKJgOwOwLg",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_EM_ASSIST_AUTH_DOMAIN ||
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "medhelperbuddy.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_EM_ASSIST_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "medhelperbuddy",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_EM_ASSIST_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "medhelperbuddy.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_EM_ASSIST_MESSAGING_SENDER_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    "386332510866",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_EM_ASSIST_APP_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:386332510866:web:c794491b6463f18f7a744b",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_EM_ASSIST_MEASUREMENT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    "G-789CKPZ9EE",
};

// Project Registry for multi-project architecture
export const FIREBASE_PROJECTS_REGISTRY: Record<string, FirebaseProjectConfig> = {
  "em-assist": EM_ASSIST_FIREBASE_CONFIG,
  portfolio: {
    apiKey:
      process.env.NEXT_PUBLIC_FIREBASE_PORTFOLIO_API_KEY ||
      "AIzaSyAaotynXqso2-gviIfaDfnYpWpZ_D4KPVc",
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_PORTFOLIO_AUTH_DOMAIN ||
      "alokdasofficial-69f96.firebaseapp.com",
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PORTFOLIO_PROJECT_ID ||
      "alokdasofficial",
    storageBucket: "alokdasofficial.firebasestorage.app",
    messagingSenderId: "315463239297",
    appId: "1:315463239297:web:930a164891d386583f2f80",
    measurementId: "G-XMBQM46W16",
  },
};

export function getProjectConfig(projectName = "em-assist"): FirebaseProjectConfig {
  return FIREBASE_PROJECTS_REGISTRY[projectName] || EM_ASSIST_FIREBASE_CONFIG;
}
