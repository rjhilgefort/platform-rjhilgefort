'use client'

import { useEffect, useRef } from 'react'

interface TimeUpSoundProps {
  shouldPlay: boolean
}

export function TimeUpSound({ shouldPlay }: TimeUpSoundProps) {
  const hasPlayedRef = useRef(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (shouldPlay && !hasPlayedRef.current) {
      hasPlayedRef.current = true
      playBeep()
    } else if (!shouldPlay) {
      hasPlayedRef.current = false
    }
  }, [shouldPlay])

  const playBeep = () => {
    if (typeof window === 'undefined') return

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = 880 // A5 note
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.5)

    // Play three beeps
    setTimeout(() => {
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.frequency.value = 880
      osc2.type = 'sine'
      gain2.gain.setValueAtTime(0.3, ctx.currentTime)
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
      osc2.start(ctx.currentTime)
      osc2.stop(ctx.currentTime + 0.5)
    }, 600)

    setTimeout(() => {
      const osc3 = ctx.createOscillator()
      const gain3 = ctx.createGain()
      osc3.connect(gain3)
      gain3.connect(ctx.destination)
      osc3.frequency.value = 1047 // C6 note
      osc3.type = 'sine'
      gain3.gain.setValueAtTime(0.3, ctx.currentTime)
      gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)
      osc3.start(ctx.currentTime)
      osc3.stop(ctx.currentTime + 0.8)
    }, 1200)
  }

  return null
}
