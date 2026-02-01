import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  resize?: boolean
  rows?: number
  maxRows?: number
  minRows?: number
  error?: boolean
  success?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    resize = true, 
    rows = 3, 
    maxRows = 10,
    minRows = 2,
    error,
    success,
    leftIcon,
    rightIcon,
    style,
    ...props 
  }, ref) => {
    const [textareaRows, setTextareaRows] = React.useState(rows)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    // Auto-resize functionality
    React.useEffect(() => {
      const textarea = textareaRef.current
      if (!textarea || !resize) return

      const handleInput = () => {
        const previousRows = textarea.rows
        textarea.rows = minRows // reset rows
        
        const currentRows = ~~(textarea.scrollHeight / 24) // 24px is line-height
        
        if (currentRows === previousRows) {
          textarea.rows = currentRows
        }
        
        if (currentRows >= maxRows) {
          textarea.rows = maxRows
          textarea.style.overflowY = 'auto'
        } else {
          textarea.rows = currentRows
          textarea.style.overflowY = 'hidden'
        }
        
        setTextareaRows(currentRows)
      }

      textarea.addEventListener('input', handleInput)
      return () => textarea.removeEventListener('input', handleInput)
    }, [resize, maxRows, minRows])

    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-3.5 text-muted-foreground pointer-events-none">
            {leftIcon}
          </div>
        )}
        <textarea
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            resize ? "resize-y" : "resize-none",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-destructive focus-visible:ring-destructive",
            success && "border-success focus-visible:ring-success",
            className
          )}
          ref={(node) => {
            // Handle both refs
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
            textareaRef.current = node
          }}
          rows={textareaRows}
          style={{
            minHeight: `${minRows * 24}px`,
            maxHeight: resize ? `${maxRows * 24}px` : 'none',
            ...style
          }}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-3.5 text-muted-foreground pointer-events-none">
            {rightIcon}
          </div>
        )}
        
        {/* Character counter (if maxLength provided) */}
        {props.maxLength && (
          <div className="absolute bottom-2 right-2">
            <span className={cn(
              "text-xs",
              props.value && props.value.toString().length > props.maxLength * 0.9 
                ? "text-destructive" 
                : "text-muted-foreground"
            )}>
              {props.value ? props.value.toString().length : 0}/{props.maxLength}
            </span>
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

// Textarea with label and helper text
interface TextareaWithLabelProps extends TextareaProps {
  label?: string
  helperText?: string
  errorText?: string
  successText?: string
  required?: boolean
  containerClassName?: string
}

const TextareaWithLabel = React.forwardRef<HTMLTextAreaElement, TextareaWithLabelProps>(
  ({ 
    label,
    helperText,
    errorText,
    successText,
    required,
    containerClassName,
    error,
    success,
    id,
    ...props 
  }, ref) => {
    const generatedId = React.useId()
    const textareaId = id || generatedId
    
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label 
            htmlFor={textareaId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        
        <Textarea
          ref={ref}
          id={textareaId}
          error={error || !!errorText}
          success={success || !!successText}
          {...props}
        />
        
        {(helperText || errorText || successText) && (
          <p className={cn(
            "text-sm",
            errorText ? "text-destructive" :
            successText ? "text-success" :
            "text-muted-foreground"
          )}>
            {errorText || successText || helperText}
          </p>
        )}
      </div>
    )
  }
)
TextareaWithLabel.displayName = "TextareaWithLabel"

export { Textarea, TextareaWithLabel }