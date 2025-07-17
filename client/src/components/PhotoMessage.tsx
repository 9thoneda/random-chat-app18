import { useState, useRef, useEffect } from "react";
import { Eye, Download, Lock, Crown, X, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { usePremium } from "../context/PremiumProvider";

interface PhotoMessageProps {
  photoUrl: string;
  fromMe: boolean;
  time: string;
  isViewed?: boolean;
  onView?: () => void;
  onDelete?: () => void;
}

export default function PhotoMessage({
  photoUrl,
  fromMe,
  time,
  isViewed = false,
  onView,
  onDelete,
}: PhotoMessageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasBeenViewed, setHasBeenViewed] = useState(isViewed);
  const [showProtectionWarning, setShowProtectionWarning] = useState(false);
  const { isPremium } = usePremium();
  const imageRef = useRef<HTMLImageElement>(null);

  // Disable right-click and long press for non-premium users
  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isPremium) {
      e.preventDefault();
      setShowProtectionWarning(true);
      setTimeout(() => setShowProtectionWarning(false), 3000);
    }
  };

  // Disable screenshot shortcuts for non-premium users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPremium && isFullscreen) {
        // Disable common screenshot shortcuts
        if (
          (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s")) ||
          (e.metaKey &&
            e.shiftKey &&
            (e.key === "3" || e.key === "4" || e.key === "5")) ||
          e.key === "PrintScreen"
        ) {
          e.preventDefault();
          setShowProtectionWarning(true);
          setTimeout(() => setShowProtectionWarning(false), 3000);
        }
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isPremium, isFullscreen]);

  // Disable drag for non-premium users
  const handleDragStart = (e: React.DragEvent) => {
    if (!isPremium) {
      e.preventDefault();
    }
  };

  const handleViewPhoto = () => {
    setIsFullscreen(true);
    if (!hasBeenViewed) {
      setHasBeenViewed(true);
      onView?.();
    }
  };

  const handleDownload = () => {
    if (!isPremium) {
      setShowProtectionWarning(true);
      setTimeout(() => setShowProtectionWarning(false), 3000);
      return;
    }

    // Download functionality for premium users
    const link = document.createElement("a");
    link.href = photoUrl;
    link.download = `photo_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className={`flex ${fromMe ? "justify-end" : "justify-start"} mb-4`}>
        <div
          className={`relative max-w-xs rounded-2xl overflow-hidden shadow-lg ${
            fromMe
              ? "bg-gradient-to-r from-violet-500 to-purple-600"
              : "bg-white border border-gray-200"
          }`}
        >
          {hasBeenViewed ? (
            <div className="relative">
              <img
                ref={imageRef}
                src={photoUrl}
                alt="Shared photo"
                className="w-full h-48 object-cover cursor-pointer"
                onClick={handleViewPhoto}
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                style={{
                  userSelect: isPremium ? "auto" : "none",
                  pointerEvents: "auto",
                }}
              />

              {/* Photo overlay controls */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleViewPhoto}
                    className="bg-white/90 text-gray-800 hover:bg-white"
                  >
                    <Eye size={16} />
                  </Button>
                  {isPremium && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleDownload}
                      className="bg-white/90 text-gray-800 hover:bg-white"
                    >
                      <Download size={16} />
                    </Button>
                  )}
                </div>
              </div>

              {/* Premium badge */}
              {isPremium && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full">
                  <Crown size={12} />
                </div>
              )}

              {/* Protection indicator for non-premium */}
              {!isPremium && (
                <div className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full">
                  <Lock size={12} />
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-violet-400 transition-colors"
              onClick={handleViewPhoto}
            >
              <Eye size={32} className="text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm font-medium">
                Tap to view photo
              </p>
              <p className="text-gray-400 text-xs mt-1">
                🔥 Photo will be deleted after closing chat
              </p>
            </div>
          )}

          {/* Message time */}
          <div
            className={`p-3 ${fromMe ? "text-purple-100" : "text-gray-600"}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs">
                {hasBeenViewed ? "📷 Photo" : "📷 Photo (unviewed)"}
              </span>
              <span className="text-xs">{time}</span>
            </div>
            {!isPremium && (
              <div className="flex items-center gap-1 mt-1">
                <Lock size={10} />
                <span className="text-xs opacity-75">Protected content</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen photo viewer */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <img
              src={photoUrl}
              alt="Shared photo"
              className="max-w-full max-h-full object-contain"
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
              style={{
                userSelect: isPremium ? "auto" : "none",
              }}
            />

            {/* Fullscreen controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              {isPremium && (
                <Button
                  size="sm"
                  onClick={handleDownload}
                  className="bg-white/90 text-gray-800 hover:bg-white"
                >
                  <Download size={16} />
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="bg-white/90 text-gray-800 hover:bg-white"
              >
                <X size={16} />
              </Button>
            </div>

            {/* Premium indicator */}
            {isPremium && (
              <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                <Crown size={14} />
                <span className="text-sm font-medium">Premium</span>
              </div>
            )}

            {/* Protection overlay for non-premium */}
            {!isPremium && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Lock size={14} />
                  <span className="text-sm font-medium">Protected</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Protection warning */}
      {showProtectionWarning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <AlertTriangle size={16} />
          <span className="text-sm font-medium">
            {isPremium
              ? "Content protected"
              : "Upgrade to Premium to save photos"}
          </span>
        </div>
      )}
    </>
  );
}
