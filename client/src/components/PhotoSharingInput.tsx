import { useState, useRef } from "react";
import { Camera, Image, X, Upload, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  uploadChatPhoto,
  validateImageFile,
  getStorageErrorMessage,
} from "../lib/storageUtils";

interface PhotoSharingInputProps {
  onPhotoSelected: (photoUrl: string, filePath?: string) => void;
  onCancel: () => void;
  chatId?: string;
  userId?: string;
}

export default function PhotoSharingInput({
  onPhotoSelected,
  onCancel,
  chatId = "default",
  userId = "anonymous",
}: PhotoSharingInputProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Photo size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleSendPhoto = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // In a real app, you would upload to your server/cloud storage
      // For demo purposes, we'll use the data URL
      onPhotoSelected(previewUrl);

      // Reset state
      setSelectedFile(null);
      setPreviewUrl("");
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to send photo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Share Photo</h2>
            <button
              onClick={handleCancel}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!selectedFile ? (
            <>
              {/* Photo selection options */}
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">📸</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Share a Special Moment
                  </h3>
                  <p className="text-sm text-gray-600">
                    Choose a photo to share in this conversation
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Image size={24} />
                    <span className="text-sm font-medium">Gallery</span>
                  </Button>

                  <Button
                    onClick={() => {
                      // In a real app, this would open camera
                      fileInputRef.current?.click();
                    }}
                    className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Camera size={24} />
                    <span className="text-sm font-medium">Camera</span>
                  </Button>
                </div>

                {/* Privacy notice */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      size={20}
                      className="text-orange-600 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <h4 className="font-semibold text-orange-800 text-sm mb-1">
                        Privacy Notice
                      </h4>
                      <p className="text-orange-700 text-xs leading-relaxed">
                        • Photos are automatically deleted when chat is closed
                        <br />
                        • Non-premium users cannot screenshot or download
                        <br />• Only Premium users can save shared photos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Photo preview */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Preview & Send
                  </h3>
                </div>

                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl("");
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      File size: {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                      MB
                    </span>
                    <span>
                      Format: {selectedFile.type.split("/")[1].toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl("");
                    }}
                    className="flex-1"
                    disabled={isUploading}
                  >
                    Change Photo
                  </Button>
                  <Button
                    onClick={handleSendPhoto}
                    disabled={isUploading}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Upload size={16} />
                        Send Photo
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
