"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      "hover:bg-background/50 hover:text-foreground",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

// Extended Tabs with variants
interface ExtendedTabsProps extends React.ComponentProps<typeof Tabs> {
  variant?: "default" | "pills" | "underline"
  size?: "default" | "sm" | "lg"
}

const ExtendedTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  ExtendedTabsProps
>(({ variant = "default", size = "default", className, children, ...props }, ref) => {
  return (
    <Tabs ref={ref} className={cn(className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsList) {
          return React.cloneElement(child, {
            className: cn(
              child.props.className,
              variant === "pills" && "bg-transparent gap-1",
              variant === "underline" && "bg-transparent border-b",
              size === "sm" && "h-8",
              size === "lg" && "h-12"
            ),
          })
        }
        return child
      })}
    </Tabs>
  )
})
ExtendedTabs.displayName = "ExtendedTabs"

const ExtendedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "default" | "pills" | "underline"
    size?: "default" | "sm" | "lg"
  }
>(({ variant = "default", size = "default", className, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        className,
        variant === "pills" && "rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        variant === "underline" && 
          "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-1 mx-1",
        size === "sm" && "h-7 px-2.5 text-xs",
        size === "lg" && "h-11 px-4 text-base"
      )}
      {...props}
    />
  )
})
ExtendedTabsTrigger.displayName = "ExtendedTabsTrigger"

export { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent, 
  ExtendedTabs, 
  ExtendedTabsTrigger 
}