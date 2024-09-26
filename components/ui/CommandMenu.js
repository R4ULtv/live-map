"use client";

import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  UserIcon,
  AdjustmentsHorizontalIcon,
  MapIcon,
  MapPinIcon,
  DocumentTextIcon,
  Bars3BottomRightIcon,
  FlagIcon,
  CursorArrowRippleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

import { Command } from "cmdk";
import { useEffect, useCallback, useState } from "react";

import jsonMap from "@/public/countries/countries-low.json";
import { useCommandMenu } from "@/components/providers/CommandMenuContext";
import { useGraphicsQuality } from "@/components/providers/GraphicsQualityContext";
import CountryData from "@/components/ui/Country";
import { useTheme } from "next-themes";

export default function CommandMenu({ requestInfo }) {
  const {
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
    rotateNavPosition,
  } = useCommandMenu();
  const { isHighQuality, toggleQuality } = useGraphicsQuality();
  const { theme, setTheme } = useTheme();

  const countries = jsonMap.objects.countries1.geometries.map((country) => ({
    name: country.properties.name,
    code: country.properties.Alpha2,
  }));

  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setInputValue(""); // Clear the input field
        if (isCountrySearchOpen || isRequestInfoOpen) {
          setIsCountrySearchOpen(false);
          setIsRequestInfoOpen(false);
          setIsOpen(true);
        } else if (selectedCountry !== null) {
          setIsCountrySearchOpen(true);
          setSelectedCountry(null);
          setIsRequestInfoOpen(false);
          setIsOpen(false);
        } else {
          setIsOpen(false);
        }
      } else if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
        setIsCountrySearchOpen(false);
        setIsRequestInfoOpen(false);
        setSelectedCountry(null);
        setInputValue("");
      } else if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        setIsCountrySearchOpen(!isCountrySearchOpen);
        setIsOpen(false);
        setIsRequestInfoOpen(false);
        setSelectedCountry(null);
        setInputValue("");
      } else if (e.ctrlKey && e.key === "g") {
        e.preventDefault();
        setIsRequestInfoOpen(!isRequestInfoOpen);
        setIsOpen(false);
        setIsCountrySearchOpen(false);
        setSelectedCountry(null);
        setInputValue("");
      } else if (e.ctrlKey && e.key === "q") {
        e.preventDefault();
        toggleQuality();
        setIsOpen(false);
      } else if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        toggleFps();
        setIsOpen(false);
      } else if (e.altKey && e.key === "n") {
        e.preventDefault();
        setIsOpen(false);
        rotateNavPosition();
      } else if (e.ctrlKey && e.shiftKey && e.key === "L") {
        e.preventDefault();
        setIsOpen(false);
        setTheme(theme === "dark" ? "light" : "dark");
      }
    },
    [isOpen, isCountrySearchOpen, isRequestInfoOpen, selectedCountry, theme]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleLink = (href) => {
    window.open(href, "_blank");
    setIsOpen(false);
  };

  const isDialogOpen =
    isOpen ||
    isCountrySearchOpen ||
    isRequestInfoOpen ||
    selectedCountry !== null;

  const commands = [
    {
      name: "Request Geolocation Data",
      desc: "Watch your geolocation data get from your request",
      icon: <UserIcon className="size-5" />,
      shortct: ["⌘", "G"],
      onClick: () => {
        setIsRequestInfoOpen(true);
        setIsOpen(false);
        setIsCountrySearchOpen(false);
      },
    },
    {
      name: "Search for a Country",
      desc: "Find a country by name or code and watch its data",
      icon: <MagnifyingGlassIcon className="size-5" />,
      shortct: ["⌘", "F"],
      onClick: () => {
        setIsCountrySearchOpen(true);
        setIsOpen(false);
        setIsRequestInfoOpen(false);
      },
    },
    {
      name: "Change Navigation Position",
      desc: "You can change the position of the floating navigation menu",
      icon: <CursorArrowRippleIcon className="size-5" />,
      shortct: ["⌥", "N"],
      onClick: () => {
        setIsOpen(false);
        rotateNavPosition();
      },
    },
    {
      name: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      desc: "You can change the theme of the application",
      icon:
        theme === "dark" ? (
          <SunIcon className="size-5" />
        ) : (
          <MoonIcon className="size-5" />
        ),
      shortct: ["⌘", "⇧", "L"],
      onClick: () => {
        setIsOpen(false);
        setTheme(theme === "dark" ? "light" : "dark");
      },
    },
  ];

  const commands2 = [
    {
      name: `Switch to ${isHighQuality ? "Low" : "High"} Graphics`,
      desc: isHighQuality
        ? "Switch to lower quality for better performance"
        : "The performance may be significantly lower",
      icon: <AdjustmentsHorizontalIcon className="size-5" />,
      shortct: ["⌘", "Q"],
      onClick: () => {
        toggleQuality();
        setIsOpen(false);
      },
    },
    {
      name: `${isShowFps ? "Hide" : "Show"} FPS Stats`,
      desc: isShowFps
        ? "Hide your FPS stats, better performance"
        : "Watch your performance FPS, may can cause lag",
      icon: <Bars3BottomRightIcon className="size-5" />,
      shortct: ["⌘", "⇧", "P"],
      onClick: () => {
        toggleFps();
        setIsOpen(false);
      },
    },
    {
      name: "Reset the Map",
      desc: "Reset the map to the default position",
      icon: <MapIcon className="size-5" />,
      shortct: ["⌘", "R"],
    },
    {
      name: "Select a Country",
      desc: "Click on a country to select it",
      icon: <MapPinIcon className="size-5" />,
    },
  ];

  const commands3 = [
    {
      name: "Github Repository",
      desc: "Check out the code on GitHub",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 496 512"
          fill="currentColor"
          className="size-5"
        >
          <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
        </svg>
      ),
      onClick: () => {
        handleLink("https://github.com/r4ultv/live-map");
        setIsOpen(false);
      },
    },
    {
      name: "Bug Report",
      desc: "You found a bug? You can report it here",
      icon: <FlagIcon className="size-5" />,
      onClick: () => {
        handleLink("https://github.com/R4ULtv/live-map/issues/new/choose");
        setIsOpen(false);
      },
    },
    {
      name: "Blog Post",
      desc: "Check out the blog post for more info about this project",
      icon: <DocumentTextIcon className="size-5" />,
      onClick: () => {
        handleLink("https://www.raulcarini.dev/blog/live-map");
        setIsOpen(false);
      },
    },
  ];

  return (
    <Dialog
      transition
      open={isDialogOpen}
      onClose={() => {
        setIsOpen(false);
        setIsCountrySearchOpen(false);
        setIsRequestInfoOpen(false);
        setSelectedCountry(null);
        setInputValue("");
      }}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition duration-150 ease-in-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="max-w-xl w-full border overflow-y-auto bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 rounded-xl transition duration-150 ease-in-out data-[closed]:opacity-0 data-[closed]:scale-90"
        >
          <Command
            label={
              isCountrySearchOpen ? "Search for a country" : "Command menu"
            }
            className="outline-none"
            loop
          >
            {!isRequestInfoOpen && selectedCountry === null && (
              <Command.Input
                value={inputValue}
                onValueChange={setInputValue}
                className="w-full text-sm bg-transparent font-semibold outline-none py-3 px-4 border-b-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-600 dark:placeholder:text-zinc-400"
                placeholder={
                  isCountrySearchOpen
                    ? "Search for a country..."
                    : "Search commands..."
                }
                data-headlessui-state="autofocus"
                data-autofocus
              />
            )}

            <Command.List className="overflow-y-auto pb-2 max-h-96 [&_div[cmdk-group]]:px-2 [&_div[cmdk-group-heading]]:my-1 [&_div[cmdk-group-heading]]:text-sm [&_div[cmdk-group-heading]]:font-semibold [&_div[cmdk-group-heading]]:text-zinc-600 dark:[&_div[cmdk-group-heading]]:text-zinc-400">
              {!isRequestInfoOpen && selectedCountry === null && (
                <Command.Empty className="py-2 ml-3 my-1 text-sm text-zinc-500">
                  No results found.
                </Command.Empty>
              )}

              {isCountrySearchOpen ? (
                <Command.Group heading="Countries" label="Countries">
                  {countries.map((item) => (
                    <Command.Item
                      key={item.name}
                      onSelect={() => {
                        setSelectedCountry(item.code);
                        setIsCountrySearchOpen(false);
                      }}
                      className="group flex justify-between items-center rounded-md px-2 cursor-pointer select-none text-zinc-900 dark:text-zinc-100 transition duration-150 data-[selected=true]:bg-zinc-800/5 dark:data-[selected=true]:bg-zinc-200/5"
                    >
                      <div className="flex items-center gap-2 py-2 my-1 text-sm">
                        <img
                          className="w-5 h-auto rounded-sm"
                          src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${item.code}.svg`}
                          loading="lazy"
                        />
                        {item.name} ({item.code})
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              ) : selectedCountry !== null ? (
                <CountryData countryCode={selectedCountry} />
              ) : isRequestInfoOpen ? (
                <CountryData
                  requestInfo={requestInfo}
                  countryCode={requestInfo.country}
                />
              ) : (
                <>
                  <Command.Group heading="General" label="General">
                    {commands.map((command) => (
                      <Command.Item
                        key={command.name}
                        onSelect={command.onClick}
                        className="group flex justify-between items-center rounded-md px-2 cursor-pointer select-none text-zinc-900 dark:text-zinc-100 transition duration-150 data-[selected=true]:bg-zinc-800/5 dark:data-[selected=true]:bg-zinc-200/5"
                      >
                        <div className="flex items-center gap-2 py-2 my-1 text-sm">
                          <div className="p-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-500 rounded-md">
                            {command.icon}
                          </div>
                          <div className="flex flex-col">
                            {command.name}
                            <p className="text-xs text-zinc-500">
                              {command?.desc}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-center items-center gap-1.5 text-xs">
                          {command.shortct.map((shortcut) => (
                            <kbd
                              key={shortcut}
                              className="px-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded-md min-w-[20px] h-5 flex justify-center items-center"
                            >
                              {shortcut}
                            </kbd>
                          ))}
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <div className="w-full h-px bg-zinc-300 dark:bg-zinc-700 my-1"></div>

                  <Command.Group heading="Maps" label="Maps">
                    {commands2.map((command) => (
                      <Command.Item
                        key={command.name}
                        onSelect={command.onClick}
                        className="group flex justify-between items-center rounded-md px-2 cursor-pointer select-none text-zinc-900 dark:text-zinc-100 transition duration-150 data-[selected=true]:bg-zinc-800/5 dark:data-[selected=true]:bg-zinc-200/5"
                      >
                        <div className="flex items-center gap-2 py-2 my-1 text-sm">
                          <div className="p-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-500 rounded-md">
                            {command.icon}
                          </div>
                          <div className="flex flex-col">
                            {command.name}
                            <p className="text-xs text-zinc-500">
                              {command?.desc}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-center items-center gap-1.5 text-xs">
                          {command.shortct &&
                            command.shortct.map((shortcut) => (
                              <kbd
                                key={shortcut}
                                className="px-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded-md min-w-[20px] h-5 flex justify-center items-center"
                              >
                                {shortcut}
                              </kbd>
                            ))}
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <div className="w-full h-px bg-zinc-300 dark:bg-zinc-700 my-1"></div>

                  <Command.Group
                    heading="More Information"
                    label="More Information"
                  >
                    {commands3.map((command) => (
                      <Command.Item
                        key={command.name}
                        onSelect={command.onClick}
                        className="group flex justify-between items-center rounded-md px-2 cursor-pointer select-none text-zinc-900 dark:text-zinc-100 transition duration-150 data-[selected=true]:bg-zinc-800/5 dark:data-[selected=true]:bg-zinc-200/5"
                      >
                        <div className="flex items-center gap-2 py-2 my-1 text-sm">
                          <div className="p-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-500 rounded-md">
                            {command.icon}
                          </div>
                          <div className="flex flex-col">
                            {command.name}
                            <p className="text-xs text-zinc-500">
                              {command?.desc}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-center items-center gap-1.5 text-xs">
                          {command.shortcut &&
                            command.shortct.map((shortcut) => (
                              <kbd
                                key={shortcut}
                                className="px-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded-md min-w-[20px] h-5 flex justify-center items-center"
                              >
                                {shortcut}
                              </kbd>
                            ))}
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                </>
              )}
            </Command.List>

            <div className="w-full text-sm px-3 py-2 border-t-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setIsCountrySearchOpen(false);
                      setIsRequestInfoOpen(false);
                      setSelectedCountry(null);
                    }}
                    className="px-1 text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded flex justify-center items-center select-none"
                  >
                    Home
                  </button>
                  {(isCountrySearchOpen || selectedCountry !== null) && (
                    <button
                      onClick={() => {
                        setIsCountrySearchOpen(true);
                        setSelectedCountry(null);
                      }}
                      className="px-1 text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded flex justify-center items-center select-none"
                    >
                      Countries
                    </button>
                  )}
                  {selectedCountry && (
                    <span className="px-1 text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded flex justify-center items-center select-none">
                      {selectedCountry}
                    </span>
                  )}
                  {isRequestInfoOpen && (
                    <span className="px-1 text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded flex justify-center items-center select-none">
                      Request Info
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 select-none text-xs">
                  <span className="font-bold">Open or Use</span>
                  <kbd className="px-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded-md w-5 h-5 flex justify-center items-center">
                    ↵
                  </kbd>
                  <div className="w-0.5 h-5 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
                  <Menu>
                    <MenuButton className="flex items-center gap-1.5 outline-none">
                      <span className="text-xs font-bold">Actions</span>
                      <kbd className="px-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded-md w-5 h-5 flex justify-center items-center">
                        ⌘
                      </kbd>
                      <kbd className="px-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded-md w-5 h-5 flex justify-center items-center">
                        K
                      </kbd>
                    </MenuButton>
                    <MenuItems
                      transition
                      anchor="top end"
                      className="min-w-32 origin-top-right outline-none p-1 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-sm transition duration-75 ease-in-out [--anchor-gap:4px] data-[closed]:scale-90 data-[closed]:opacity-0"
                    >
                      <MenuItem>
                        <Button className="group flex w-full items-center gap-4 rounded-md py-1.5 px-3 data-[focus]:bg-zinc-800/5 dark:data-[focus]:bg-zinc-200/5">
                          Move
                          <kbd className="ml-auto font-sans text-xs">
                            ↑ or ↓
                          </kbd>
                        </Button>
                      </MenuItem>
                      <MenuItem>
                        <Button className="group flex w-full items-center gap-4 rounded-md py-1.5 px-3 data-[focus]:bg-zinc-800/5 dark:data-[focus]:bg-zinc-200/5">
                          Return/Escape
                          <kbd className="ml-auto font-sans text-xs">esc</kbd>
                        </Button>
                      </MenuItem>
                      <MenuItem>
                        <Button className="group flex w-full items-center gap-4 rounded-md py-1.5 px-3 data-[focus]:bg-zinc-800/5 dark:data-[focus]:bg-zinc-200/5">
                          Open/Use
                          <kbd className="ml-auto font-sans text-xs">↵</kbd>
                        </Button>
                      </MenuItem>
                      <MenuItem>
                        <Button className="group flex w-full items-center gap-4 rounded-md py-1.5 px-3 data-[focus]:bg-zinc-800/5 dark:data-[focus]:bg-zinc-200/5">
                          Cycle
                          <kbd className="ml-auto font-sans text-xs">⇆</kbd>
                        </Button>
                      </MenuItem>
                      <MenuItem>
                        <Button className="group flex w-full items-center gap-4 rounded-md py-1.5 px-3 data-[focus]:bg-zinc-800/5 dark:data-[focus]:bg-zinc-200/5">
                          Cycle backwards
                          <kbd className="ml-auto font-sans text-xs">⇧ ⇆</kbd>
                        </Button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>
          </Command>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
