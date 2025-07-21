import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, signInAnonymously, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseApp, db } from "./firebaseConfig";
import { initializeCoins } from "./lib/firestoreUtils";
import { checkFirebaseStatus, logFirebaseStatus } from "./lib/firebaseStatus";

import VideoChat from "./screens/VideoChat";
import SplashScreen from "./components/SplashScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import ReferToUnlock from "./screens/ReferToUnlock";
import ReferralCodeScreen from "./screens/ReferralCode";
import GenderSelect from "./screens/GenderSelect";
import ChatPage from "./screens/ChatPage";
import VoicePage from "./screens/VoicePage";
import HomePage from "./screens/HomePage";
import ProfilePage from "./screens/ProfilePage";
import StorageDebugPage from "./screens/StorageDebugPage";
import UserSetup from "./screens/UserSetup";
import PersonalChat from "./screens/PersonalChat";
import FriendsPage from "./screens/FriendsPage";
import AIChatbotPage from "./screens/AIChatbotPage";
import SpinWheel from "./components/SpinWheel";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

import { useNavigate } from "react-router-dom";

interface UserData {
  uid: string;
  onboardingComplete: boolean;
  gender: string | null;
  username: string | null;
  language: string;
  referredBy: string | null;
  coins?: number;
  createdAt: any;
}

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);

  console.log(
    "App component rendered, showSplash:",
    showSplash,
    "isLoading:",
    isLoading,
  );

    useEffect(() => {
    if (!showSplash) {
      const initializeUser = async () => {
        try {
          // Check Firebase status first
          console.log("🔥 Running Firebase status check...");
          const firebaseStatus = await checkFirebaseStatus();
          logFirebaseStatus(firebaseStatus);

          if (!firebaseStatus.overall.working) {
            console.warn("⚠️ Firebase has issues but continuing with initialization...");
          }

          // Sign in anonymously with Firebase
          const userCredential = await signInAnonymously(auth);
          const user = userCredential.user;
          console.log("Signed in anonymously with UID:", user.uid);

          // Check if user document exists in Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists()) {
            // New user - create document with initial data
            const initialUserData: Partial<UserData> = {
              uid: user.uid,
              onboardingComplete: false,
              gender: null,
              username: null,
              language: "en", // Default language
              referredBy: null,
              createdAt: new Date(),
              coins: 100, // Initialize with 100 coins
            };

            await setDoc(userDocRef, initialUserData);
            console.log("Created new user document");

            // Redirect to onboarding for new users
            navigate("/onboarding", { replace: true });
          } else {
            // Existing user - check onboarding status
            const userData = userDocSnap.data() as UserData;
            console.log("Existing user data:", userData);

            // Initialize coins if not present (for existing users)
            try {
              await initializeCoins(user.uid);
            } catch (error) {
              console.error(
                "Error initializing coins for existing user:",
                error,
              );
            }

            if (!userData.onboardingComplete) {
              // User exists but onboarding not complete
              navigate("/onboarding", { replace: true });
            }
            // If onboarding is complete, stay on current route or go to home
          }
        } catch (error) {
          console.error("Error during user initialization:", error);
          // Fallback to onboarding on error
          // Don't navigate on error to prevent infinite loops
          console.log("Continuing without navigation due to error");
        } finally {
          setIsLoading(false);
        }
      };

      initializeUser();
    }
  }, [showSplash, navigate, auth]);

  const handleSplashComplete = () => {
    console.log("Splash screen completed, setting showSplash to false");
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-peach-50 via-cream-50 to-blush-100 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 border-b-2 border-peach-500 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-peach-600 font-medium text-sm sm:text-base lg:text-lg">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/user-setup" element={<UserSetup />} />
        <Route path="/premium-trial" element={<ReferToUnlock />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/gender-select" element={<GenderSelect />} />
        <Route path="/video-chat" element={<VideoChat />} />
        <Route path="/voice" element={<VoicePage />} />
        <Route path="/personal-chat" element={<PersonalChat />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/refer" element={<ReferToUnlock />} />
        <Route path="/referral-code" element={<ReferralCodeScreen />} />
        <Route path="/ai-chatbot" element={<AIChatbotPage />} />
        <Route path="/spin-wheel" element={<SpinWheel />} />
        <Route path="/storage-debug" element={<StorageDebugPage />} />
      </Routes>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}

export default App;
