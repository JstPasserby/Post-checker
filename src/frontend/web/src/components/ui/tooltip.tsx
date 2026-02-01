"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// Extended Tooltip with custom styling options
interface ExtendedTooltipProps extends React.ComponentProps<typeof Tooltip> {
  content: React.ReactNode
  delayDuration?: number
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  variant?: "default" | "info" | "warning" | "success" | "destructive"
  arrow?: boolean
  maxWidth?: string
}

const ExtendedTooltip = React.forwardRef<
  React.ElementRef<typeof Tooltip>,
  ExtendedTooltipProps
>(({ 
  children, 
  content, 
  delayDuration = 300,
  side = "top",
  align = "center",
  variant = "default",
  arrow = true,
  maxWidth = "20rem",
  ...props 
}, ref) => {
  const variantStyles = {
    default: "bg-popover text-popover-foreground border",
    info: "bg-blue-500 text-white border-blue-600",
    warning: "bg-amber-500 text-white border-amber-600",
    success: "bg-green-500 text-white border-green-600",
    destructive: "bg-red-500 text-white border-red-600",
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip {...props} ref={ref}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipPrimitive.Portal>
          <TooltipContent
            side={side}
            align={align}
            sideOffset={6}
            className={cn(variantStyles[variant], "z-[9999]")}
            style={{ maxWidth }}
          >
            {arrow && (
              <TooltipPrimitive.Arrow 
                className={cn("fill-current", {
                  "fill-blue-500": variant === "info",
                  "fill-amber-500": variant === "warning",
                  "fill-green-500": variant === "success",
                  "fill-red-500": variant === "destructive",
                })} 
                width={10} 
                height={5} 
              />
            )}
            <div className="relative z-10">
              {content}
            </div>
          </TooltipContent>
        </TooltipPrimitive.Portal>
      </Tooltip>
    </TooltipProvider>
  )
})
ExtendedTooltip.displayName = "ExtendedTooltip"

// Simple tooltip hook for conditional tooltips
const useTooltip = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  const showTooltip = (event: React.MouseEvent) => {
    setPosition({ x: event.clientX, y: event.clientY })
    setIsOpen(true)
  }

  const hideTooltip = () => {
    setIsOpen(false)
  }

  const TooltipComponent = ({ content, className }: { content: React.ReactNode, className?: string }) => {
    if (!isOpen) return null

    return (
      <div
        className={cn(
          "fixed z-[9999] px-3 py-1.5 bg-popover text-popover-foreground rounded-md shadow-lg text-sm",
          "animate-in fade-in-0 zoom-in-95",
          className
        )}
        style={{
          left: `${position.x + 10}px`,
          top: `${position.y + 10}px`,
        }}
      >
        {content}
      </div>
    )
  }

  return { showTooltip, hideTooltip, TooltipComponent, isOpen }
}

export { 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider, 
  ExtendedTooltip,
  useTooltip 
}