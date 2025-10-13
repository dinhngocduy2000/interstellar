import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  prefixIcon,
  endfixIcon,
  ...props
}: React.ComponentProps<"input"> & {
  endfixIcon?: React.ReactNode;
  prefixIcon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex h-9 min-h-9 items-center truncate border-0",
        (type === "text" || type === "password") && "w-full",
      )}
    >
      {prefixIcon && <div className="absolute left-2">{prefixIcon}</div>}

      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          prefixIcon && "pl-10",
          endfixIcon && "pr-10",
          className,
        )}
        {...props}
      />
      {endfixIcon && <div className="absolute right-2">{endfixIcon}</div>}
    </div>
  );
}

export { Input };
