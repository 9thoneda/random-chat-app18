import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Database,
  Wifi,
  WifiOff,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  testFirebaseStorageConnection,
  testConnectionWithRetry,
  getStorageInfo,
  ConnectionTestResult,
} from "../lib/connectionTest";

interface StorageConnectionStatusProps {
  showDetails?: boolean;
  autoTest?: boolean;
  className?: string;
}

export default function StorageConnectionStatus({
  showDetails = true,
  autoTest = true,
  className = "",
}: StorageConnectionStatusProps) {
  const [connectionResult, setConnectionResult] =
    useState<ConnectionTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [storageInfo, setStorageInfo] = useState<any>(null);

  useEffect(() => {
    // Get storage configuration info
    setStorageInfo(getStorageInfo());

    // Auto-test connection on mount
    if (autoTest) {
      testConnection();
    }
  }, [autoTest]);

  const testConnection = async (withRetry: boolean = false) => {
    setIsLoading(true);
    try {
      const result = withRetry
        ? await testConnectionWithRetry(3)
        : await testFirebaseStorageConnection();
      setConnectionResult(result);
    } catch (error) {
      setConnectionResult({
        isConnected: false,
        status: "error",
        message: "Connection test failed unexpectedly",
        details: {
          canRead: false,
          canWrite: false,
          canDelete: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />;
    }

    if (!connectionResult) {
      return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }

    switch (connectionResult.status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    if (isLoading) return "border-bollywood-200 bg-bollywood-50";
    if (!connectionResult) return "border-gray-200 bg-gray-50";

    switch (connectionResult.status) {
      case "success":
        return "border-passion-200 bg-passion-50";
      case "error":
        return "border-coral-200 bg-coral-50";
      default:
        return "border-marigold-200 bg-marigold-50";
    }
  };

  return (
    <div className={`${className}`}>
      {/* Main Status Card */}
      <div
        className={`border rounded-xl p-4 ${getStatusColor()} transition-all duration-300`}
      >
        <div className="flex items-center gap-3 mb-3">
          {getStatusIcon()}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-800">
                Firebase Storage
              </span>
              {connectionResult?.isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {isLoading
                ? "Testing connection..."
                : connectionResult?.message || "Click to test connection"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => testConnection(false)}
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Test
          </Button>

          <Button
            onClick={() => testConnection(true)}
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Test with Retry
          </Button>
        </div>

        {/* Detailed Information */}
        {showDetails && connectionResult && (
          <div className="mt-4 space-y-3">
            {/* Connection Details */}
            {connectionResult.details && (
              <div className="bg-white/50 rounded-lg p-3">
                <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Connection Details
                </h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    {connectionResult.details.canWrite ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                    <span>Write</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {connectionResult.details.canRead ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                    <span>Read</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {connectionResult.details.canDelete ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                    <span>Delete</span>
                  </div>
                </div>

                {connectionResult.details.error && (
                  <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                    <strong>Error:</strong> {connectionResult.details.error}
                  </div>
                )}
              </div>
            )}

            {/* Storage Configuration */}
            {storageInfo && !storageInfo.error && (
              <div className="bg-white/50 rounded-lg p-3">
                <h4 className="font-medium text-sm text-gray-700 mb-2">
                  Configuration
                </h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>
                    <strong>Bucket:</strong> {storageInfo.bucket}
                  </div>
                  <div>
                    <strong>Project:</strong> {storageInfo.projectId}
                  </div>
                  <div>
                    <strong>Domain:</strong> {storageInfo.authDomain}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Status Indicator (for minimal view) */}
      {!showDetails && (
        <div className="flex items-center gap-2 text-sm">
          {getStatusIcon()}
          <span
            className={`font-medium ${
              connectionResult?.isConnected ? "text-green-600" : "text-red-600"
            }`}
          >
            {connectionResult?.isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      )}
    </div>
  );
}

// Quick status hook for use in other components
export function useStorageConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    try {
      const result = await testFirebaseStorageConnection();
      setIsConnected(result.isConnected);
      setLastChecked(new Date());
      return result.isConnected;
    } catch (error) {
      setIsConnected(false);
      setLastChecked(new Date());
      return false;
    }
  };

  useEffect(() => {
    // Check connection on mount
    checkConnection();
  }, []);

  return {
    isConnected,
    lastChecked,
    checkConnection,
  };
}
