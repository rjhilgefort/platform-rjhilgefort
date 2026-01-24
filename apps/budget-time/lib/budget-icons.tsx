import { ComponentType } from 'react'
import { TbDeviceTvFilled, TbDeviceGamepad3Filled, TbStarFilled, TbBookFilled, TbStarsFilled } from 'react-icons/tb'
import { getIconComponent } from './icon-registry'

type IconProps = { size?: number; className?: string }

export const budgetTypeIcons: Record<string, ComponentType<IconProps>> = {
  tv: TbDeviceTvFilled,
  games: TbDeviceGamepad3Filled,
  extra: TbStarFilled,
}

export const earningTypeIcons: Record<string, ComponentType<IconProps>> = {
  reading: TbBookFilled,
}

export function getBudgetIcon(slug: string, dbIcon?: string | null): ComponentType<IconProps> {
  if (dbIcon) {
    return getIconComponent(dbIcon)
  }
  return budgetTypeIcons[slug] ?? TbStarFilled
}

export function getEarningIcon(slug: string, dbIcon?: string | null): ComponentType<IconProps> {
  if (dbIcon) {
    return getIconComponent(dbIcon)
  }
  return earningTypeIcons[slug] ?? TbStarsFilled
}
