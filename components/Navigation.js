"use client";

import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import RequestDialog from "./RequestDialog";
import { Button } from "@headlessui/react";

export default function Navigation({ requestInfo }) {
  const [requestOpen, setRequestOpen] = useState(false);

  return (
    <>
      <div className="absolute bottom-2 right-0 left-0 flex items-center justify-center">
        <div className="rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 shadow flex items-center">
          <Button
            onClick={() => setRequestOpen(true)}
            className="p-2 data-[hover]:bg-zinc-800 data-[focus]:bg-zinc-800 first:rounded-l-full last:rounded-r-full outline-none"
          >
            <UserIcon className="size-5" />
          </Button>

          <Button className="p-2 data-[hover]:bg-zinc-800 data-[focus]:bg-zinc-800 first:rounded-l-full last:rounded-r-full outline-none">
            <MagnifyingGlassIcon className="size-5" />
          </Button>
        </div>
      </div>

      <RequestDialog
        requestInfo={requestInfo}
        isOpen={requestOpen}
        setIsOpen={setRequestOpen}
      />
    </>
  );
}
