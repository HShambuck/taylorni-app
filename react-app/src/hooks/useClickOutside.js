// src/hooks/useClickOutside.js
import { useEffect } from "react";

/**
 * Hook that detects clicks outside of the passed ref
 * @param {React.RefObject} ref - The ref to detect clicks outside of
 * @param {Function} callback - The callback to execute when clicked outside
 */
export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

/**
 * Hook that detects clicks outside of multiple refs
 * @param {React.RefObject[]} refs - Array of refs to detect clicks outside of
 * @param {Function} callback - The callback to execute when clicked outside
 */
export const useClickOutsideMultiple = (refs, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target)
      );

      if (isOutside) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
};