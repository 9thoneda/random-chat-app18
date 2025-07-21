import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { checkFirebaseStatus, FirebaseStatus } from "../lib/firebaseStatus";
import { testFirebaseStorageConnection } from "../lib/connectionTest";
import { CheckCircle, XCircle, RefreshCw, Database, Shield, Cloud } from "lucide-react";

export default function FirebaseDebugPage() {
  const [status, setStatus] = useState<FirebaseStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const runFirebaseCheck = async () => {
    setIsLoading(true);
    try {
      const firebaseStatus = await checkFirebaseStatus();
      setStatus(firebaseStatus);
      setLastCheck(new Date());
    } catch (error) {
      console.error("Failed to check Firebase status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const runStorageTest = async () => {
    try {
      const result = await testFirebaseStorageConnection();
      console.log("Storage test result:", result);
      alert(`Storage Test: ${result.isConnected ? "✅ Success" : "❌ Failed"}\n${result.message}`);
    } catch (error: any) {
      alert(`Storage Test Failed: ${error.message}`);
    }
  };

  useEffect(() => {
    runFirebaseCheck();
  }, []);

  const StatusIcon = ({ working }: { working: boolean }) => (
    working ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Firebase Debug Dashboard</h1>
          <p className="text-gray-600">Monitor and test Firebase service connections</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Button
            onClick={runFirebaseCheck}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 h-auto flex items-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Checking..." : "Run Status Check"}
          </Button>

          <Button
            onClick={runStorageTest}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 h-auto flex items-center gap-2"
          >
            <Cloud className="w-5 h-5" />
            Test Storage
          </Button>

          <div className="text-sm text-gray-500 flex items-center">
            {lastCheck && (
              <span>Last checked: {lastCheck.toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        {status && (
          <div className="space-y-6">
            {/* Overall Status */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <StatusIcon working={status.overall.working} />
                <h2 className="text-xl font-semibold">Overall Status</h2>
              </div>
              <p className={`text-lg ${status.overall.working ? "text-green-700" : "text-red-700"}`}>
                {status.overall.message}
              </p>
            </Card>

            {/* Configuration */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <StatusIcon working={status.isConfigured} />
                <h2 className="text-xl font-semibold">Configuration</h2>
              </div>
              <p className="text-gray-600">
                Firebase app is {status.isConfigured ? "properly configured" : "not configured"}
              </p>
            </Card>

            {/* Authentication */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-blue-600" />
                <StatusIcon working={status.auth.working} />
                <h2 className="text-xl font-semibold">Authentication</h2>
              </div>
              <div className="space-y-2">
                <p className={`${status.auth.working ? "text-green-700" : "text-red-700"}`}>
                  Status: {status.auth.working ? "Working" : "Failed"}
                </p>
                {status.auth.userId && (
                  <p className="text-sm text-gray-600 font-mono">
                    User ID: {status.auth.userId}
                  </p>
                )}
                {status.auth.error && (
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    Error: {status.auth.error}
                  </p>
                )}
              </div>
            </Card>

            {/* Firestore */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-5 h-5 text-orange-600" />
                <StatusIcon working={status.firestore.working} />
                <h2 className="text-xl font-semibold">Firestore</h2>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <StatusIcon working={status.firestore.canRead} />
                    <span>Read Operations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon working={status.firestore.canWrite} />
                    <span>Write Operations</span>
                  </div>
                </div>
                {status.firestore.error && (
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    Error: {status.firestore.error}
                  </p>
                )}
              </div>
            </Card>

            {/* Storage */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Cloud className="w-5 h-5 text-purple-600" />
                <StatusIcon working={status.storage.working} />
                <h2 className="text-xl font-semibold">Storage</h2>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <StatusIcon working={status.storage.canUpload} />
                    <span>Upload</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon working={status.storage.canDownload} />
                    <span>Download</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon working={status.storage.canDelete} />
                    <span>Delete</span>
                  </div>
                </div>
                {status.storage.error && (
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    Error: {status.storage.error}
                  </p>
                )}
              </div>
            </Card>

            {/* Configuration Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Configuration Details</h2>
              <div className="bg-gray-50 p-4 rounded font-mono text-sm space-y-1">
                <div>Project ID: ajnabicam</div>
                <div>Auth Domain: ajnabicam.firebaseapp.com</div>
                <div>Storage Bucket: ajnabicam.appspot.com</div>
                <div>Region: us-central1 (default)</div>
              </div>
            </Card>
          </div>
        )}

        {!status && !isLoading && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">Click "Run Status Check" to test Firebase services</p>
          </Card>
        )}
      </div>
    </div>
  );
}
