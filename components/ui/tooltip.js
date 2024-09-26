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
        "z-50 overflow-hidden rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 text-sm m-1 text-zinc-800 dark:text-zinc-200 shadow-md " +
        className
      }
      {...rest}
    />
  );
});
TooltipContent.displayName = Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
