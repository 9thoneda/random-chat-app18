import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import { firebaseApp } from "./firebaseConfig";

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
import UserSetup from "./screens/UserSetup";
import PersonalChat from "./screens/PersonalChat";
import FriendsPage from "./screens/FriendsPage";
import AIChatbotPage from "./screens/AIChatbotPage";

import { useNavigate } from "react-router-dom";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    if (!showSplash) {
      // Sign in anonymously with Firebase
      signInAnonymously(auth)
        .then(() => {
          console.log("Signed in anonymously");
        })
        .catch((error) => {
          console.error("Anonymous sign-in failed", error);
        });

      // Check if user has completed onboarding
      const userData = localStorage.getItem("ajnabicam_user_data");
      const firstOpen = localStorage.getItem("ajnabicam_first_open");

      if (!firstOpen) {
        // First time opening the app
        localStorage.setItem("ajnabicam_first_open", "true");
        navigate("/onboarding", { replace: true });
      } else if (!userData) {
        // User has opened before but no data saved
        navigate("/onboarding", { replace: true });
      } else {
        const parsedData = JSON.parse(userData);
        if (!parsedData.onboardingComplete) {
          // User data exists but onboarding not complete
          navigate("/onboarding", { replace: true });
        }
        // If onboarding is complete, stay on current route or go to home
      }
    }
  }, [showSplash, navigate, auth]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
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
      </Routes>
    </div>
  );
}

export default App;