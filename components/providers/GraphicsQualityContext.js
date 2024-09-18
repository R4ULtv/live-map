"use client";

import { createContext, useContext, useState } from "react";

const GraphicsQualityContext = createContext();

export function GraphicsQualityProvider({ children }) {
  const [isHighQuality, setIsHighQuality] = useState(false);

  const toggleQuality = () => {
    setIsHighQuality((prev) => !prev);
  };

  return (
    <GraphicsQualityContext.Provider value={{ isHighQuality, toggleQuality }}>
      {children}
    </GraphicsQualityContext.Provider>
  );
}

export function useGraphicsQuality() {
  return useContext(GraphicsQualityContext);
}