'use client'

import { ComponentType, ReactNode } from 'react'

interface TimerCardProps {
  /** Icon component */
  icon: ComponentType<{ size?: number; className?: string }>
  /** Label text */
  label: string
  /** Content for bottom-left (time display, ratio, etc.) */
  bottomLeft: ReactNode
  /** Button element */
  button: ReactNode
  /** Background color variant */
  variant?: 'default' | 'success' | 'warning'
  /** Optional border color override */
  borderColor?: 'transparent' | 'primary' | 'success' | 'warning'
}

export function TimerCard({
  icon: Icon,
  label,
  bottomLeft,
  button,
  variant = 'default',
  borderColor,
}: TimerCardProps) {
  const bgClass = {
    default: 'bg-base-200',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
  }[variant]

  // Default border matches variant (subtle), can be overridden
  const effectiveBorderColor = borderColor ?? variant
  const borderClass = {
    default: 'border-transparent',
    primary: 'border-primary',
    success: 'border-success/30',
    warning: 'border-warning/30',
    transparent: 'border-transparent',
  }[effectiveBorderColor]

  return (
    <div className={`flex flex-col h-full rounded-lg border-2 px-3 py-2 ${bgClass} ${borderClass}`}>
      {/* Row 1: Icon + Label */}
      <div className="mb-1 text-lg font-bold text-base-content/80">
        <Icon size={20} className="inline align-text-bottom mr-1" />
        {label}
      </div>

      {/* Row 2: Time + Button - stacks vertically on mobile, side-by-side on sm+ */}
      <div className="mt-auto sm:mt-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-baseline gap-1.5">{bottomLeft}</div>
        <div className="w-full sm:w-auto [&>button]:w-full [&>button]:sm:w-auto">{button}</div>
      </div>
    </div>
  )
}
