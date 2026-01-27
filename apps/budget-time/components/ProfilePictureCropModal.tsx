'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface ProfilePictureCropModalProps {
  isOpen: boolean
  imageFile: File | null
  onConfirm: (croppedBase64: string) => void
  onCancel: () => void
}

function isHeicFile(file: File): boolean {
  const heicTypes = ['image/heic', 'image/heif']
  if (heicTypes.includes(file.type.toLowerCase())) return true
  const ext = file.name.toLowerCase().split('.').pop()
  return ext === 'heic' || ext === 'heif'
}

export function ProfilePictureCropModal({
  isOpen,
  imageFile,
  onConfirm,
  onCancel,
}: ProfilePictureCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canvasSize = 280
  const outputSize = 200

  // Load image when file changes
  useEffect(() => {
    if (!imageFile) {
      setImageLoaded(false)
      setConverting(false)
      setError(null)
      return
    }

    let objectUrl: string | null = null

    const loadImage = async () => {
      setError(null)

      const tryLoadImage = (blob: Blob): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const url = URL.createObjectURL(blob)
          const img = new Image()
          img.onload = () => {
            objectUrl = url
            resolve(img)
          }
          img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error('Image load failed'))
          }
          img.src = url
        })
      }

      try {
        // Try loading directly first (Safari supports HEIC natively)
        const img = await tryLoadImage(imageFile)
        imageRef.current = img
        setImageLoaded(true)
        setZoom(1)
        setPan({ x: 0, y: 0 })
      } catch {
        // If direct load fails and it's HEIC, try server-side conversion
        if (isHeicFile(imageFile)) {
          try {
            setConverting(true)
            const formData = new FormData()
            formData.append('file', imageFile)

            const response = await fetch('/api/convert-heic', {
              method: 'POST',
              body: formData,
            })

            if (!response.ok) {
              throw new Error('Conversion failed')
            }

            const { base64 } = await response.json()
            setConverting(false)

            // Load converted image from base64
            const img = new Image()
            img.onload = () => {
              imageRef.current = img
              setImageLoaded(true)
              setZoom(1)
              setPan({ x: 0, y: 0 })
            }
            img.onerror = () => {
              setError('Failed to load converted image')
            }
            img.src = base64
          } catch (err) {
            console.error('HEIC conversion error:', err)
            setConverting(false)
            setError('Failed to convert HEIC image')
          }
        } else {
          setError('Failed to load image')
        }
      }
    }

    loadImage()

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [imageFile])

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img || !imageLoaded) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear
    ctx.fillStyle = '#1d232a'
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    // Calculate scaled dimensions to fit image in canvas
    const scale = Math.min(canvasSize / img.width, canvasSize / img.height) * zoom
    const scaledWidth = img.width * scale
    const scaledHeight = img.height * scale

    // Center + pan offset
    const x = (canvasSize - scaledWidth) / 2 + pan.x
    const y = (canvasSize - scaledHeight) / 2 + pan.y

    // Draw image
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

    // Draw circular mask overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.beginPath()
    ctx.rect(0, 0, canvasSize, canvasSize)
    ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 10, 0, Math.PI * 2, true)
    ctx.fill()

    // Draw circle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - 10, 0, Math.PI * 2)
    ctx.stroke()
  }, [imageLoaded, zoom, pan])

  useEffect(() => {
    draw()
  }, [draw])

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (e.touches.length === 1 && touch) {
      setIsDragging(true)
      setDragStart({
        x: touch.clientX - pan.x,
        y: touch.clientY - pan.y,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!isDragging || e.touches.length !== 1 || !touch) return
    setPan({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Export cropped image
  const handleConfirm = () => {
    const img = imageRef.current
    if (!img) return

    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = outputSize
    exportCanvas.height = outputSize
    const ctx = exportCanvas.getContext('2d')
    if (!ctx) return

    // Calculate same transform as display but scaled to output size
    const displayScale = Math.min(canvasSize / img.width, canvasSize / img.height) * zoom
    const outputScale = (outputSize / canvasSize) * displayScale

    const scaledWidth = img.width * outputScale
    const scaledHeight = img.height * outputScale

    const x = (outputSize - scaledWidth) / 2 + pan.x * (outputSize / canvasSize)
    const y = (outputSize - scaledHeight) / 2 + pan.y * (outputSize / canvasSize)

    // Clip to circle
    ctx.beginPath()
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()

    // Fill background
    ctx.fillStyle = '#1d232a'
    ctx.fillRect(0, 0, outputSize, outputSize)

    // Draw image
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

    const dataUrl = exportCanvas.toDataURL('image/jpeg', 0.85)
    onConfirm(dataUrl)
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Adjust Photo</h3>

        <div className="flex flex-col items-center gap-4">
          {error ? (
            <div className="w-[280px] h-[280px] flex flex-col items-center justify-center gap-2">
              <span className="text-error">{error}</span>
              <button type="button" className="btn btn-sm" onClick={onCancel}>
                Try again
              </button>
            </div>
          ) : !imageLoaded ? (
            <div className="w-[280px] h-[280px] flex flex-col items-center justify-center gap-2">
              <span className="loading loading-spinner loading-lg" />
              {converting && <span className="text-sm text-base-content/60">Converting HEIC...</span>}
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              className="cursor-move rounded-lg touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          )}

          <div className="w-full flex items-center gap-3">
            <span className="text-sm">Zoom</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="range range-sm flex-1"
            />
          </div>

          <p className="text-sm text-base-content/60">Drag to reposition</p>
        </div>

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={!imageLoaded}
          >
            Save
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onCancel} />
    </div>
  )
}
