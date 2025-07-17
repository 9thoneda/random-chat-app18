import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Wifi, Database } from "lucide-react";
import {
  testFirebaseStorageConnection,
  ConnectionTestResult,
} from "../lib/connectionTest";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<{
    isTestingConnection: boolean;
    connectionResult: ConnectionTestResult | null;
    showConnectionTest: boolean;
  }>({
    isTestingConnection: false,
    connectionResult: null,
    showConnectionTest: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="flex flex-col items-center justify-center animate-fade-in">
        <div className="relative mb-8 transform hover:scale-105 transition-transform duration-300">
          <img
            src="/splash-image.png"
            alt="AjnabiCam Splash"
            className="w-80 h-auto rounded-3xl shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
        </div>

        {/* Loading animation */}
        <div className="flex items-center gap-2 mt-6">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-orange-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-3 h-3 bg-orange-700 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>

        <p className="text-orange-800 text-lg font-medium mt-4 animate-pulse">
          Loading amazing connections...
        </p>
      </div>
    </div>
  );
}
