// src/components/profile/EditProfileForm.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, selectUserInfo } from "@/store/slices/authSlice";

// Icons
const UserIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const EditProfileForm = ({ onSuccess, onError }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  const [formData, setFormData] = useState({
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    address: userInfo?.address || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(updateProfile(formData)).unwrap();
      onSuccess("Profile updated successfully!");
    } catch (error) {
      onError(error || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = () => {
    return (
      formData.firstName !== (userInfo?.firstName || "") ||
      formData.lastName !== (userInfo?.lastName || "") ||
      formData.email !== (userInfo?.email || "") ||
      formData.phone !== (userInfo?.phone || "") ||
      formData.address !== (userInfo?.address || "")
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            First Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon />
            </div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="John"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Last Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon />
            </div>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Doe"
              required
            />
          </div>
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MailIcon />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="john.doe@example.com"
            required
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          We'll never share your email with anyone else.
        </p>
      </div>

      {/* Phone Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <PhoneIcon />
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="+233 XX XXX XXXX"
          />
        </div>
      </div>

      {/* Address Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Address
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <LocationIcon />
          </div>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={3}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
            placeholder="Enter your full address..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          {hasChanges() ? (
            <span className="text-amber-600 font-medium">You have unsaved changes</span>
          ) : (
            "All changes saved"
          )}
        </p>
        <button
          type="submit"
          disabled={isLoading || !hasChanges()}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
            isLoading || !hasChanges()
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
              Saving...
            </>
          ) : (
            <>
              <SaveIcon />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;