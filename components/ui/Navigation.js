"use client";

import {
  Bars3Icon,
  DocumentTextIcon,
  FlagIcon,
  MagnifyingGlassIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/16/solid";
import { Button, Transition } from "@headlessui/react";
import { useCommandMenu } from "@/components/providers/CommandMenuContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import numeral from "numeral";

export default function Navigation({ fetchURL }) {
  const { setIsOpen, setIsCountrySearchOpen, setIsRequestInfoOpen, navPosition } =
    useCommandMenu();
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const fetchOnlineCount = async () => {
      try {
        const response = await fetch(fetchURL + "/online-count", {
          method: "GET",
          mode: "cors",
          cache: "no-store",
        });
        const data = await response.json();
        setOnlineUsers(data.count);
      } catch (error) {
        setOnlineUsers(0);
        console.error(error);
      }
    };

    fetchOnlineCount();

    const interval = setInterval(fetchOnlineCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const nav = [
    {
      icon: (
        <UserIcon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
      ),
      label: "Request Data",
      onClick: () => setIsRequestInfoOpen(true),
    },
    {
      icon: (
        <MagnifyingGlassIcon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
      ),
      label: "Search Country",
      onClick: () => setIsCountrySearchOpen(true),
      divedeAfter: true,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 496 512"
          fill="currentColor"
          className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75"
        >
          <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
        </svg>
      ),
      label: "Github Repo",
      onClick: () =>
        window.open("https://github.com/R4ULtv/live-map/", "_blank"),
    },
    {
      icon: (
        <FlagIcon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
      ),
      label: "Bug Report",
      onClick: () =>
        window.open(
          "https://github.com/R4ULtv/live-map/issues/new/choose",
          "_blank"
        ),
    },
    {
      icon: (
        <DocumentTextIcon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
      ),
      label: "Blog Post",
      onClick: () =>
        window.open("https://www.raulcarini.dev/blog/live-map", "_blank"),
      divedeAfter: true,
    },
    {
      icon: (
        <UsersIcon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
      ),
      label: `Online Users: ${numeral(onlineUsers).format("0a")}`,
      divedeAfter: true,
    },
    {
      icon: (
        <Bars3Icon className="size-4 group-data-[hover]:scale-110 group-data-[focus]:scale-110 duration-75" />
      ),
      label: "Command Menu",
      onClick: () => setIsOpen(true),
    },
  ];

  return (
    <TooltipProvider>
      <Transition show={navPosition}>
        <div
          className={
            "absolute transform w-min transition duration-150 ease-in-out data-[closed]:opacity-0 data-[closed]:scale-50 " +
            (navPosition === "left"
              ? "left-3 top-1/2 -translate-y-1/2"
              : navPosition === "right"
              ? "right-3 top-1/2 -translate-y-1/2"
              : navPosition === "top"
              ? "top-3 left-1/2 -translate-x-1/2"
              : "bottom-3 left-1/2 -translate-x-1/2")
          }
        >
          <div
            className={
              "rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 shadow flex items-center gap-1 p-1 " +
              (navPosition === "left" || navPosition === "right"
                ? "flex-col"
                : "flex-row")
            }
          >
            {nav.map((e) => (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={e.onClick}
                      className="p-2 data-[hover]:bg-zinc-800 data-[focus]:bg-zinc-800 transition-colors duration-75 rounded-full outline-none relative group"
                    >
                      {e.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side={
                      navPosition === "left"
                        ? "right"
                        : navPosition === "right"
                        ? "left"
                        : navPosition === "top"
                        ? "bottom"
                        : "top"
                    }
                  >
                    {e.label}
                  </TooltipContent>
                </Tooltip>
                {e.divedeAfter && (
                  <div
                    className={
                      "bg-zinc-700 " +
                      (navPosition === "left" || navPosition === "right"
                        ? "h-px w-5"
                        : "w-px h-5")
                    }
                  />
                )}
              </>
            ))}
          </div>
        </div>
      </Transition>
    </TooltipProvider>
  );
}
