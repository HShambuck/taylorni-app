// src/components/Sidebar.jsx
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserType } from "@/store/slices/authSlice";

// Icon Components
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
  >
    <path
      d="M3 12h18M3 6h18M3 18h18"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
  >
    <path
      d="M6 18L18 6M6 6l12 12"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LogoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    className="w-8 h-8"
  >
    <path
      d="M3 6h18M3 12h18M3 18h12"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PinIcon = ({ isPinned }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${isPinned ? "text-amber-500" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {isPinned ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 5h14a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 10h14a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 012-2z"
      />
    )}
  </svg>
);

const CloseButtonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
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

// Menu Item Icons
const icons = {
  home: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  ),
  "shopping-bag": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  ),
  ruler: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  ),
  storefront: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  ),
  cart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  ),
  "plus-circle": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  ),
  eye: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  ),
  users: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  ),
  "paint-brush": (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  ),
};

const MenuItemIcon = ({ iconName }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {icons[iconName] || icons.home}
  </svg>
);

const Sidebar = ({ onSidebarStateChange }) => {
  const location = useLocation();
  const hoverTimeoutRef = useRef(null);
  const prevStateRef = useRef({ isExpanded: false, isPinned: false });

  // Get userType from Redux
  const userType = useSelector(selectUserType);

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
  const [isPinned, setIsPinned] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Define menu items dynamically based on userType
  const menuItems = useMemo(() => {
    if (userType === "client") {
      return [
        { name: "Overview", path: "/client", icon: "home" },
        { name: "Orders", path: "/client/orders", icon: "shopping-bag" },
        { name: "Measurements", path: "/client/measurements", icon: "ruler" },
        { name: "Marketplace", path: "/client/marketplace", icon: "storefront" },
        { name: "Shopping Cart", path: "/client/cart", icon: "cart" },
        { name: "Place Custom Order", path: "/client/custom-order", icon: "plus-circle" },
        { name: "Virtual Try-On", path: "/client/try-on", icon: "eye" },
      ];
    } else if (userType === "designer") {
      return [
        { name: "Overview", path: "/designer", icon: "home" },
        { name: "Orders", path: "/designer/orders", icon: "shopping-bag" },
        { name: "Clients", path: "/designer/clients", icon: "users" },
        { name: "Manage Designs", path: "/designer/designs", icon: "paint-brush" },
        { name: "Measurements", path: "/designer/measurements", icon: "ruler" },
        { name: "Virtual Try-On", path: "/designer/try-on", icon: "eye" },
      ];
    }
    return [];
  }, [userType]);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Handle mouse enter to show sidebar (desktop only)
  const handleMouseEnter = useCallback(() => {
    if (isLargeScreen && !isPinned) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setIsExpanded(true);
    }
  }, [isLargeScreen, isPinned]);

  // Handle mouse leave to hide sidebar (desktop only, with delay)
  const handleMouseLeave = useCallback(() => {
    if (isLargeScreen && !isPinned && isExpanded) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 300);
    }
  }, [isLargeScreen, isPinned, isExpanded]);

  // Toggle pin state (desktop only)
  const togglePin = useCallback(() => {
    setIsPinned((prev) => {
      const newPinned = !prev;
      if (newPinned) {
        setIsExpanded(true);
      }
      localStorage.setItem("sidebarPinned", String(newPinned));
      return newPinned;
    });
  }, []);

  // Close sidebar
  const closeSidebar = useCallback(() => {
    if (isLargeScreen) {
      if (!isPinned) {
        setIsExpanded(false);
      }
    } else {
      setIsOpen(false);
    }
  }, [isLargeScreen, isPinned]);

  // On mobile, clicking a menu item should close the sidebar
  const handleMenuItemClick = useCallback(() => {
    if (!isLargeScreen) {
      setIsOpen(false);
    }
  }, [isLargeScreen]);

  // Emit sidebar state changes to parent - only when values actually change
  useEffect(() => {
    if (!isInitialized) return;

    const prevState = prevStateRef.current;
    const hasChanged =
      prevState.isExpanded !== isExpanded || prevState.isPinned !== isPinned;

    if (hasChanged && onSidebarStateChange) {
      prevStateRef.current = { isExpanded, isPinned };
      onSidebarStateChange({ isExpanded, isPinned });
    }
  }, [isExpanded, isPinned, isInitialized, onSidebarStateChange]);

  // Handle resize events and initialization
  useEffect(() => {
    const handleResize = () => {
      const newIsLargeScreen = window.innerWidth >= 1024;

      if (newIsLargeScreen !== isLargeScreen) {
        setIsLargeScreen(newIsLargeScreen);

        if (newIsLargeScreen) {
          setIsOpen(false);
          const savedPinState = localStorage.getItem("sidebarPinned");
          if (savedPinState === "true") {
            setIsPinned(true);
            setIsExpanded(true);
          } else {
            setIsExpanded(false);
          }
        } else {
          setIsExpanded(false);
          setIsOpen(false);
        }
      }
    };

    // Initial setup
    const savedPinState = localStorage.getItem("sidebarPinned");
    if (savedPinState === "true") {
      setIsPinned(true);
      if (window.innerWidth >= 1024) {
        setIsExpanded(true);
      }
    }

    // Mark as initialized after initial setup
    setIsInitialized(true);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLargeScreen]);

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        if (isLargeScreen) {
          if (isPinned) {
            setIsPinned(false);
            localStorage.setItem("sidebarPinned", "false");
          }
          setIsExpanded(false);
        } else {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isLargeScreen, isPinned]);

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Determine sidebar classes
  const getSidebarClasses = () => {
    const baseClasses =
      "fixed top-0 left-0 h-full z-40 bg-white rounded-r-lg shadow-md transition-all duration-300 overflow-y-auto";

    if (isLargeScreen) {
      return `${baseClasses} ${
        isExpanded ? "w-64 p-4" : "w-0 p-0 overflow-hidden"
      }`;
    } else {
      return `${baseClasses} w-64 p-4 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`;
    }
  };

  return (
    <div onMouseLeave={handleMouseLeave} className="h-full">
      {/* Mobile hamburger menu button */}
      {!isLargeScreen && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={toggleMobileMenu}
            className="bg-amber-500 rounded-full p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      )}

      {/* Hover trigger area on the left side of the screen (desktop only) */}
      {!isPinned && !isExpanded && isLargeScreen && (
        <div
          onMouseEnter={handleMouseEnter}
          className="fixed top-0 left-0 w-4 h-full z-30 cursor-pointer"
        />
      )}

      {/* Overlay for mobile */}
      {isOpen && !isLargeScreen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-30 transition-opacity duration-300 bg-black/50"
        />
      )}

      {/* Sidebar */}
      <aside onMouseEnter={handleMouseEnter} className={getSidebarClasses()}>
        {/* Logo and Pin button */}
        <div className="flex items-center mb-8 justify-between">
          <div className="flex items-center">
            <div className="bg-amber-500 rounded-full p-2 mr-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <LogoIcon />
              </div>
            </div>
            <span className="text-2xl font-semibold text-gray-700">
              Tailorni
            </span>
          </div>

          {/* Pin button (desktop only) */}
          {isLargeScreen && (
            <button
              onClick={togglePin}
              className="text-gray-500 hover:text-gray-700 p-1"
              title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
            >
              <PinIcon isPinned={isPinned} />
            </button>
          )}

          {/* Close button (only for mobile) */}
          {!isLargeScreen && (
            <button
              onClick={closeSidebar}
              className="text-gray-500 hover:text-gray-700"
            >
              <CloseButtonIcon />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleMenuItemClick}
              className={`
                flex items-center p-3 rounded-lg transition-colors group
                ${
                  location.pathname === item.path
                    ? "bg-amber-500 text-white"
                    : "text-gray-600 hover:bg-amber-100"
                }
              `}
            >
              <MenuItemIcon iconName={item.icon} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;