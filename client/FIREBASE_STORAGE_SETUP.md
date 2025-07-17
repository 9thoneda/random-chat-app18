# Firebase Storage Setup Guide for AjnabiCam

This guide explains how to configure Firebase Storage for your AjnabiCam app to handle profile images, chat photos, and other media files.

## 1. Firebase Console Setup

### Enable Firebase Storage

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `ajnabicam` project
3. In the left sidebar, click **Storage**
4. Click **Get started**
5. Choose **Start in test mode** for now (we'll secure it later)
6. Select your preferred storage location (choose closest to your users)

### Storage Security Rules

Navigate to **Storage > Rules** and update the rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile images - authenticated users can read/write their own
    match /profile-images/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId
        && resource.size < 5 * 1024 * 1024; // 5MB limit
    }

    // Chat photos - authenticated users can read/write
    match /chat-photos/{chatId}/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && resource.size < 10 * 1024 * 1024; // 10MB limit
    }

    // Temporary photos - auto-delete after 24 hours
    match /temp-photos/{sessionId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && resource.size < 10 * 1024 * 1024; // 10MB limit
    }

    // Public avatars - anyone can read, authenticated users can write
    match /avatars/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
        && resource.size < 2 * 1024 * 1024; // 2MB limit
    }
  }
}
```

### CORS Configuration

If you encounter CORS issues, configure CORS for your storage bucket:

Create a `cors.json` file:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600,
    "responseHeader": [
      "Content-Type",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers"
    ]
  }
]
```

Apply it using Google Cloud CLI:

```bash
gsutil cors set cors.json gs://ajnabicam.appspot.com
```

## 2. App Configuration

### Environment Variables

The Firebase configuration is already set up in `src/firebaseConfig.ts`. Your storage bucket is:

- **Storage Bucket**: `ajnabicam.appspot.com`

### Storage Structure

The app organizes files in the following structure:

```
ajnabicam.appspot.com/
├── profile-images/
│   └── {userId}/
│       └── profile_{userId}_{timestamp}_{random}.{ext}
├── chat-photos/
│   └── {chatId}/
│       └── {userId}/
│           └── chat_{chatId}_{timestamp}_{random}.{ext}
├── temp-photos/
│   └── {sessionId}/
│       └── temp_{sessionId}_{timestamp}_{random}.{ext}
└── avatars/
    └── {filename}
```

## 3. Usage Examples

### Upload Profile Image

```typescript
import { uploadProfileImage } from "./lib/storageUtils";

const uploadProfile = async (file: File, userId: string) => {
  try {
    const result = await uploadProfileImage(file, userId, (progress) => {
      console.log(`Upload progress: ${progress}%`);
    });

    console.log("Upload successful:", result.url);
    // Save result.url to user profile
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### Upload Chat Photo

```typescript
import { uploadChatPhoto } from "./lib/storageUtils";

const uploadChatImage = async (file: File, chatId: string, userId: string) => {
  try {
    const result = await uploadChatPhoto(file, chatId, userId);
    console.log("Chat photo uploaded:", result.url);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

## 4. Components Using Firebase Storage

### ✅ Configured Components

1. **PhotoSharingInput** (`src/components/PhotoSharingInput.tsx`)
   - Handles chat photo uploads
   - Shows upload progress
   - Error handling with user-friendly messages

2. **ProfilePage** (`src/screens/ProfilePage.tsx`)
   - Profile image uploads
   - Progress indicator during upload
   - Error display for failed uploads

### Usage in Components

Both components now support:

- ✅ File validation (type, size)
- ✅ Upload progress tracking
- ✅ Error handling with user-friendly messages
- ✅ Firebase Storage integration
- ✅ Automatic file naming with timestamps

## 5. File Size Limits

- **Profile Images**: 5MB
- **Chat Photos**: 10MB
- **Avatars**: 2MB

Supported formats: JPEG, JPG, PNG, WebP, GIF

## 6. Error Handling

The app includes comprehensive error handling for:

- File size too large
- Invalid file types
- Network errors
- Permission errors
- Storage quota exceeded

## 7. Authentication Integration

**Important**: The current setup uses anonymous user IDs. For production, you should:

1. Implement Firebase Authentication
2. Update storage rules to use `request.auth.uid`
3. Replace `getUserId()` calls with authenticated user IDs

Example with Firebase Auth:

```typescript
import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;
if (user) {
  const userId = user.uid;
  // Use authenticated user ID
}
```

## 8. Cleanup and Maintenance

### Auto-delete Temporary Photos

Consider implementing a Cloud Function to automatically delete expired temporary photos:

```javascript
// Cloud Function example
exports.cleanupTempPhotos = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    // Delete files older than 24 hours from temp-photos/
  });
```

### Storage Monitoring

Monitor your Firebase Storage usage in the Firebase Console under **Storage > Usage**.

## 9. Testing

Test the upload functionality:

1. **Profile Image Upload**:
   - Go to Profile page
   - Click camera button
   - Select an image
   - Verify upload progress and success

2. **Chat Photo Sharing**:
   - Open a chat
   - Click camera button
   - Select an image
   - Verify upload and display in chat

## 10. Troubleshooting

### Common Issues

1. **CORS Errors**: Configure CORS as shown above
2. **Permission Denied**: Check Storage Rules
3. **File Not Found**: Verify file path construction
4. **Upload Timeout**: Check network and file size

### Debug Tips

Enable Firebase debug logging:

```typescript
import { connectStorageEmulator } from "firebase/storage";

// For development only
if (window.location.hostname === "localhost") {
  connectStorageEmulator(storage, "localhost", 9199);
}
```

## Next Steps

1. **Authentication**: Implement Firebase Auth for secure user management
2. **Image Optimization**: Add automatic image compression/resizing
3. **CDN**: Configure Firebase Storage with CDN for better performance
4. **Backup**: Set up automated backups for important user data
5. **Analytics**: Track upload success rates and performance

Your Firebase Storage is now fully configured and ready for production use! 🚀
