// src/components/profile/ChangePassword.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "@/store/slices/authSlice";

// Icons
const LockIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChangePassword = ({ onSuccess, onError }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Password validation rules
  const passwordRules = [
    { label: "At least 6 characters", valid: formData.newPassword.length >= 6 },
    { label: "Contains a number", valid: /\d/.test(formData.newPassword) },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(formData.newPassword) },
    { label: "Passwords match", valid: formData.newPassword === formData.confirmPassword && formData.confirmPassword !== "" },
  ];

  const isFormValid = passwordRules.every((rule) => rule.valid) && formData.currentPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      onError("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      onError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(
        changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        })
      ).unwrap();
      onSuccess("Password changed successfully!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      onError(error || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordInput = ({ name, label, value, placeholder, showPassword, onToggle }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LockIcon />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={handleChange}
          className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Security Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-amber-800">Security Tip</h4>
            <p className="text-sm text-amber-700 mt-1">
              Use a strong password that you don't use on other websites. Consider using a mix of letters, numbers, and symbols.
            </p>
          </div>
        </div>
      </div>

      {/* Current Password */}
      <PasswordInput
        name="currentPassword"
        label="Current Password"
        value={formData.currentPassword}
        placeholder="Enter your current password"
        showPassword={showPasswords.current}
        onToggle={() => togglePasswordVisibility("current")}
      />

      {/* New Password */}
      <PasswordInput
        name="newPassword"
        label="New Password"
        value={formData.newPassword}
        placeholder="Enter your new password"
        showPassword={showPasswords.new}
        onToggle={() => togglePasswordVisibility("new")}
      />

      {/* Confirm Password */}
      <PasswordInput
        name="confirmPassword"
        label="Confirm New Password"
        value={formData.confirmPassword}
        placeholder="Confirm your new password"
        showPassword={showPasswords.confirm}
        onToggle={() => togglePasswordVisibility("confirm")}
      />

      {/* Password Requirements */}
      {formData.newPassword && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Password Requirements</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {passwordRules.map((rule, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 text-sm ${
                  rule.valid ? "text-green-600" : "text-gray-400"
                }`}
              >
                {rule.valid ? (
                  <CheckCircleIcon />
                ) : (
                  <XCircleIcon />
                )}
                {rule.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
            isLoading || !isFormValid
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
              Updating...
            </>
          ) : (
            <>
              <LockIcon />
              Update Password
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;