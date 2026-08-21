// src/components/ui/LoginModal.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  selectAuthLoading,
  selectAuthError,
  selectUserType,
  clearError,
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

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Facebook Icon Component
const FacebookIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const isLoadingFromStore = useSelector(selectAuthLoading);
  const errorFromStore = useSelector(selectAuthError);
  const userType = useSelector(selectUserType);

  // Form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Local loading state
  const [isLoading, setIsLoading] = useState(false);

  // Form validation
  const formValid = useMemo(() => {
    return (
      loginForm.email && loginForm.password && loginForm.password.length >= 6
    );
  }, [loginForm.email, loginForm.password]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errorFromStore) {
      dispatch(clearError());
    }
  };

  // Reset form
  const resetForm = () => {
    setLoginForm({
      email: "",
      password: "",
      rememberMe: false,
    });
    dispatch(clearError());
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Submit function
  const submitLogin = async (e) => {
    e.preventDefault();

    if (!formValid) return;

    setIsLoading(true);

    try {
      const result = await dispatch(
        login({
          email: loginForm.email,
          password: loginForm.password,
        })
      ).unwrap();

      if (result.userType === "designer") {
        navigate("/designer");
      } else {
        navigate("/client");
      }

      handleClose();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log("Forgot password requested for:", loginForm.email);
  };

  // Handle switch to signup
  const handleSwitchToSignup = (e) => {
    e.preventDefault();
    handleClose();
    onSwitchToSignup?.();
  };

  // Social login handlers
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Add your Google OAuth logic here
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
    // Add your Facebook OAuth logic here
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-purple-900">Sign In</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submitLogin} className="space-y-4">
          {/* Error Alert */}
          {errorFromStore && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
              role="alert"
            >
              <p>{errorFromStore}</p>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={loginForm.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 border rounded focus:ring-amber-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-gray-600"
              >
                Remember me
              </label>
            </div>
            <a
              href="#"
              onClick={handleForgotPassword}
              className="text-sm text-amber-500 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formValid || isLoading || isLoadingFromStore}
            className={`
              w-full py-3 px-4 rounded-md transition duration-200
              ${
                formValid && !isLoading && !isLoadingFromStore
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {isLoading || isLoadingFromStore ? "Signing in..." : "Sign In"}
          </button>

          {/* Sign Up Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                onClick={handleSwitchToSignup}
                className="text-amber-500 hover:underline"
              >
                Sign up
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

export default LoginModal;