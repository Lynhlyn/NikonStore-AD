import * as React from "react"

import { cn } from "@/core/shadcn/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {

    return (
      <>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </>
    )
  }
)
Input.displayName = "Input"

export { Input }

