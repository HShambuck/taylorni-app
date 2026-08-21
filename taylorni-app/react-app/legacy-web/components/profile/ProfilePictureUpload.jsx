// src/components/profile/ProfilePictureUpload.jsx
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAvatar, selectUserInfo } from "@/store/slices/authSlice";

// Icons
const CameraIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ProfilePictureUpload = ({ onSuccess, onError }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const [preview, setPreview] = useState(userInfo?.avatar);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleUpload = async () => {
    if (!preview || preview === userInfo?.avatar) return;

    setIsLoading(true);
    try {
      await dispatch(updateAvatar(preview)).unwrap();
      onSuccess("Profile picture updated successfully!");
    } catch (error) {
      onError(error || "Failed to upload picture");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(userInfo?.avatar);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasNewImage = preview !== userInfo?.avatar;

  return (
    <div className="space-y-6">
      {/* Current Photo & Preview */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Photo Preview */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
            <img
              src={preview || "/images/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "/images/default-avatar.png"; }}
            />
          </div>
          {/* Overlay on hover */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <CameraIcon />
          </button>
          {/* Change indicator */}
          {hasNewImage && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-gray-900">Profile Photo</h3>
          <p className="text-sm text-gray-500 mt-1">
            This will be displayed on your profile and visible to other users.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-purple-900 text-white text-sm font-medium rounded-lg hover:bg-purple-800 transition-colors"
            >
              Choose Photo
            </button>
            {hasNewImage && (
              <button
                onClick={handleRemove}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                <TrashIcon />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-purple-500 bg-purple-50"
            : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center">
          <div className={`mb-3 ${isDragging ? "text-purple-600" : "text-gray-400"}`}>
            <UploadIcon />
          </div>
          <p className="text-sm font-medium text-gray-700">
            {isDragging ? "Drop your image here" : "Drag and drop your image here"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            or click to browse from your device
          </p>
          <p className="text-xs text-gray-400 mt-3">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Photo Guidelines</h4>
        <ul className="text-sm text-gray-500 space-y-1">
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Use a clear, recent photo of yourself
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Make sure your face is clearly visible
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Square images work best (1:1 ratio)
          </li>
        </ul>
      </div>

      {/* Save Button */}
      {hasNewImage && (
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
              isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-purple-900 text-white hover:bg-purple-800 shadow-sm hover:shadow"
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Photo
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;