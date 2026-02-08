'use client'

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'

interface ExpandingSliderProps {
  value: number
  onChange: (value: number) => void
  onChangeEnd?: (value: number) => void
  min?: number
  initialMin?: number // For expanding min (negative direction)
  initialMax?: number
  step?: number
  expandThreshold?: number // 0-1, default 0.85 - expand when above this %
  contractThreshold?: number // 0-1, default 0.3 - contract when below this %
  incrementRatio?: number // default 0.5 - add this fraction of initialMax each step
  unit?: string
  label?: ReactNode
  className?: string
  inputClassName?: string
  disabled?: boolean
  allowNegative?: boolean // Allow slider to expand into negative territory
}

export function ExpandingSlider({
  value,
  onChange,
  onChangeEnd,
  min: fixedMin,
  initialMin = 0,
  initialMax = 60,
  step = 1,
  expandThreshold = 0.85,
  contractThreshold = 0.3,
  incrementRatio = 0.25,
  unit = '',
  label,
  className = '',
  inputClassName = '',
  disabled = false,
  allowNegative = false,
}: ExpandingSliderProps) {
  const [currentMax, setCurrentMax] = useState(initialMax)
  const [currentMin, setCurrentMin] = useState(fixedMin ?? initialMin)
  const [inputValue, setInputValue] = useState(value.toString())
  const sliderRef = useRef<HTMLInputElement>(null)
  const isDragging = useRef(false)
  
  // Calculate the step size for expansion/contraction (smaller = smoother)
  const increment = Math.round(initialMax * incrementRatio)

  // The effective min - either fixed or dynamic
  const effectiveMin = fixedMin ?? currentMin

  // Sync input value with prop
  useEffect(() => {
    if (!isDragging.current) {
      setInputValue(value.toString())
    }
  }, [value])

  // Adjust range live as value changes (during drag or otherwise)
  useEffect(() => {
    // Only expand/contract while actively dragging
    if (!isDragging.current) return
    
    // Expand max ONLY when at the exact ceiling (user is pushing past)
    if (value >= currentMax && currentMax < 10000) {
      setCurrentMax(currentMax + increment)
    }
    // Contract max when well below the current range (with headroom)
    else if (currentMax > initialMax && value >= 0) {
      const targetMax = currentMax - increment
      // Only contract if value would be at most 70% of the new max
      if (targetMax >= initialMax && value <= targetMax * 0.7) {
        setCurrentMax(targetMax)
      }
    }

    // Expand min into negative when hitting the floor (only if allowNegative and no fixedMin)
    if (allowNegative && fixedMin === undefined) {
      if (value <= effectiveMin) {
        setCurrentMin(currentMin - increment)
      }
      // Contract min back toward initialMin when value is well above
      else if (currentMin < initialMin) {
        const targetMin = currentMin + increment
        // Only contract if value would be at least 30% into the range
        if (targetMin <= initialMin && value >= targetMin + (currentMax - targetMin) * 0.3) {
          setCurrentMin(targetMin)
        }
      }
    }
  }, [value, currentMax, currentMin, effectiveMin, initialMax, initialMin, increment, allowNegative, fixedMin])

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
    
    // Handle negative sign being typed
    if (raw === '-' || raw === '') {
      return
    }
    
    const parsed = parseInt(raw, 10)
    if (!isNaN(parsed)) {
      // For negative input, check if we allow it
      const minAllowed = allowNegative ? -Infinity : (fixedMin ?? 0)
      if (parsed >= minAllowed) {
        onChange(parsed)
        // Expand max if needed for direct input - round up to next increment
        if (parsed > currentMax) {
          const stepsNeeded = Math.ceil((parsed - currentMax) / increment)
          setCurrentMax(currentMax + stepsNeeded * increment)
        }
        // Expand min if needed for negative direct input
        if (allowNegative && fixedMin === undefined && parsed < currentMin) {
          const stepsNeeded = Math.ceil((currentMin - parsed) / increment)
          setCurrentMin(currentMin - stepsNeeded * increment)
        }
      }
    }
  }, [onChange, currentMax, currentMin, increment, allowNegative, fixedMin])

  const handleInputBlur = useCallback(() => {
    const parsed = parseInt(inputValue, 10)
    const minAllowed = fixedMin ?? (allowNegative ? currentMin : initialMin)
    if (isNaN(parsed)) {
      setInputValue(minAllowed.toString())
      onChange(minAllowed)
      onChangeEnd?.(minAllowed)
    } else {
      setInputValue(parsed.toString())
      onChangeEnd?.(parsed)
    }
  }, [inputValue, fixedMin, currentMin, initialMin, allowNegative, onChange, onChangeEnd])

  // Calculate fill percentage for styling
  const range = currentMax - effectiveMin
  const fillPercent = range > 0 ? ((value - effectiveMin) / range) * 100 : 0
  const isExpanded = currentMax > initialMax
  const isExpandedNegative = currentMin < initialMin

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="label py-0">
          <span className="label-text">{label}</span>
        </label>
      )}
      <div className="flex items-center gap-2">
        {/* Slider */}
        <div className="relative flex-1">
          <input
            ref={sliderRef}
            type="range"
            min={effectiveMin}
            max={currentMax}
            step={step}
            value={value}
            onChange={handleSliderChange}
            onMouseUp={handleSliderEnd}
            onTouchEnd={handleSliderEnd}
            disabled={disabled}
            className="range range-sm range-primary w-full"
          />
          {/* Show current range when expanded */}
          {(isExpanded || isExpandedNegative) && (
            <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-[10px] text-base-content/40 pointer-events-none">
              {isExpandedNegative && <span>min: {currentMin}</span>}
              {!isExpandedNegative && <span />}
              {isExpanded && <span>max: {currentMax}</span>}
            </div>
          )}
        </div>

        {/* Number input */}
        <div className="flex items-center gap-1">
          <input
            type="number"
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
