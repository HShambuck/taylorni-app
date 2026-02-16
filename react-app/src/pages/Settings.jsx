// src/pages/Settings.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUserType, selectUserInfo } from "@/store/slices/authSlice";

import EditProfileForm from "@/components/profile/EditProfileForm";
import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload";
import ChangePassword from "@/components/profile/ChangePassword";
import SocialLinks from "@/components/profile/SocialLinks";

// Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CameraIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userType = useSelector(selectUserType);
  const userInfo = useSelector(selectUserInfo);
  
  const basePath = userType === "designer" ? "/designer" : "/client";

  const initialTab = location.state?.tab || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const handleSuccess = (message) => {
    setAlert({ show: true, type: "success", message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
  };

  const handleError = (message) => {
    setAlert({ show: true, type: "error", message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <UserIcon />, description: "Update your personal info" },
    { id: "picture", label: "Photo", icon: <CameraIcon />, description: "Change profile picture" },
    { id: "password", label: "Password", icon: <LockIcon />, description: "Update your password" },
    { id: "social", label: "Social", icon: <LinkIcon />, description: "Connect social accounts" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`${basePath}/profile`}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Alert */}
        {alert.show && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              alert.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              alert.type === "success" ? "bg-green-100" : "bg-red-100"
            }`}>
              {alert.type === "success" ? <CheckIcon /> : <XIcon />}
            </div>
            <p className="font-medium">{alert.message}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* User Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={userInfo?.avatar || "/images/default-avatar.png"}
                    alt={userInfo?.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{userInfo?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${
                    activeTab === tab.id
                      ? "bg-purple-50 border-l-4 border-purple-900 text-purple-900"
                      : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                >
                  <div className={`flex-shrink-0 ${activeTab === tab.id ? "text-purple-900" : "text-gray-400"}`}>
                    {tab.icon}
                  </div>
                  <div>
                    <p className={`font-medium ${activeTab === tab.id ? "text-purple-900" : "text-gray-900"}`}>
                      {tab.label}
                    </p>
                    <p className="text-xs text-gray-500 hidden sm:block">{tab.description}</p>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Tab Header */}
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-900">
                    {tabs.find((t) => t.id === activeTab)?.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {tabs.find((t) => t.id === activeTab)?.label}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {tabs.find((t) => t.id === activeTab)?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "profile" && (
                  <EditProfileForm onSuccess={handleSuccess} onError={handleError} />
                )}

                {activeTab === "picture" && (
                  <ProfilePictureUpload onSuccess={handleSuccess} onError={handleError} />
                )}

                {activeTab === "password" && (
                  <ChangePassword onSuccess={handleSuccess} onError={handleError} />
                )}

                {activeTab === "social" && (
                  <SocialLinks onSuccess={handleSuccess} onError={handleError} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;