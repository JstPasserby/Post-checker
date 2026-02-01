"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string
    showValue?: boolean
    valuePosition?: "inside" | "outside" | "tooltip"
    size?: "default" | "sm" | "lg"
    variant?: "default" | "success" | "warning" | "destructive" | "gradient"
    striped?: boolean
    animated?: boolean
  }
>(({ 
  className, 
  value, 
  indicatorClassName,
  showValue = false,
  valuePosition = "outside",
  size = "default",
  variant = "default",
  striped = false,
  animated = false,
  ...props 
}, ref) => {
  const progress = Math.min(100, Math.max(0, value || 0))
  
  const sizeClasses = {
    sm: "h-1.5",
    default: "h-2.5",
    lg: "h-4",
  }

  const variantClasses = {
    default: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    gradient: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
  }

  const indicatorClass = cn(
    "h-full w-full flex-1 transition-all duration-300 ease-out",
    variantClasses[variant],
    striped && "progress-striped",
    animated && "progress-animated",
    indicatorClassName
  )

  const ValueDisplay = () => (
    <span className={cn(
      "text-xs font-medium whitespace-nowrap",
      valuePosition === "inside" && "absolute inset-0 flex items-center justify-center text-primary-foreground"
    )}>
      {progress}%
    </span>
  )

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-full bg-secondary",
          sizeClasses[size],
          "flex-1"
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={indicatorClass}
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
        {showValue && valuePosition === "inside" && <ValueDisplay />}
      </ProgressPrimitive.Root>
      
      {showValue && valuePosition === "outside" && <ValueDisplay />}
      
      {showValue && valuePosition === "tooltip" && (
        <div className="relative group">
          <div className="px-2 py-1 text-xs rounded-md bg-popover text-popover-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 whitespace-nowrap z-50">
            {progress}%
          </div>
          <span className="text-xs font-medium cursor-help">
            {progress}%
          </span>
        </div>
      )}
    </div>
  )
})
Progress.displayName = "Progress"

// Circular Progress
interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  size?: number
  strokeWidth?: number
  variant?: "default" | "success" | "warning" | "destructive"
  showValue?: boolean
  children?: React.ReactNode
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ 
    className, 
    value = 0, 
    size = 40, 
    strokeWidth = 4,
    variant = "default",
    showValue = true,
    children,
    ...props 
  }, ref) => {
    const progress = Math.min(100, Math.max(0, value || 0))
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (progress / 100) * circumference

    const variantColors = {
      default: "stroke-primary",
      success: "stroke-success",
      warning: "stroke-warning",
      destructive: "stroke-destructive",
    }

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          className="absolute"
          width={size}
          height={size}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="fill-none stroke-secondary"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className={cn(
              "fill-none transition-all duration-300 ease-out",
              variantColors[variant]
            )}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        
        {showValue && !children && (
          <span className="text-xs font-medium">
            {progress}%
          </span>
        )}
        
        {children}
      </div>
    )
  }
)
CircularProgress.displayName = "CircularProgress"

export { Progress, CircularProgress }