import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const windowMock = {
  matchMedia: vi.fn(() => ({ matches: false })),
  setInterval,
  clearInterval,
}

Object.defineProperty(globalThis, 'window', {
  value: windowMock,
  writable: true,
  configurable: true,
})

vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue')>()
  return {
    ...actual,
    onMounted: vi.fn((callback: () => void) => callback()),
    onUnmounted: vi.fn(),
  }
})

import { copyServerAddress, useLandingCarousel } from './useLandingCarousel'

describe('useLandingCarousel', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('switches forwards, backwards, and to a selected slide', () => {
    const carousel = useLandingCarousel(5)

    carousel.next()
    expect(carousel.currentIndex.value).toBe(1)
    carousel.previous()
    expect(carousel.currentIndex.value).toBe(0)
    carousel.goTo(4)
    expect(carousel.currentIndex.value).toBe(4)
    carousel.next()
    expect(carousel.currentIndex.value).toBe(0)
  })

  it('keeps manual pause separate from temporary interaction pause', () => {
    const carousel = useLandingCarousel(5, 1000)

    carousel.toggleAutoplay()
    carousel.setInteractionPaused(true)
    carousel.setInteractionPaused(false)
    vi.advanceTimersByTime(1200)

    expect(carousel.isPaused.value).toBe(true)
    expect(carousel.currentIndex.value).toBe(0)
  })
})

describe('copyServerAddress', () => {
  it('copies the exact address and reports success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)

    await expect(copyServerAddress('play.goldencarrot.cn', { writeText })).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('play.goldencarrot.cn')
  })
})
