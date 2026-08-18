import { computed, onMounted, onUnmounted, ref } from 'vue'

interface ClipboardWriter {
  writeText(value: string): Promise<void>
}

export const copyServerAddress = async (
  address: string,
  clipboard: ClipboardWriter = navigator.clipboard,
): Promise<boolean> => {
  try {
    await clipboard.writeText(address)
    return true
  } catch {
    return false
  }
}

export const useLandingCarousel = (slideCount: number, autoplayMs = 6500) => {
  const currentIndex = ref(0)
  const progress = ref(0)
  const manuallyPaused = ref(false)
  const interactionPaused = ref(false)
  const reducedMotion = ref(false)
  let timer: number | undefined

  const isPaused = computed(
    () => manuallyPaused.value || interactionPaused.value || reducedMotion.value,
  )

  const goTo = (index: number) => {
    currentIndex.value = (index + slideCount) % slideCount
    progress.value = 0
  }

  const next = () => goTo(currentIndex.value + 1)
  const previous = () => goTo(currentIndex.value - 1)
  const toggleAutoplay = () => {
    manuallyPaused.value = !manuallyPaused.value
  }
  const setInteractionPaused = (paused: boolean) => {
    interactionPaused.value = paused
  }

  onMounted(() => {
    reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tickMs = 100
    timer = window.setInterval(() => {
      if (isPaused.value) return
      progress.value += (tickMs / autoplayMs) * 100
      if (progress.value >= 100) next()
    }, tickMs)
  })

  onUnmounted(() => {
    if (timer) window.clearInterval(timer)
  })

  return {
    currentIndex,
    progress,
    manuallyPaused,
    interactionPaused,
    isPaused,
    goTo,
    next,
    previous,
    toggleAutoplay,
    setInteractionPaused,
  }
}
