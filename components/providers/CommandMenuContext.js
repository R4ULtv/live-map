"use client";

import { createContext, useState, useContext, useEffect } from "react";

const CommandMenuContext = createContext();

export function CommandMenuProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCountrySearchOpen, setIsCountrySearchOpen] = useState(false);
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isShowFps, setIsShowFps] = useState(false);
  const [navPosition, setNavPosition] = useState(null);

  useEffect(() => {
    const storedPosition = localStorage.getItem("nav-position");
    if (storedPosition) {
      setNavPosition(storedPosition);
    } else {
      localStorage.setItem("nav-position", "bottom");
      setNavPosition("bottom");
    }
  }, []);

  const toggleFps = () => {
    setIsShowFps((prev) => !prev);
  };

  const rotateNavPosition = () => {
    setNavPosition((prev) => {
      let newPosition;
      switch (prev) {
        case "bottom":
          newPosition = "left";
          break;
        case "left":
          newPosition = "top";
          break;
        case "right":
          newPosition = "bottom";
          break;
        case "top":
          newPosition = "right";
          break;
        default:
          newPosition = "bottom";
      }
      localStorage.setItem("nav-position", newPosition);
      return newPosition;
    });
  };

  return (
    <CommandMenuContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isCountrySearchOpen,
        setIsCountrySearchOpen,
        isRequestInfoOpen,
        setIsRequestInfoOpen,
        selectedCountry,
        setSelectedCountry,
        isShowFps,
        toggleFps,
        navPosition,
        rotateNavPosition,
      }}
    >
      {children}
    </CommandMenuContext.Provider>
  );
}

export function useCommandMenu() {
  return useContext(CommandMenuContext);
}
