"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b last:border-b-0", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    chevron?: boolean
    variant?: "default" | "minimal" | "bordered"
    iconPosition?: "left" | "right"
  }
>(({ 
  className, 
  children, 
  chevron = true, 
  variant = "default",
  iconPosition = "right",
  ...props 
}, ref) => {
  const Icon = chevron ? ChevronDown : undefined
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
          "[&[data-state=open]>svg]:rotate-180",
          variant === "default" && "text-left",
          variant === "minimal" && "py-2",
          variant === "bordered" && "px-4 py-3 rounded-lg border hover:bg-accent",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {iconPosition === "left" && Icon && (
          <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 mr-2" />
        )}
        <div className={cn(
          "flex-1",
          iconPosition === "left" && "ml-2"
        )}>
          {children}
        </div>
        {iconPosition === "right" && (
          <div className="flex items-center gap-2">
            {!chevron ? (
              isOpen ? (
                <Minus className="h-4 w-4 shrink-0" />
              ) : (
                <Plus className="h-4 w-4 shrink-0" />
              )
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            )}
          </div>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
    variant?: "default" | "minimal" | "bordered"
  }
>(({ className, children, variant = "default", ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all",
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      variant === "default" && "pb-4 pt-0",
      variant === "minimal" && "pb-2",
      variant === "bordered" && "px-4 pb-4",
      className
    )}
    {...props}
  >
    <div className={cn(
      variant === "bordered" && "pt-2 border-t"
    )}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

// Extended Accordion with more features
interface ExtendedAccordionProps extends React.ComponentProps<typeof Accordion> {
  variant?: "default" | "minimal" | "bordered"
  type?: "single" | "multiple"
  collapsible?: boolean
  defaultValue?: string
  chevron?: boolean
  iconPosition?: "left" | "right"
}

const ExtendedAccordion = React.forwardRef<
  React.ElementRef<typeof Accordion>,
  ExtendedAccordionProps
>(({ 
  children, 
  variant = "default",
  type = "single",
  collapsible = true,
  defaultValue,
  chevron = true,
  iconPosition = "right",
  className,
  ...props 
}, ref) => {
  const variantClasses = {
    default: "",
    minimal: "space-y-1",
    bordered: "space-y-2",
  }

  return (
    <Accordion
      ref={ref}
      type={type}
      collapsible={collapsible}
      defaultValue={defaultValue}
      className={cn(variantClasses[variant], className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === AccordionItem) {
            return React.cloneElement(child, {
              children: React.Children.map(child.props.children, (grandchild) => {
                if (React.isValidElement(grandchild)) {
                  if (grandchild.type === AccordionTrigger) {
                    return React.cloneElement(grandchild, { 
                      variant,
                      chevron,
                      iconPosition 
                    })
                  }
                  if (grandchild.type === AccordionContent) {
                    return React.cloneElement(grandchild, { variant })
                  }
                }
                return grandchild
              })
            })
          }
        }
        return child
      })}
    </Accordion>
  )
})
ExtendedAccordion.displayName = "ExtendedAccordion"

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  ExtendedAccordion,
}