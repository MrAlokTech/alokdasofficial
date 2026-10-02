// Custom declarations for Firebase modular SDK to avoid missing-types issues during build

declare module "firebase/app" {
  export interface FirebaseApp {
    name: string;
    options: Record<string, any>;
  }
  export function initializeApp(options: Record<string, any>, name?: string): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export function getApp(name?: string): FirebaseApp;
}

declare module "firebase/auth" {
  export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
  }
  export interface UserCredential {
    user: User;
  }
  export interface Auth {
    currentUser: User | null;
    app: any;
  }
  export class GoogleAuthProvider {
    constructor();
  }
  export function getAuth(app?: any): Auth;
  export function signInWithPopup(auth: Auth, provider: any): Promise<UserCredential>;
  export function signInWithEmailAndPassword(auth: Auth, email: string, pass: string): Promise<UserCredential>;
  export function createUserWithEmailAndPassword(auth: Auth, email: string, pass: string): Promise<UserCredential>;
  export function signOut(auth: Auth): Promise<void>;
  export function onAuthStateChanged(auth: Auth, callback: (user: User | null) => void): () => void;
  export function updateProfile(user: User, profile: { displayName?: string | null; photoURL?: string | null }): Promise<void>;
}

declare module "firebase/firestore" {
  export interface Firestore {
    type: string;
    app: any;
  }
  export interface DocumentReference<T = any> {
    id: string;
    path: string;
  }
  export interface CollectionReference<T = any> {
    id: string;
    path: string;
  }
  export interface DocumentSnapshot<T = any> {
    id: string;
    exists(): boolean;
    data(): T | undefined;
  }
  export interface QuerySnapshot<T = any> {
    empty: boolean;
    size: number;
    docs: DocumentSnapshot<T>[];
    forEach(callback: (doc: DocumentSnapshot<T>) => void): void;
  }
  export interface QueryConstraint {}

  export function getFirestore(app?: any): Firestore;
  export function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference;
  export function doc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference;
  export function setDoc(reference: DocumentReference, data: any, options?: { merge?: boolean }): Promise<void>;
  export function getDoc(reference: DocumentReference): Promise<DocumentSnapshot>;
  export function getDocs(query: any): Promise<QuerySnapshot>;
  export function updateDoc(reference: DocumentReference, data: any): Promise<void>;
  export function deleteDoc(reference: DocumentReference): Promise<void>;
  export function addDoc(reference: CollectionReference, data: any): Promise<DocumentReference>;
  export function query(reference: CollectionReference | any, ...queryConstraints: any[]): any;
  export function where(fieldPath: string, opStr: string, value: any): QueryConstraint;
  export function orderBy(fieldPath: string, directionStr?: "asc" | "desc"): QueryConstraint;
  export function limit(limit: number): QueryConstraint;
  export function onSnapshot(reference: any, onNext: (snapshot: any) => void, onError?: (error: any) => void): () => void;
  export function serverTimestamp(): any;
}
