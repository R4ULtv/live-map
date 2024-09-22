"use client";

import { createContext, useState, useContext, useEffect } from "react";

const CommandMenuContext = createContext();

export function CommandMenuProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCountrySearchOpen, setIsCountrySearchOpen] = useState(false);
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isShowFps, setIsShowFps] = useState(false);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const storedPosition = localStorage.getItem("nav-position");
    if (storedPosition) {
      setPosition(storedPosition);
    } else {
      localStorage.setItem("nav-position", "bottom");
      setPosition("bottom");
    }
  }, []);

  const toggleFps = () => {
    setIsShowFps((prev) => !prev);
  };

  const rotatePosition = () => {
    setPosition((prev) => {
      const newPosition = prev === "bottom" ? "left" : "bottom";
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
        position,
        rotatePosition,
      }}
    >
      {children}
    </CommandMenuContext.Provider>
  );
}

export function useCommandMenu() {
  return useContext(CommandMenuContext);
}
