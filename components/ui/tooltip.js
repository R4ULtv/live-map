"use client";

import { forwardRef } from "react";
import { Provider, Root, Trigger, Content } from "@radix-ui/react-tooltip";

const TooltipProvider = Provider;

const Tooltip = Root;

const TooltipTrigger = Trigger;

const TooltipContent = forwardRef((props, ref) => {
  const { className, sideOffset = 4, ...rest } = props;
  return (
    <Content
      ref={ref}
      sideOffset={sideOffset}
      className={
        "z-50 overflow-hidden rounded-xl border bg-zinc-900 px-3 py-1.5 text-sm mb-0.5 text-zinc-200 border-zinc-800 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2" +
        className
      }
      {...rest}
    />
  );
});
TooltipContent.displayName = Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
