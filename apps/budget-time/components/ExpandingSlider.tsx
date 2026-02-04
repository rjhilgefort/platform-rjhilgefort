'use client'

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react'

interface ExpandingSliderProps {
  value: number
  onChange: (value: number) => void
  onChangeEnd?: (value: number) => void
  min?: number
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
}

export function ExpandingSlider({
  value,
  onChange,
  onChangeEnd,
  min = 0,
  initialMax = 60,
  step = 1,
  expandThreshold = 0.85,
  contractThreshold = 0.3,
  incrementRatio = 0.5,
  unit = '',
  label,
  className = '',
  inputClassName = '',
  disabled = false,
}: ExpandingSliderProps) {
  const [currentMax, setCurrentMax] = useState(initialMax)
  const [inputValue, setInputValue] = useState(value.toString())
  const sliderRef = useRef<HTMLInputElement>(null)
  const isDragging = useRef(false)
  
  // Calculate the step size for expansion/contraction
  const increment = Math.round(initialMax * incrementRatio)

  // Sync input value with prop
  useEffect(() => {
    if (!isDragging.current) {
      setInputValue(value.toString())
    }
  }, [value])

  // Adjust range live as value changes (during drag or otherwise)
  useEffect(() => {
    const percentOfMax = value / currentMax
    
    // Expand only when hitting the ceiling (at or very near max)
    if (percentOfMax >= 0.99 && currentMax < 10000) {
      setCurrentMax(currentMax + increment)
    }
    // Contract when in the bottom portion - subtract one increment (but not below initialMax)
    else if (percentOfMax <= contractThreshold && currentMax > initialMax) {
      const newMax = Math.max(initialMax, currentMax - increment)
      // Only contract if value still fits with headroom
      if (value <= newMax * 0.9) {
        setCurrentMax(newMax)
      }
    }
  }, [value, currentMax, initialMax, contractThreshold, increment])

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
      // Expand if needed for direct input - round up to next increment
      if (parsed > currentMax) {
        const stepsNeeded = Math.ceil((parsed - currentMax) / increment)
        setCurrentMax(currentMax + stepsNeeded * increment)
      }
    }
  }, [onChange, min, currentMax, increment])

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
  const isExpanded = currentMax > initialMax

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
            min={min}
            max={currentMax}
            step={step}
            value={value}
            onChange={handleSliderChange}
            onMouseUp={handleSliderEnd}
            onTouchEnd={handleSliderEnd}
            disabled={disabled}
            className="range range-sm range-primary w-full"
          />
          {/* Show current max when expanded */}
          {isExpanded && (
            <div className="absolute -bottom-4 right-0 text-[10px] text-base-content/40 pointer-events-none">
              max: {currentMax}
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
