"use client";

import {
  Bars3Icon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/16/solid";
import { Button } from "@headlessui/react";
import { useCommandMenu } from "@/components/providers/CommandMenuContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { getOnlineCount } from "@/components/server/online";
import numeral from "numeral";

export default function Navigation() {
  const { setIsOpen, setIsCountrySearchOpen, setIsRequestInfoOpen } =
    useCommandMenu();
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const fetchOnlineCount = async () => {
      try {
        const count = await getOnlineCount();
        setOnlineUsers(count);
      } catch (error) {
        setOnlineUsers(0);
        console.error(error);
      }
    };

    fetchOnlineCount();

    const interval = setInterval(fetchOnlineCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider>
      <div className="absolute bottom-5 right-0 left-0 flex items-center justify-center">
        <div className="rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 shadow flex items-center gap-1 p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsRequestInfoOpen(true)}
                className="p-2 data-[hover]:bg-zinc-800 data-[focus]:bg-zinc-800 rounded-full outline-none relative group"
              >
                <UserIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Request Data</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsCountrySearchOpen(true)}
                className="p-2 data-[hover]:bg-zinc-800 data-[focus]:bg-zinc-800 rounded-full outline-none relative group"
              >
                <MagnifyingGlassIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search Countries</TooltipContent>
          </Tooltip>

          <div className="w-px h-5 bg-zinc-700"></div>

          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="https://github.com/r4ultv/live-map"
                target="_blank"
                className="p-2 hover:bg-zinc-800 focus:bg-zinc-800 rounded-full outline-none relative group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 496 512"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                </svg>
              </a>
            </TooltipTrigger>
            <TooltipContent>Github Repo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={"https://www.raulcarini.dev/blog/live-map"}
                target="_blank"
                className="p-2 hover:bg-zinc-800 focus:bg-zinc-800 rounded-full outline-none relative group"
              >
                <DocumentTextIcon className="size-4" />
              </a>
            </TooltipTrigger>
            <TooltipContent>Blog Post</TooltipContent>
          </Tooltip>

          <div className="w-px h-5 bg-zinc-700"></div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="p-2 data-[hover]:bg-zinc-800 data-[focus]:bg-zinc-800 rounded-full outline-none relative group">
                <UsersIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Online Users: {numeral(onlineUsers).format("0a")}
            </TooltipContent>
          </Tooltip>

          <div className="w-px h-5 bg-zinc-700"></div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                className="p-2 data-[hover]:bg-zinc-800 data-[focus]:bg-zinc-800 rounded-full outline-none relative group"
              >
                <Bars3Icon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Command Menu</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
