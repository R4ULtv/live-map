"use client";

import { createContext, useState, useContext, useEffect } from "react";

const CommandMenuContext = createContext();

export function CommandMenuProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCountrySearchOpen, setIsCountrySearchOpen] = useState(false);
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isShowFps, setIsShowFps] = useState(false);
  const [fpsPosition, setFpsPosition] = useState(null);
  const [isShowNav, setIsShowNav] = useState(false);
  const [navPosition, setNavPosition] = useState(null);

  useEffect(() => {
    const storedNavPosition = localStorage.getItem("nav-position");
    const storedNavVisibility = localStorage.getItem("nav-visibility");
    const storedFpsPosition = localStorage.getItem("fps-position");
    const storedFpsVisibility = localStorage.getItem("fps-visibility");

    if (storedNavPosition) {
      setNavPosition(storedNavPosition);
    } else {
      localStorage.setItem("nav-position", "bottom");
      setNavPosition("bottom");
    }

    if (storedNavVisibility) {
      setIsShowNav(JSON.parse(storedNavVisibility));
    } else {
      localStorage.setItem("nav-visibility", JSON.stringify(true));
      setIsShowNav(true);
    }

    if (storedFpsPosition) {
      setFpsPosition(storedFpsPosition);
    } else {
      localStorage.setItem("fps-position", "top-right");
      setFpsPosition("top-right");
    }

    if (storedFpsVisibility) {
      setIsShowFps(JSON.parse(storedFpsVisibility));
    } else {
      localStorage.setItem("fps-visibility", JSON.stringify(false));
      setIsShowFps(false);
    }
  }, []);

  const toggleFps = () => {
    setIsShowFps((prev) => {
      const newValue = !prev;
      localStorage.setItem("fps-visibility", JSON.stringify(newValue));
      return newValue;
    });
  };

  const toggleNav = () => {
    setIsShowNav((prev) => {
      const newValue = !prev;
      localStorage.setItem("nav-visibility", JSON.stringify(newValue));
      return newValue;
    });
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

  const rotateFpsPosition = () => {
    setFpsPosition((prev) => {
      let newPosition;
      switch (prev) {
        case "top-right":
          newPosition = "bottom-right";
          break;
        case "bottom-right":
          newPosition = "bottom-left";
          break;
        case "bottom-left":
          newPosition = "top-left";
          break;
        case "top-left":
          newPosition = "top-right";
          break;
        default:
          newPosition = "top-right";
      }
      localStorage.setItem("fps-position", newPosition);
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
        fpsPosition,
        rotateFpsPosition,
        isShowNav,
        toggleNav,
      }}
    >
      {children}
    </CommandMenuContext.Provider>
  );
}

export function useCommandMenu() {
  return useContext(CommandMenuContext);
}