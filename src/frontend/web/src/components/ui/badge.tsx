import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
        success:
          "border-transparent bg-success text-success-foreground hover:bg-success/80",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-500/80",
        purple:
          "border-transparent bg-purple-500 text-white hover:bg-purple-500/80",
        pink:
          "border-transparent bg-pink-500 text-white hover:bg-pink-500/80",
        cyan:
          "border-transparent bg-cyan-500 text-white hover:bg-cyan-500/80",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
      rounded: {
        default: "rounded-full",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  closable?: boolean
  onClose?: () => void
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size,
    rounded,
    icon,
    iconPosition = "left",
    closable,
    onClose,
    children,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)
    
    const handleClose = (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsVisible(false)
      onClose?.()
    }

    if (!isVisible) return null

    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, rounded, className }))}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className="mr-1">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="ml-1">{icon}</span>
        )}
        {closable && (
          <button
            onClick={handleClose}
            className="ml-1 -mr-1 h-3 w-3 rounded-full hover:bg-white/20 flex items-center justify-center"
            aria-label="Close badge"
          >
            <svg
              className="h-2 w-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
Badge.displayName = "Badge"

// Badge Group component for grouping badges
interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  maxVisible?: number
  overflowLabel?: string
}

const BadgeGroup = React.forwardRef<HTMLDivElement, BadgeGroupProps>(
  ({ 
    className, 
    maxVisible, 
    overflowLabel = "+{count} more",
    children,
    ...props 
  }, ref) => {
    const childrenArray = React.Children.toArray(children)
    const visibleBadges = maxVisible 
      ? childrenArray.slice(0, maxVisible)
      : childrenArray
    const overflowCount = maxVisible 
      ? childrenArray.length - maxVisible
      : 0

    return (
      <div
        ref={ref}
        className={cn("flex flex-wrap gap-1", className)}
        {...props}
      >
        {visibleBadges}
        {overflowCount > 0 && (
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            {overflowLabel.replace("{count}", overflowCount.toString())}
          </Badge>
        )}
      </div>
    )
  }
)
BadgeGroup.displayName = "BadgeGroup"

export { Badge, BadgeGroup, badgeVariants }