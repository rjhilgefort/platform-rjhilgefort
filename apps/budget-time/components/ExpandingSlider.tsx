'use client'

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'

interface ExpandingSliderProps {
  value: number
  onChange: (value: number) => void
  onChangeEnd?: (value: number) => void
  min?: number
  initialMax?: number
  step?: number
  expansionThreshold?: number // 0-1, default 0.8
  expansionFactor?: number // default 2 (doubles)
  unit?: string
  label?: ReactNode
  className?: string
  inputClassName?: string
  disabled?: boolean
}

export function ExpandingSlider({
  value,
  onChange,
  onChangeEnd,
  min = 0,
  initialMax = 60,
  step = 1,
  expansionThreshold = 0.8,
  expansionFactor = 2,
  unit = '',
  label,
  className = '',
  inputClassName = '',
  disabled = false,
}: ExpandingSliderProps) {
  const [currentMax, setCurrentMax] = useState(initialMax)
  const [inputValue, setInputValue] = useState(value.toString())
  const [isExpanded, setIsExpanded] = useState(false)
  const sliderRef = useRef<HTMLInputElement>(null)
  const isDragging = useRef(false)

  // Sync input value with prop
  useEffect(() => {
    if (!isDragging.current) {
      setInputValue(value.toString())
    }
  }, [value])

  // Expand max when value approaches threshold
  useEffect(() => {
    const thresholdValue = currentMax * expansionThreshold
    if (value >= thresholdValue && currentMax < 10000) {
      const newMax = Math.round(currentMax * expansionFactor)
      setCurrentMax(newMax)
      setIsExpanded(true)
    }
  }, [value, currentMax, expansionThreshold, expansionFactor])

  // Contract max when value is well below threshold (optional - keeps expanded)
  // Uncomment if you want auto-contract behavior:
  // useEffect(() => {
  //   const contractThreshold = initialMax * expansionThreshold * 0.5
  //   if (value < contractThreshold && currentMax > initialMax) {
  //     setCurrentMax(initialMax)
  //     setIsExpanded(false)
  //   }
  // }, [value, currentMax, initialMax, expansionThreshold])

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    isDragging.current = true
    const newValue = Number(e.target.value)
    setInputValue(newValue.toString())
    onChange(newValue)
  }, [onChange])

  const handleSliderEnd = useCallback(() => {
    isDragging.current = false
    onChangeEnd?.(value)
  }, [onChangeEnd, value])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(raw)
    
    const parsed = parseInt(raw, 10)
    if (!isNaN(parsed) && parsed >= min) {
      onChange(parsed)
      // Expand if needed for direct input
      if (parsed > currentMax) {
        setCurrentMax(Math.ceil(parsed * expansionFactor))
        setIsExpanded(true)
      }
    }
  }, [onChange, min, currentMax, expansionFactor])

  const handleInputBlur = useCallback(() => {
    const parsed = parseInt(inputValue, 10)
    if (isNaN(parsed) || parsed < min) {
      setInputValue(min.toString())
      onChange(min)
      onChangeEnd?.(min)
    } else {
      setInputValue(parsed.toString())
      onChangeEnd?.(parsed)
    }
  }, [inputValue, min, onChange, onChangeEnd])

  // Calculate fill percentage for styling
  const fillPercent = ((value - min) / (currentMax - min)) * 100
  const thresholdPercent = expansionThreshold * 100

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="label py-0">
          <span className="label-text">{label}</span>
        </label>
      )}
      <div className="flex items-center gap-2">
        {/* Slider with visual zones */}
        <div className="relative flex-1">
          <input
            ref={sliderRef}
            type="range"
            min={min}
            max={currentMax}
            step={step}
            value={value}
            onChange={handleSliderChange}
            onMouseUp={handleSliderEnd}
            onTouchEnd={handleSliderEnd}
            disabled={disabled}
            className="range range-sm range-primary w-full"
            style={{
              background: `linear-gradient(to right, 
                oklch(var(--p)) 0%, 
                oklch(var(--p)) ${Math.min(fillPercent, thresholdPercent)}%, 
                ${fillPercent > thresholdPercent ? 'oklch(var(--a))' : 'oklch(var(--b3))'} ${Math.min(fillPercent, thresholdPercent)}%,
                ${fillPercent > thresholdPercent ? `oklch(var(--a)) ${fillPercent}%, oklch(var(--b3)) ${fillPercent}%` : ''},
                oklch(var(--b3)) 100%
              )`,
            }}
          />
          {/* Zone indicator */}
          {isExpanded && (
            <div 
              className="absolute -bottom-3 left-0 right-0 flex justify-between text-[10px] text-base-content/40 pointer-events-none"
            >
              <span>0</span>
              <span className="absolute" style={{ left: `${(initialMax / currentMax) * 100}%`, transform: 'translateX(-50%)' }}>
                {initialMax}
              </span>
              <span>{currentMax}</span>
            </div>
          )}
        </div>

        {/* Number input */}
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={min}
            step={step}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            disabled={disabled}
            className={`input input-bordered input-sm w-20 text-center tabular-nums ${inputClassName}`}
          />
          {unit && <span className="text-sm text-base-content/60">{unit}</span>}
        </div>
      </div>
    </div>
  )
}
