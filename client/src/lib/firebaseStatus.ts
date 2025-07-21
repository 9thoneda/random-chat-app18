import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { firebaseApp, db, storage } from "../firebaseConfig";

export interface FirebaseStatus {
  isConfigured: boolean;
  auth: {
    working: boolean;
    error?: string;
    userId?: string;
  };
  firestore: {
    working: boolean;
    error?: string;
    canRead: boolean;
    canWrite: boolean;
  };
  storage: {
    working: boolean;
    error?: string;
    canUpload: boolean;
    canDownload: boolean;
    canDelete: boolean;
  };
  overall: {
    working: boolean;
    message: string;
  };
}

export async function checkFirebaseStatus(): Promise<FirebaseStatus> {
  const status: FirebaseStatus = {
    isConfigured: false,
    auth: { working: false },
    firestore: { working: false, canRead: false, canWrite: false },
    storage: { working: false, canUpload: false, canDownload: false, canDelete: false },
    overall: { working: false, message: "" }
  };

  try {
    // Check if Firebase is configured
    if (!firebaseApp || !db || !storage) {
      status.overall = {
        working: false,
        message: "Firebase not properly configured"
      };
      return status;
    }
    status.isConfigured = true;

    // Test Authentication
    console.log("🔐 Testing Firebase Auth...");
    try {
      const auth = getAuth(firebaseApp);
      const userCredential = await signInAnonymously(auth);
      status.auth = {
        working: true,
        userId: userCredential.user.uid
      };
      console.log("✅ Firebase Auth working - User ID:", userCredential.user.uid);
    } catch (error: any) {
      status.auth = {
        working: false,
        error: error.message
      };
      console.error("❌ Firebase Auth failed:", error);
    }

    // Test Firestore
    console.log("📊 Testing Firestore...");
    try {
      if (status.auth.working && status.auth.userId) {
        // Test read
        const userDocRef = doc(db, "users", status.auth.userId);
        const userDocSnap = await getDoc(userDocRef);
        status.firestore.canRead = true;

        // Test write
        const testData = {
          testTimestamp: new Date(),
          testField: "Firebase connection test"
        };
        await setDoc(userDocRef, testData, { merge: true });
        status.firestore.canWrite = true;
        status.firestore.working = true;
        console.log("✅ Firestore working - Read/Write successful");
      }
    } catch (error: any) {
      status.firestore = {
        working: false,
        error: error.message,
        canRead: false,
        canWrite: false
      };
      console.error("❌ Firestore failed:", error);
    }

    // Test Storage
    console.log("💾 Testing Firebase Storage...");
    try {
      const testRef = ref(storage, `test/${Date.now()}-test.txt`);
      const testData = new Blob(["Firebase test"], { type: "text/plain" });

      // Test upload
      await uploadBytes(testRef, testData);
      status.storage.canUpload = true;

      // Test download
      const downloadURL = await getDownloadURL(testRef);
      status.storage.canDownload = true;

      // Test delete
      await deleteObject(testRef);
      status.storage.canDelete = true;
      status.storage.working = true;
      console.log("✅ Firebase Storage working - Upload/Download/Delete successful");
    } catch (error: any) {
      status.storage = {
        working: false,
        error: error.message,
        canUpload: false,
        canDownload: false,
        canDelete: false
      };
      console.error("❌ Firebase Storage failed:", error);
    }

    // Overall status
    const allWorking = status.auth.working && status.firestore.working && status.storage.working;
    status.overall = {
      working: allWorking,
      message: allWorking 
        ? "🎉 All Firebase services working perfectly!"
        : `⚠️ Issues found: ${[
            !status.auth.working && "Auth",
            !status.firestore.working && "Firestore", 
            !status.storage.working && "Storage"
          ].filter(Boolean).join(", ")}`
    };

  } catch (error: any) {
    status.overall = {
      working: false,
      message: `💥 Firebase check failed: ${error.message}`
    };
    console.error("💥 Firebase status check failed:", error);
  }

  return status;
}

export function logFirebaseStatus(status: FirebaseStatus): void {
  console.log("🔥 FIREBASE STATUS REPORT:");
  console.log("========================");
  console.log(`📦 Configured: ${status.isConfigured ? "✅" : "❌"}`);
  console.log(`🔐 Auth: ${status.auth.working ? "✅" : "❌"} ${status.auth.error ? `(${status.auth.error})` : ""}`);
  console.log(`📊 Firestore: ${status.firestore.working ? "✅" : "❌"} ${status.firestore.error ? `(${status.firestore.error})` : ""}`);
  console.log(`💾 Storage: ${status.storage.working ? "✅" : "❌"} ${status.storage.error ? `(${status.storage.error})` : ""}`);
  console.log(`🎯 Overall: ${status.overall.working ? "✅" : "❌"} - ${status.overall.message}`);
  console.log("========================");
}
