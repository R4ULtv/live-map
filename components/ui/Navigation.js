"use client";

import {
  Bars3Icon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Button } from "@headlessui/react";
import { useCommandMenu } from "@/components/providers/CommandMenuContext";

export default function Navigation() {
  const { setIsOpen, setIsCountrySearchOpen, setIsRequestInfoOpen } = useCommandMenu();

  return (
    <>
      <div className="absolute bottom-5 right-0 left-0 flex items-center justify-center">
        <div className="rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 shadow flex items-center">
          <Button
            onClick={() => setIsRequestInfoOpen(true)}
            className="p-2 data-[hover]:bg-zinc-800 data-[focus]:bg-zinc-800 first:rounded-l-full last:rounded-r-full outline-none relative group"
          >
            <UserIcon className="size-5" />
          </Button>

          <Button
            onClick={() => setIsCountrySearchOpen(true)}
            className="p-2 data-[hover]:bg-zinc-800 data-[focus]:bg-zinc-800 first:rounded-l-full last:rounded-r-full outline-none"
          >
            <MagnifyingGlassIcon className="size-5" />
          </Button>

          <Button
            onClick={() => setIsOpen(true)}
            className="p-2 data-[hover]:bg-zinc-800 data-[focus]:bg-zinc-800 first:rounded-l-full last:rounded-r-full outline-none"
          >
            <Bars3Icon className="size-5" />
          </Button>
        </div>
      </div>
    </>
  );
}
