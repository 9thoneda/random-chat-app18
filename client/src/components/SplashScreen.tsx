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
    // Start connection test after 1 second
    const connectionTimer = setTimeout(() => {
      setConnectionStatus((prev) => ({
        ...prev,
        isTestingConnection: true,
        showConnectionTest: true,
      }));

      testFirebaseStorageConnection()
        .then((result) => {
          setConnectionStatus((prev) => ({
            ...prev,
            isTestingConnection: false,
            connectionResult: result,
          }));
        })
        .catch((error) => {
          setConnectionStatus((prev) => ({
            ...prev,
            isTestingConnection: false,
            connectionResult: {
              isConnected: false,
              status: "error",
              message: "Connection test failed",
              details: {
                canRead: false,
                canWrite: false,
                canDelete: false,
                error: error.message,
              },
            },
          }));
        });
    }, 1000);

    // Hide splash after 4 seconds (increased to show connection status)
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(connectionTimer);
    };
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

        {/* Firebase Storage Connection Status */}
        {connectionStatus.showConnectionTest && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-orange-200 max-w-sm w-full">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-800">
                Firebase Storage
              </span>

              {connectionStatus.isTestingConnection ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                  <span className="text-sm text-orange-700">Testing...</span>
                </div>
              ) : connectionStatus.connectionResult ? (
                <div className="flex items-center gap-2">
                  {connectionStatus.connectionResult.isConnected ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <Wifi className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">
                        Connected
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700 font-medium">
                        Failed
                      </span>
                    </>
                  )}
                </div>
              ) : null}
            </div>

            {/* Connection result message */}
            {connectionStatus.connectionResult && (
              <p
                className={`text-xs mt-2 ${
                  connectionStatus.connectionResult.isConnected
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {connectionStatus.connectionResult.message}
              </p>
            )}

            {/* Connection capabilities */}
            {connectionStatus.connectionResult?.details &&
              !connectionStatus.isTestingConnection && (
                <div className="flex gap-3 mt-2 text-xs">
                  <span
                    className={`flex items-center gap-1 ${
                      connectionStatus.connectionResult.details.canWrite
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {connectionStatus.connectionResult.details.canWrite
                      ? "✓"
                      : "✗"}{" "}
                    Write
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      connectionStatus.connectionResult.details.canRead
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {connectionStatus.connectionResult.details.canRead
                      ? "✓"
                      : "✗"}{" "}
                    Read
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      connectionStatus.connectionResult.details.canDelete
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {connectionStatus.connectionResult.details.canDelete
                      ? "✓"
                      : "✗"}{" "}
                    Delete
                  </span>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
