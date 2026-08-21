// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "@/components/ui/LoginModal";
import SignupModal from "@/components/ui/SignupModal";

const Login = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    if (!isLoginOpen && !isSignupOpen) {
      navigate("/");
    }
  }, [isLoginOpen, isSignupOpen, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </div>
  );
};

export default Login;
