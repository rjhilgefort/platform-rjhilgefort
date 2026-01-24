import { LuTv, LuGamepad2, LuStar, LuBookOpen, LuSparkles } from 'react-icons/lu'
import { ComponentType } from 'react'

type IconProps = { size?: number; className?: string }

export const budgetTypeIcons: Record<string, ComponentType<IconProps>> = {
  tv: LuTv,
  games: LuGamepad2,
  extra: LuStar,
}

export const earningTypeIcons: Record<string, ComponentType<IconProps>> = {
  reading: LuBookOpen,
}

export function getBudgetIcon(slug: string): ComponentType<IconProps> {
  return budgetTypeIcons[slug] ?? LuStar
}

export function getEarningIcon(slug: string): ComponentType<IconProps> {
  return earningTypeIcons[slug] ?? LuSparkles
}
