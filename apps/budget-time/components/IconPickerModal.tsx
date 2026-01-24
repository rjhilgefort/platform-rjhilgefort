'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { availableIcons, getIconComponent } from '../lib/icon-registry'

interface IconPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (iconName: string) => void
  currentIcon: string | null
}

const ICONS_PER_PAGE = 80

export function IconPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentIcon,
}: IconPickerModalProps) {
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(ICONS_PER_PAGE)
  const loaderRef = useRef<HTMLDivElement>(null)

  const allFilteredIcons = useMemo(() => {
    if (!search.trim()) return availableIcons
    const query = search.toLowerCase()
    return availableIcons.filter((name) =>
      name.toLowerCase().includes(query)
    )
  }, [search])

  const filteredIcons = useMemo(() => {
    return allFilteredIcons.slice(0, visibleCount)
  }, [allFilteredIcons, visibleCount])

  const hasMore = filteredIcons.length < allFilteredIcons.length

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(ICONS_PER_PAGE)
  }, [search])

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setVisibleCount(ICONS_PER_PAGE)
    }
  }, [isOpen])

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!isOpen) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          setVisibleCount((prev) => prev + ICONS_PER_PAGE)
        }
      },
      { threshold: 0.1 }
    )

    const loader = loaderRef.current
    if (loader) observer.observe(loader)

    return () => {
      if (loader) observer.unobserve(loader)
    }
  }, [isOpen, hasMore])

  const handleSelect = (iconName: string) => {
    onSelect(iconName)
    setSearch('')
    onClose()
  }

  const handleClose = () => {
    setSearch('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl max-h-[80vh] flex flex-col">
        <h3 className="font-bold text-lg mb-4">Choose Icon</h3>

        <input
          type="text"
          className="input input-bordered input-lg w-full text-lg"
          placeholder="Search 7000+ icons... (try: game, controller, book, child)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />

        <div className="overflow-y-auto -mx-2 mt-4" style={{ height: '400px' }}>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2">
            {filteredIcons.map((iconName) => {
              const Icon = getIconComponent(iconName)
              const isSelected = currentIcon === iconName
              return (
                <button
                  key={iconName}
                  type="button"
                  className={`btn btn-square ${
                    isSelected ? 'btn-primary' : 'btn-ghost'
                  }`}
                  onClick={() => handleSelect(iconName)}
                  title={iconName.replace(/^Ri/, '').replace(/Fill$/, '')}
                >
                  <Icon size={24} />
                </button>
              )
            })}
          </div>
          {filteredIcons.length === 0 && (
            <p className="text-center text-base-content/50 py-8">
              No icons found for &quot;{search}&quot;
            </p>
          )}
          {hasMore && (
            <div ref={loaderRef} className="flex justify-center py-4">
              <span className="loading loading-spinner loading-sm" />
            </div>
          )}
          {!hasMore && allFilteredIcons.length > ICONS_PER_PAGE && (
            <p className="text-center text-base-content/50 py-2 text-sm">
              Showing all {allFilteredIcons.length} matches
            </p>
          )}
        </div>

        <div className="modal-action mt-4">
          <button type="button" className="btn" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleClose} />
    </dialog>
  )
}
