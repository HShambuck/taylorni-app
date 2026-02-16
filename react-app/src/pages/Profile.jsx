// src/pages/Profile.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectUserInfo,
  selectUserType,
  selectIsAuthenticated,
} from "@/store/slices/authSlice";

// Icons
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const CameraIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const KeyIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Profile = () => {
  const userInfo = useSelector(selectUserInfo);
  const userType = useSelector(selectUserType);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const basePath = userType === "designer" ? "/designer" : "/client";

  const [measurements] = useState({
    height: "175 cm",
    chest: "95 cm",
    waist: "80 cm",
    hips: "98 cm",
  });

  const [orders] = useState([
    { id: 1, item: "Custom Kente Suit", date: "March 5, 2025", status: "Delivered" },
    { id: 2, item: "Casual Denim Jacket", date: "March 2, 2025", status: "Processing" },
    { id: 3, item: "Traditional Agbada", date: "Feb 28, 2025", status: "Delivered" },
  ]);

  const getStatusBadge = (status) => {
    const styles = {
      Delivered: "bg-green-100 text-green-800",
      Processing: "bg-amber-100 text-amber-800",
      Pending: "bg-gray-100 text-gray-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return `px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.Pending}`;
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-900">My Profile</h1>
          <p className="text-gray-600 mt-1">
            View and manage your personal information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Profile Header Background */}
              <div className="h-24 bg-gradient-to-r from-purple-900 to-purple-700" />
              
              {/* Profile Info */}
              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="relative -mt-12 mb-4">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                    <img
                      src={userInfo?.avatar || "/images/default-avatar.png"}
                      alt={userInfo?.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "/images/default-avatar.png"; }}
                    />
                  </div>
                  <Link
                    to={`${basePath}/settings`}
                    state={{ tab: "picture" }}
                    className="absolute bottom-0 right-0 p-1.5 bg-amber-500 rounded-full text-white hover:bg-amber-600 transition-colors shadow-sm"
                  >
                    <CameraIcon />
                  </Link>
                </div>

                {/* Name & Role */}
                <h2 className="text-xl font-bold text-gray-900">
                  {userInfo?.firstName} {userInfo?.lastName}
                </h2>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full capitalize">
                  {userType}
                </span>

                {/* Contact Info */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {userInfo?.email || "No email provided"}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {userInfo?.phone || "No phone provided"}
                  </div>
                  <div className="flex items-start text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{userInfo?.address || "No address provided"}</span>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <Link
                  to={`${basePath}/settings`}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition-colors font-medium"
                >
                  <EditIcon />
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Social Links</h3>
                <Link
                  to={`${basePath}/settings`}
                  state={{ tab: "social" }}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  Edit
                </Link>
              </div>
              
              {userInfo?.socialLinks && Object.values(userInfo.socialLinks).some(Boolean) ? (
                <div className="space-y-3">
                  {userInfo.socialLinks.facebook && (
                    <a
                      href={userInfo.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <span className="text-sm">Facebook</span>
                    </a>
                  )}
                  {userInfo.socialLinks.instagram && (
                    <a
                      href={userInfo.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <span className="text-sm">Instagram</span>
                    </a>
                  )}
                  {userInfo.socialLinks.twitter && (
                    <a
                      href={userInfo.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </div>
                      <span className="text-sm">Twitter</span>
                    </a>
                  )}
                  {userInfo.socialLinks.linkedin && (
                    <a
                      href={userInfo.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm mb-3">No social links added yet</p>
                  <Link
                    to={`${basePath}/settings`}
                    state={{ tab: "social" }}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    Add social links →
                  </Link>
                </div>
              )}
            </div>

            {/* Security Card */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Security</h3>
              <Link
                to={`${basePath}/settings`}
                state={{ tab: "password" }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <KeyIcon />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-xs text-gray-500">Update your password</p>
                  </div>
                </div>
                <ChevronRightIcon />
              </Link>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Measurements (Only for Clients) */}
            {userType === "client" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">My Measurements</h3>
                    <p className="text-sm text-gray-500">Used for custom orders</p>
                  </div>
                  <Link
                    to={`${basePath}/measurements`}
                    className="px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <EditIcon />
                    Update
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(measurements).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-gradient-to-br from-purple-50 to-amber-50 rounded-xl p-4 text-center"
                    >
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 capitalize">
                        {key}
                      </p>
                      <p className="text-xl font-bold text-purple-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                    <p className="text-sm text-gray-500">Your order history</p>
                  </div>
                  <Link
                    to={`${basePath}/orders`}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
                  >
                    View All
                    <ChevronRightIcon />
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No orders yet</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{order.item}</p>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                      </div>
                      <span className={getStatusBadge(order.status)}>
                        {order.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to={`${basePath}/settings`}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <EditIcon />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Edit Profile</p>
                    <p className="text-xs text-gray-500">Update your info</p>
                  </div>
                </Link>

                <Link
                  to={`${basePath}/settings`}
                  state={{ tab: "picture" }}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <CameraIcon />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Change Photo</p>
                    <p className="text-xs text-gray-500">Upload new picture</p>
                  </div>
                </Link>

                <Link
                  to={`${basePath}/settings`}
                  state={{ tab: "password" }}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <KeyIcon />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-xs text-gray-500">Update security</p>
                  </div>
                </Link>

                <Link
                  to={`${basePath}/settings`}
                  state={{ tab: "social" }}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Social Links</p>
                    <p className="text-xs text-gray-500">Connect accounts</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;