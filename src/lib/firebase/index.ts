import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getProjectConfig } from "./config";

/**
 * Returns a named Firebase App instance.
 * If the app doesn't exist, it is initialized with its specific project configuration.
 * This guarantees safe multi-Firebase project operation within the same Next.js application.
 */
export function getFirebaseApp(appName = "em-assist"): FirebaseApp {
  const existingApps = getApps();
  const existing = existingApps.find((app) => app.name === appName);
  if (existing) {
    return existing;
  }

  const config = getProjectConfig(appName);
  // Default app name in Firebase is '[DEFAULT]', but named apps allow clean segregation
  return initializeApp(config, appName);
}

/**
 * Get the Auth instance for a specific Firebase project.
 */
export function getFirebaseAuth(appName = "em-assist"): Auth {
  const app = getFirebaseApp(appName);
  return getAuth(app);
}

/**
 * Get the Firestore database instance for a specific Firebase project.
 */
export function getFirebaseDb(appName = "em-assist"): Firestore {
  const app = getFirebaseApp(appName);
  return getFirestore(app);
}

export { getProjectConfig };
