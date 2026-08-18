<template>
  <div id="app">
    <!-- Top Navigation -->
    <TopNavigation v-if="!isImmersivePage" />

    <!-- Main Content with top padding for navigation -->
    <div :class="[isImmersivePage ? '' : 'pt-16 pb-safe', 'relative z-10']">
      <router-view />
    </div>

    <!-- Notification System -->
    <NotificationSystem ref="notificationSystemRef" />

    <!-- Enhanced Footer -->
    <AppFooter v-if="!isImmersivePage" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, watch, ref, onMounted, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useNotification } from '@/composables/useNotification'
import NotificationSystem from '@/components/NotificationSystem.vue'
import TopNavigation from '@/components/TopNavigation.vue'
import AppFooter from '@/components/AppFooter.vue'
import type { AppConfig } from '@/types'

const config = inject<Ref<AppConfig>>('config', ref({}))
const reloadConfig = inject<() => Promise<boolean>>('reloadConfig', async () => false)
const { setNotificationSystem } = useNotification()

const notificationSystemRef = ref()

onMounted(() => {
  if (notificationSystemRef.value) {
    setNotificationSystem(notificationSystemRef.value)
  }
})

const route = useRoute()
const { t, locale } = useI18n()
const isImmersivePage = computed(() => route.name === 'Home' || route.name === 'Register')

// Update document title
watch(
  [() => route.meta.title, () => locale.value, () => config.value?.webServerPrefix],
  ([newTitle]) => {
    const title = newTitle ? t(newTitle as string) : ''
    const prefix = config.value?.webServerPrefix || 'VerifyMC'
    document.title = title ? `${title} - ${prefix}` : prefix
  },
  { immediate: true }
)

// 暴露重载配置方法给全局
if (typeof window !== 'undefined') {
  (window as Window & { reloadVerifyMCConfig?: () => Promise<boolean> }).reloadVerifyMCConfig = reloadConfig
}
</script>

