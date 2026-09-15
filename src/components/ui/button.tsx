import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "chem";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap text-[14px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background select-none cursor-pointer active:scale-[0.98]";

    const variantStyles = {
      default:
        "bg-primary text-primary-foreground shadow-sm hover:brightness-105 active:brightness-95",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline:
        "border border-border/80 bg-background/50 hover:bg-secondary/60 hover:text-foreground text-foreground/90",
      ghost:
        "hover:bg-secondary/70 hover:text-foreground text-muted-foreground",
      link:
        "text-primary underline-offset-4 hover:underline p-0 h-auto",
      chem:
        "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 font-semibold",
    };

    const sizeStyles = {
      default: "min-h-[44px] h-[44px] px-4 rounded-xl",
      sm: "min-h-[36px] h-[36px] px-3 text-[13px] rounded-lg",
      lg: "min-h-[48px] h-[48px] px-6 text-[15px] font-semibold rounded-xl",
      icon: "min-h-[44px] h-[44px] min-w-[44px] w-[44px] rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
