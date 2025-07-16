// src/App.tsx
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// ── Firebase ──────────────────────────────────────
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import "../firebaseConfig";                // initialise app once

// ── Screens ───────────────────────────────────────
import VideoChat         from "./screens/VideoChat";
import SplashScreen      from "./components/SplashScreen";
import OnboardingScreen  from "./screens/OnboardingScreen";
import ReferToUnlock     from "./screens/ReferToUnlock";
import ReferralCodeScreen from "./screens/ReferralCode";
import GenderSelect      from "./screens/GenderSelect";
import ChatPage          from "./screens/ChatPage";
import VoicePage         from "./screens/VoicePage";
import HomePage          from "./screens/HomePage";
import ProfilePage       from "./screens/ProfilePage";
import UserSetup         from "./screens/UserSetup";
import PersonalChat      from "./screens/PersonalChat";
import FriendsPage       from "./screens/FriendsPage";
import AIChatbotPage     from "./screens/AIChatbotPage";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  /* ───────────────────────────────────────────────
     1. Firebase anonymous sign‑in
  ────────────────────────────────────────────────*/
  useEffect(() => {
    const auth = getAuth();

    // if already signed in, onAuthStateChanged will fire immediately
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // No user yet → sign in anonymously
        signInAnonymously(auth).catch((err) =>
          console.error("Anon sign‑in failed:", err)
        );
      } else {
        // Save uid for later (e.g., Firestore, matches)
        localStorage.setItem("ajnabicam_uid", user.uid);
      }
    });

    return unsub; // cleanup listener
  }, []);

  /* ───────────────────────────────────────────────
     2. Splash‑screen → onboarding logic
  ────────────────────────────────────────────────*/
  useEffect(() => {
    if (!showSplash) {
      const userData  = localStorage.getItem("ajnabicam_user_data");
      const firstOpen = localStorage.getItem("ajnabicam_first_open");

      if (!firstOpen) {
        localStorage.setItem("ajnabicam_first_open", "true");
        navigate("/onboarding", { replace: true });
      } else if (!userData) {
        navigate("/onboarding", { replace: true });
      } else {
        const parsed = JSON.parse(userData);
        if (!parsed.onboardingComplete) {
          navigate("/onboarding", { replace: true });
        }
      }
    }
  }, [showSplash, navigate]);

  const handleSplashComplete = () => setShowSplash(false);

  if (showSplash) return <SplashScreen onComplete={handleSplashComplete} />;

  /* ───────────────────────────────────────────────
     3. App routes
  ────────────────────────────────────────────────*/
  return (
    <Routes>
      <Route path="/"              element={<HomePage />} />
      <Route path="/onboarding"    element={<OnboardingScreen />} />
      <Route path="/user-setup"    element={<UserSetup />} />
      <Route path="/premium-trial" element={<ReferToUnlock />} />
      <Route path="/home"          element={<HomePage />} />
      <Route path="/gender-select" element={<GenderSelect />} />
      <Route path="/video-chat"    element={<VideoChat />} />
      <Route path="/voice"         element={<VoicePage />} />
      <Route path="/personal-chat" element={<PersonalChat />} />
      <Route path="/chat"          element={<ChatPage />} />
      <Route path="/friends"       element={<FriendsPage />} />
      <Route path="/profile"       element={<ProfilePage />} />
      <Route path="/refer"         element={<ReferToUnlock />} />
      <Route path="/referral-code" element={<ReferralCodeScreen />} />
      <Route path="/ai-chatbot"    element={<AIChatbotPage />} />
    </Routes>
  );
}

export default App;
