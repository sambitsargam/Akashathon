"use client";
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@src/utils/styleUtils";

const TooltipProvider = TooltipPrimitive.Provider;

interface TooltipProps extends TooltipPrimitive.TooltipProps {
  alwaysOpen?: boolean;
}
const Tooltip = ({ alwaysOpen, children, ...rest }: TooltipProps): React.ReactElement => {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipPrimitive.Root open={alwaysOpen || open} delayDuration={0} onOpenChange={setOpen} {...rest}>
      <div
        className="flex-shrink-0"
        onClick={() => setOpen(prevOpen => !prevOpen)}
        onFocus={() => setTimeout(() => setOpen(true), 0)} // timeout needed to run this after onOpenChange to prevent bug on mobile
        onBlur={() => setOpen(false)}
      >
        {children}
      </div>
    </TooltipPrimitive.Root>
  );
};

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  )
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
