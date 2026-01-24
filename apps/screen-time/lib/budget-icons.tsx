import { LuTv, LuGamepad2, LuStar } from 'react-icons/lu'
import { ComponentType } from 'react'

type IconProps = { size?: number; className?: string }

export const budgetTypeIcons: Record<string, ComponentType<IconProps>> = {
  tv: LuTv,
  games: LuGamepad2,
  extra: LuStar,
}

export function getBudgetIcon(slug: string): ComponentType<IconProps> {
  return budgetTypeIcons[slug] ?? LuStar
}
