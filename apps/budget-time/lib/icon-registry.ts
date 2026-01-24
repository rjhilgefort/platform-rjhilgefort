import { ComponentType } from 'react'
import * as TbIcons from 'react-icons/tb'
import * as FaIcons from 'react-icons/fa6'
import * as MdIcons from 'react-icons/md'
import { IconType } from 'react-icons'

type IconProps = { size?: number; className?: string }

// Combine multiple icon sets for variety
const tbFilled = Object.keys(TbIcons).filter((name) => name.endsWith('Filled'))
const faIcons = Object.keys(FaIcons).filter((name) => name.startsWith('Fa'))
const mdIcons = Object.keys(MdIcons).filter((name) => name.startsWith('Md'))

export const availableIcons = [...tbFilled, ...faIcons, ...mdIcons].sort()

const iconMap: Record<string, IconType> = {
  ...(TbIcons as Record<string, IconType>),
  ...(FaIcons as Record<string, IconType>),
  ...(MdIcons as Record<string, IconType>),
}

export function getIconComponent(name: string): ComponentType<IconProps> {
  return iconMap[name] ?? TbIcons.TbStarFilled
}

export const defaultBudgetIcon = 'TbStarFilled'
export const defaultEarningIcon = 'TbStarsFilled'
