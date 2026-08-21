// src/hooks/useIntersectionObserver.js
import { useState, useEffect, useRef } from "react";

export const useIntersectionObserver = (options = { threshold: 0.2 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      });
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [options.threshold]);

  return [ref, isVisible];
};

// Hook for staggered animations
export const useStaggeredAnimation = (isVisible, itemCount, delay = 150) => {
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    if (!isVisible) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < itemCount) {
        setVisibleItems((prev) => [...prev, currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [isVisible, itemCount, delay]);

  return visibleItems;
};