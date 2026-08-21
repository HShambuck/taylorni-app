// src/components/ui/SignupModal.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signup,  // Add signup action
  selectAuthLoading,
  selectAuthError,
  clearError,  // Add clearError
} from "@/store/slices/authSlice";

// Close Icon Component
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Google Icon
const GoogleIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

// Facebook Icon
const FacebookIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
  >
    <path
      fill="#3B5998"
      d="M46.105 0H1.895A1.895 1.895 0 0 0 0 1.895v44.21A1.895 1.895 0 0 0 1.895 48h23.785V29.414h-6.263v-7.355h6.263v-5.406c0-6.304 3.85-9.743 9.452-9.743 2.7 0 5.015.2 5.69.29v6.61h-3.9c-3.057 0-3.656 1.447-3.656 3.571v4.678h7.307l-.955 7.355h-6.352V48h12.839A1.895 1.895 0 0 0 48 46.105V1.895A1.895 1.895 0 0 0 46.105 0z"
    />
  </svg>
);

// User Type Option Component
const UserTypeOption = ({ type, label, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`
      border rounded-md p-3 flex items-center cursor-pointer transition-colors
      ${
        selected
          ? "border-amber-500 bg-amber-50"
          : "border-gray-300 hover:border-gray-400"
      }
    `}
  >
    <div className="mr-2">
      <div
        className={`
          w-4 h-4 rounded-full border-2 flex items-center justify-center
          ${selected ? "border-amber-500" : "border-gray-400"}
        `}
      >
        {selected && <div className="w-2 h-2 rounded-full bg-amber-500" />}
      </div>
    </div>
    <span>{label}</span>
  </div>
);

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const isLoadingFromStore = useSelector(selectAuthLoading);
  const errorFromStore = useSelector(selectAuthError);

  // Form state
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "client",
    acceptTerms: false,
  });

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");  // Added local error state

  // Combined error (local or from store)
  const error = localError || errorFromStore;

  // Form validation
  const formValid = useMemo(() => {
    return (
      signupForm.firstName &&
      signupForm.lastName &&
      signupForm.email &&
      signupForm.password &&
      signupForm.password === signupForm.confirmPassword &&
      signupForm.password.length >= 6 &&
      signupForm.acceptTerms
    );
  }, [signupForm]);

  // Password match validation
  const passwordsMatch = useMemo(() => {
    if (!signupForm.confirmPassword) return true; // Don't show error if empty
    return signupForm.password === signupForm.confirmPassword;
  }, [signupForm.password, signupForm.confirmPassword]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear errors when user types
    if (localError) setLocalError("");
    if (errorFromStore) dispatch(clearError());
  };

  // Handle user type selection
  const handleUserTypeChange = (type) => {
    setSignupForm((prev) => ({
      ...prev,
      userType: type,
    }));
  };

  // Reset form
  const resetForm = () => {
    setSignupForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "client",
      acceptTerms: false,
    });
    setLocalError("");
    dispatch(clearError());
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle switch to login
  const handleSwitchToLogin = (e) => {
    e.preventDefault();
    handleClose();
    onSwitchToLogin?.();
  };

  // Form submission
  const submitSignup = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!formValid) {
      if (signupForm.password !== signupForm.confirmPassword) {
        setLocalError("Passwords do not match.");
      } else if (signupForm.password.length < 6) {
        setLocalError("Password must be at least 6 characters.");
      } else if (!signupForm.acceptTerms) {
        setLocalError("Please accept the terms and conditions.");
      } else {
        setLocalError("Please fill in all required fields.");
      }
      return;
    }

    setIsLoading(true);
    setLocalError("");

    const userDetails = {
      firstName: signupForm.firstName,
      lastName: signupForm.lastName,
      email: signupForm.email,
      password: signupForm.password,
      userType: signupForm.userType,
    };

    try {
      await dispatch(signup(userDetails)).unwrap();
      handleClose();
      // Optionally switch to login or auto-login
      onSwitchToLogin?.();
    } catch (err) {
      // Error is handled by Redux, but we can also set local error
      console.error("Signup failed:", err);
      if (typeof err === "string") {
        setLocalError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Social login handlers
  const handleGoogleLogin = (e) => {
    e.preventDefault();
    console.log("Google login clicked");
    // Add Google OAuth logic
  };

  const handleFacebookLogin = (e) => {
    e.preventDefault();
    console.log("Facebook login clicked");
    // Add Facebook OAuth logic
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-purple-900">Create Account</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={submitSignup} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={signupForm.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={signupForm.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={signupForm.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={signupForm.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                signupForm.password && signupForm.password.length < 6
                  ? "border-red-300"
                  : "border-gray-300"
              }`}
              required
            />
            <p className={`text-xs mt-1 ${
              signupForm.password && signupForm.password.length < 6
                ? "text-red-500"
                : "text-gray-500"
            }`}>
              Password must be at least 6 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-medium mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={signupForm.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                !passwordsMatch ? "border-red-300" : "border-gray-300"
              }`}
              required
            />
            {!passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          {/* User Type Selection */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <UserTypeOption
                type="client"
                label="Client"
                selected={signupForm.userType === "client"}
                onClick={() => handleUserTypeChange("client")}
              />
              <UserTypeOption
                type="designer"
                label="Designer"
                selected={signupForm.userType === "designer"}
                onClick={() => handleUserTypeChange("designer")}
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="acceptTerms"
                type="checkbox"
                checked={signupForm.acceptTerms}
                onChange={handleInputChange}
                className="w-4 h-4 border border-gray-300 rounded focus:ring-amber-500 text-amber-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-amber-500 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-amber-500 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formValid || isLoading || isLoadingFromStore}
            className={`
              w-full py-3 px-4 rounded-md transition duration-200 font-medium
              ${
                formValid && !isLoading && !isLoadingFromStore
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {isLoading || isLoadingFromStore ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="#"
                onClick={handleSwitchToLogin}
                className="text-amber-500 hover:underline font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </form>

        {/* Social Login Options */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
            >
              <GoogleIcon />
              Google
            </button>
            <button
              type="button"
              onClick={handleFacebookLogin}
              className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
            >
              <FacebookIcon />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;