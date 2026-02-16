// src/components/profile/SocialLinks.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSocialLinks, selectUserInfo } from "@/store/slices/authSlice";

// Social Platform Icons
const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
    <defs>
      <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFDC80"/>
        <stop offset="50%" stopColor="#F56040"/>
        <stop offset="100%" stopColor="#833AB4"/>
      </linearGradient>
    </defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1DA1F2">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const LinkIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const SocialLinks = ({ onSuccess, onError }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  const [formData, setFormData] = useState({
    facebook: userInfo?.socialLinks?.facebook || "",
    instagram: userInfo?.socialLinks?.instagram || "",
    twitter: userInfo?.socialLinks?.twitter || "",
    linkedin: userInfo?.socialLinks?.linkedin || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(updateSocialLinks(formData)).unwrap();
      onSuccess("Social links updated successfully!");
    } catch (error) {
      onError(error || "Failed to update social links");
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = () => {
    return (
      formData.facebook !== (userInfo?.socialLinks?.facebook || "") ||
      formData.instagram !== (userInfo?.socialLinks?.instagram || "") ||
      formData.twitter !== (userInfo?.socialLinks?.twitter || "") ||
      formData.linkedin !== (userInfo?.socialLinks?.linkedin || "")
    );
  };

  const socialPlatforms = [
    {
      name: "facebook",
      label: "Facebook",
      icon: <FacebookIcon />,
      placeholder: "https://facebook.com/yourprofile",
      color: "bg-blue-50 border-blue-200 focus-within:border-blue-400",
      description: "Connect your Facebook profile",
    },
    {
      name: "instagram",
      label: "Instagram",
      icon: <InstagramIcon />,
      placeholder: "https://instagram.com/yourprofile",
      color: "bg-pink-50 border-pink-200 focus-within:border-pink-400",
      description: "Share your Instagram handle",
    },
    {
      name: "twitter",
      label: "Twitter",
      icon: <TwitterIcon />,
      placeholder: "https://twitter.com/yourprofile",
      color: "bg-sky-50 border-sky-200 focus-within:border-sky-400",
      description: "Link your Twitter account",
    },
    {
      name: "linkedin",
      label: "LinkedIn",
      icon: <LinkedInIcon />,
      placeholder: "https://linkedin.com/in/yourprofile",
      color: "bg-blue-50 border-blue-200 focus-within:border-blue-400",
      description: "Add your professional profile",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <LinkIcon />
          </div>
          <div>
            <h4 className="text-sm font-medium text-purple-800">Connect Your Profiles</h4>
            <p className="text-sm text-purple-700 mt-1">
              Add your social media links to help others find and connect with you across different platforms.
            </p>
          </div>
        </div>
      </div>

      {/* Social Links Grid */}
      <div className="space-y-4">
        {socialPlatforms.map((platform) => (
          <div
            key={platform.name}
            className={`rounded-xl border-2 p-4 transition-all ${
              focusedField === platform.name
                ? platform.color
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                {platform.icon}
              </div>

              {/* Input */}
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  {platform.label}
                </label>
                <input
                  type="url"
                  name={platform.name}
                  value={formData[platform.name]}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(platform.name)}
                  onBlur={() => setFocusedField(null)}
                  placeholder={platform.placeholder}
                  className="w-full px-0 py-1 bg-transparent border-0 border-b-2 border-gray-200 focus:border-purple-500 focus:ring-0 text-sm placeholder-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">{platform.description}</p>
              </div>

              {/* Status Indicator */}
              {formData[platform.name] && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Connected Count */}
      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">
          Connected profiles:
        </span>
        <span className="text-sm font-semibold text-purple-900">
          {Object.values(formData).filter(Boolean).length} of 4
        </span>
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Links
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SocialLinks;