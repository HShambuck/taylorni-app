// src/components/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "@/components/ui/LoginModal";
import SignupModal from "@/components/ui/SignupModal";

// Icon Components
const HamburgerIcon = () => (
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
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

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

// Navigation Links Data
const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const toggleMobileMenu = () => {
  setMobileMenuOpen((prev) => !prev);
};


   // Modal handlers with switching capability
  const openLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
    setMobileMenuOpen(false);
  };

  const openSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
    setMobileMenuOpen(false);
  };

  const closeLogin = () => setIsLoginModalOpen(false);
  const closeSignup = () => setIsSignupModalOpen(false);

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-amber-400 to-yellow-600 py-4 px-4 md:px-20 flex justify-between items-center">
        <Link to="/" className="text-2xl text-white font-bold">
          TAILORNII
        </Link>

        {/* Mobile Menu Button (visible only on small screens) */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>

        {/* Desktop Menu (hidden on small screens) */}
        <div className="hidden md:flex space-x-8 md:space-x-20 items-center">
          <div className="space-x-4 md:space-x-10 text-lg font-semibold menu-horizontal">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white hover:text-gray-200 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div>
            <button
              className="btn bg-white text-amber-500 px-3 py-1 rounded-full rounded-r-none border-purple-800 hover:bg-gray-100 transition-colors"
              onClick={openLogin}
            >
              Sign in
            </button>
            <button
              className="btn bg-purple-800 border-purple-800 text-white px-3 py-1 rounded-full rounded-l-none hover:bg-purple-900 transition-colors"
              onClick={openSignup}
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (slides down when hamburger is clicked) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-amber-400 text-white p-4 transition-all duration-300 ease-in-out">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleLinkClick}
                className="text-white hover:text-gray-200 font-semibold py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="flex pt-2">
              <button
                className="btn bg-white text-amber-500 px-4 py-1 rounded-full rounded-r-none border-purple-800 hover:bg-gray-100 transition-colors"
                onClick={openLogin}
              >
                Sign in
              </button>
              <button
                className="btn bg-purple-800 border-purple-800 text-white px-4 py-1 rounded-full rounded-l-none hover:bg-purple-900 transition-colors"
                onClick={openSignup}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
       <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLogin}
        onSwitchToSignup={openSignup}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={closeSignup}
        onSwitchToLogin={openLogin}
      />
    </>
  );
};

export default Navbar;