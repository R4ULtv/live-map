"use client";

import { createContext, useState, useContext } from 'react';

const CommandMenuContext = createContext();

export function CommandMenuProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCountrySearchOpen, setIsCountrySearchOpen] = useState(false);
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <CommandMenuContext.Provider value={{ isOpen, setIsOpen, isCountrySearchOpen, setIsCountrySearchOpen, isRequestInfoOpen, setIsRequestInfoOpen, selectedCountry, setSelectedCountry }}>
      {children}
    </CommandMenuContext.Provider>
  );
}

export function useCommandMenu() {
  return useContext(CommandMenuContext);
}
