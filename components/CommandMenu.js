"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/20/solid";

import { Command } from "cmdk";
import { useEffect, useCallback, useState } from "react";
import { getCountryData } from "countries-list";

import jsonMap from "@/public/countries.json";
import { useCommandMenu } from "@/components/CommandMenuContext";

export default function CommandMenu({ requestInfo }) {
  const country = getCountryData(requestInfo.country);
  const {
    isOpen,
    setIsOpen,
    isCountrySearchOpen,
    setIsCountrySearchOpen,
    isRequestInfoOpen,
    setIsRequestInfoOpen,
  } = useCommandMenu();

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
        } else {
          setIsOpen(false);
        }
      } else if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
        setIsCountrySearchOpen(false);
        setIsRequestInfoOpen(false);
      } else if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        setIsCountrySearchOpen(!isCountrySearchOpen);
        setIsOpen(false);
        setIsRequestInfoOpen(false);
      } else if (e.ctrlKey && e.key === "g") {
        e.preventDefault();
        setIsRequestInfoOpen(!isRequestInfoOpen);
        setIsOpen(false);
        setIsCountrySearchOpen(false);
      }
    },
    [
      isOpen,
      setIsOpen,
      isCountrySearchOpen,
      setIsCountrySearchOpen,
      isRequestInfoOpen,
      setIsRequestInfoOpen,
    ]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const isDialogOpen = isOpen || isCountrySearchOpen || isRequestInfoOpen;

  const commands = [
    {
      name: "Request Geolocation Data",
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
      icon: <MagnifyingGlassIcon className="size-5" />,
      shortct: ["⌘", "F"],
      onClick: () => {
        setIsCountrySearchOpen(true);
        setIsOpen(false);
        setIsRequestInfoOpen(false);
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
          className="max-w-xl w-full border overflow-y-auto bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl transition duration-150 ease-in-out data-[closed]:opacity-0 data-[closed]:scale-90"
        >
          <Command
            label={
              isCountrySearchOpen ? "Search for a country" : "Command menu"
            }
            className="outline-none"
            loop
          >
            {!isRequestInfoOpen && (
              <Command.Input
                value={inputValue}
                onValueChange={setInputValue}
                className="w-full text-sm bg-transparent font-semibold outline-none py-3 px-4 border-b-2 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-700 dark:placeholder:text-zinc-300"
                placeholder={
                  isCountrySearchOpen
                    ? "Search for a country..."
                    : "Search commands..."
                }
                data-headlessui-state="autofocus"
                data-autofocus
              />
            )}

            <Command.List className="overflow-y-auto command-menu-list py-2 max-h-96 [&_div[cmdk-group]]:px-2 [&_div[cmdk-group-heading]]:mb-2 [&_div[cmdk-group-heading]]:text-sm [&_div[cmdk-group-heading]]:font-semibold [&_div[cmdk-group-heading]]:text-zinc-400">
              {!isRequestInfoOpen && (
                <Command.Empty className="py-2 ml-3 my-1 text-sm">
                  No results found.
                </Command.Empty>
              )}

              {isCountrySearchOpen ? (
                <Command.Group heading="Countries" label="Countries">
                  {countries.map((item) => (
                    <Command.Item
                      key={item.name}
                      className="group flex justify-between items-center rounded-md px-2 cursor-pointer select-none text-zinc-950 dark:text-zinc-50 data-[selected=true]:bg-zinc-800/5 dark:data-[selected=true]:bg-zinc-200/5"
                    >
                      <div className="flex items-center gap-2 py-2 my-1 text-sm">
                        <img
                          className="w-5 h-auto rounded-sm"
                          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${item.code}.svg`}
                        />
                        {item.name} ({item.code})
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              ) : isRequestInfoOpen ? (
                <div className="space-y-2 py-2">
                  <div className="flex items-center justify-between text-sm font-semibold text-zinc-400 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        className="w-7 h-auto rounded"
                        src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${requestInfo.country}.svg`}
                      />
                      <p>{requestInfo.city}</p>
                    </div>
                    <p>{requestInfo.country}</p>
                  </div>
                  <div className="bg-zinc-800 w-full h-0.5 rounded"></div>
                  <div className="px-4">
                    <p className="text-zinc-400 font-semibold text-sm mb-1">
                      Geolocation Data
                    </p>
                    <div className="space-y-2 text-zinc-300">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Latitude</span>
                          <span>{requestInfo.latitude}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Longitude</span>
                          <span>{requestInfo.longitude}</span>
                        </div>
                      </div>

                      <div className="bg-zinc-800 w-full h-px"></div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Country</span>
                          <span>{country.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">City</span>
                          <span>{requestInfo.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-zinc-800 w-full h-0.5 rounded"></div>
                  <div className="px-4">
                    <p className="text-zinc-400 font-semibold text-sm mb-1">
                      Country General Information
                    </p>
                    <div className="space-y-2 text-zinc-300">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Languages</span>
                          <span className="uppercase">
                            {country.languages.join(", ")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Currency</span>
                          <span>{country.currency.join(", ")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Phone Code</span>
                          <div>
                            {country.phone.map((phone, idx) => (
                              <span key={idx}>+{phone}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Capital</span>
                          <span>{country.capital}</span>
                        </div>
                      </div>

                      <div className="bg-zinc-800 w-full h-px"></div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">ISO 2</span>
                          <span>{country.iso2}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">ISO 3</span>
                          <span>{country.iso3}</span>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                </div>
              ) : (
                <Command.Group
                  heading="General Commands"
                  label="General Commands"
                >
                  {commands.map((command) => (
                    <Command.Item
                      key={command.name}
                      onSelect={command.onClick}
                      className="group flex justify-between items-center rounded-md px-2 cursor-pointer select-none text-zinc-950 dark:text-zinc-50 data-[selected=true]:bg-zinc-800/5 dark:data-[selected=true]:bg-zinc-200/5"
                    >
                      <div className="flex items-center gap-2 py-2 my-1 text-sm">
                        <div className="p-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-500 rounded-md">
                          {command.icon}
                        </div>
                        {command.name}
                      </div>
                      <div className="flex justify-center items-center gap-1.5 text-xs">
                        {command.shortct.map((shortcut) => (
                          <span
                            key={shortcut}
                            className="px-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded-md min-w-[20px] h-5 flex justify-center items-center"
                          >
                            {shortcut}
                          </span>
                        ))}
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </Command.List>

            <div className="w-full text-sm px-3 py-2 border-t-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-1 text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded flex justify-center items-center">
                    Home
                  </span>
                  {isCountrySearchOpen && (
                    <span className="px-1 text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded flex justify-center items-center transition ease-in-out duration-100 data-[closed]:opacity-0 data-[enter]:data-[closed]:translate-x-full data-[leave]:data-[closed]:translate-x-full">
                      Countries
                    </span>
                  )}
                  {isRequestInfoOpen && (
                    <span className="px-1 text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded flex justify-center items-center transition ease-in-out duration-100 data-[closed]:opacity-0 data-[enter]:data-[closed]:translate-x-full data-[leave]:data-[closed]:translate-x-full">
                      Request Info
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 select-none">
                  <span className="text-xs font-bold">Open</span>
                  <span className="px-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500 rounded-md w-5 h-5 flex justify-center items-center">
                    ↵
                  </span>
                </div>
              </div>
            </div>
          </Command>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
