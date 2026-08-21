// src/hooks/useSidebar.js
import { useState, useEffect, useCallback, useRef } from "react";

export const useSidebar = (onStateChange) => {
  const hoverTimeoutRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isLargeScreen && !isPinned) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setIsExpanded(true);
    }
  }, [isLargeScreen, isPinned]);

  const handleMouseLeave = useCallback(() => {
    if (isLargeScreen && !isPinned && isExpanded) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 300);
    }
  }, [isLargeScreen, isPinned, isExpanded]);

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

  const closeSidebar = useCallback(() => {
    if (isLargeScreen) {
      if (!isPinned) {
        setIsExpanded(false);
      }
    } else {
      setIsOpen(false);
    }
  }, [isLargeScreen, isPinned]);

  const handleMenuItemClick = useCallback(() => {
    if (!isLargeScreen) {
      closeSidebar();
    }
  }, [isLargeScreen, closeSidebar]);

  useEffect(() => {
    if (onStateChange) {
      onStateChange({ isExpanded, isPinned });
    }
  }, [isExpanded, isPinned, onStateChange]);

  useEffect(() => {
    const handleResize = () => {
      const newIsLargeScreen = window.innerWidth >= 1024;
      if (newIsLargeScreen !== isLargeScreen) {
        setIsLargeScreen(newIsLargeScreen);
        if (newIsLargeScreen) {
          setIsOpen(false);
          const savedPinState = localStorage.getItem("sidebarPinned");
          setIsExpanded(savedPinState === "true");
        } else {
          setIsExpanded(false);
          setIsOpen(false);
        }
      }
    };

    handleResize();
    const savedPinState = localStorage.getItem("sidebarPinned");
    if (savedPinState === "true") {
      setIsPinned(true);
      if (window.innerWidth >= 1024) {
        setIsExpanded(true);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLargeScreen]);

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

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return {
    isOpen,
    isExpanded,
    isLargeScreen,
    isPinned,
    toggleMobileMenu,
    handleMouseEnter,
    handleMouseLeave,
    togglePin,
    closeSidebar,
    handleMenuItemClick,
  };
};