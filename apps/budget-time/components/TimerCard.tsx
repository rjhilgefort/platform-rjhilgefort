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
    <div className={`rounded-lg border-2 px-3 py-2 ${bgClass} ${borderClass}`}>
      {/* Row 1: Icon + Label */}
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={20} className="text-base-content/80" />
        <span className="text-lg font-bold text-base-content/80">{label}</span>
      </div>

      {/* Row 2: Bottom content + Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-1.5">{bottomLeft}</div>
        {button}
      </div>
    </div>
  )
}
