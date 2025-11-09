import * as React from "react"
import { Palette } from "lucide-react"
import { cn } from "@core/shadcn/lib/utils"

interface ColorInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  value?: string
  onColorChange?: (color: string) => void
  showColorPreview?: boolean
  showPicker?: boolean
}


const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(
  ({ 
    className, 
    value = "#000000", 
    onColorChange, 
    onChange,
    showColorPreview = true,
    showPicker = true,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value)
    const colorInputRef = React.useRef<HTMLInputElement>(null)

    // Sync internal value with external value
    React.useEffect(() => {
      setInternalValue(value || "#000000")
    }, [value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInternalValue(newValue)
      
      // Call both callbacks
      onChange?.(e)
      onColorChange?.(newValue)
    }

    const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value
      setInternalValue(newColor)
      onColorChange?.(newColor)
    }

    const openColorPicker = () => {
      colorInputRef.current?.click()
    }

    const isValidHexColor = (color: string) => {
      return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
    }

    const displayValue = internalValue.startsWith('#') ? internalValue : `#${internalValue}`
    const validColor = isValidHexColor(displayValue) ? displayValue : "#000000"

    return (
      <div className="relative flex items-center">
        <input
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            showColorPreview && "pl-12",
            showPicker && "pr-10",
            className
          )}
          ref={ref}
          value={internalValue}
          onChange={handleInputChange}
          placeholder="#000000"
          maxLength={7}
          {...props}
        />
        
        {/* Color Preview */}
        {showColorPreview && (
          <div 
            className="absolute left-3 h-6 w-6 rounded border border-input cursor-pointer"
            style={{ backgroundColor: validColor }}
            onClick={openColorPicker}
            title="Click to open color picker"
          />
        )}
        
        {/* Color Picker Button */}
        {showPicker && (
          <button
            type="button"
            className="absolute right-3 h-6 w-6 rounded p-1 hover:bg-muted transition-colors"
            onClick={openColorPicker}
            title="Choose color"
          >
            <Palette className="h-4 w-4" />
          </button>
        )}
        
        {/* Hidden Color Input */}
        {showPicker && (
          <input
            ref={colorInputRef}
            type="color"
            value={validColor}
            onChange={handleColorPickerChange}
            className="absolute opacity-0 pointer-events-none"
            tabIndex={-1}
          />
        )}
      </div>
    )
  }
)

ColorInput.displayName = "ColorInput"

export { ColorInput }
export type { ColorInputProps }
