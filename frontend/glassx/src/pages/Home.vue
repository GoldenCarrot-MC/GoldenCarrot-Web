Active code page: 65001
Active code page: 65001
Active code page: 65001
<template>
  <main id="top" class="landing-page">
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="#top" aria-label="Golden Carrot 首页">
          <span class="brand-mark"><Carrot :size="18" /></span>
          <span class="brand-name">Golden Carrot</span>
          <span class="brand-edition">SURVIVAL</span>
        </a>

        <nav class="desktop-nav" aria-label="主导航">
          <a href="#features">服务器特色</a>
          <a href="#world">游戏世界</a>
          <a href="#join">加入方式</a>
          <a href="#community">社区</a>
        </nav>

        <div class="header-actions">
          <RouterLink class="login-link" to="/login"><LogIn :size="16" />登录 / 管理</RouterLink>
          <button class="apply-button compact" type="button" @click="openWhitelist">
            申请白名单 <ArrowUpRight :size="16" />
          </button>
          <button
            class="menu-button"
            type="button"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-navigation"
            :aria-label="mobileMenuOpen ? '关闭菜单' : '打开菜单'"
            :title="mobileMenuOpen ? '关闭菜单' : '打开菜单'"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <X v-if="mobileMenuOpen" :size="22" />
            <Menu v-else :size="22" />
          </button>
        </div>
      </div>

      <nav v-if="mobileMenuOpen" id="mobile-navigation" class="mobile-nav" aria-label="移动端导航">
        <a href="#features" @click="mobileMenuOpen = false">服务器特色</a>
        <a href="#world" @click="mobileMenuOpen = false">游戏世界</a>
        <a href="#join" @click="mobileMenuOpen = false">加入方式</a>
        <a href="#community" @click="mobileMenuOpen = false">社区</a>
        <RouterLink to="/login">登录 / 管理</RouterLink>
        <button type="button" @click="openWhitelist">申请白名单</button>
      </nav>
    </header>

    <section class="hero-section section-shell">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> JAVA 26.2 · 纯生存服务器</p>
        <h1><span>Golden Carrot</span>把日子，种进同一个世界。</h1>
        <p class="hero-description">
          没有等级战力，没有抽奖商城。只有一张长期保留的地图，经过筛选的轻量插件，和愿意一起把世界慢慢建好的玩家。
        </p>

        <div class="hero-actions">
          <button class="apply-button" type="button" @click="openWhitelist">
            申请白名单 <ArrowRight :size="18" />
          </button>
          <button class="copy-button" type="button" @click="handleCopyAddress">
            <Check v-if="copyState === 'success'" :size="18" />
            <Copy v-else :size="18" />
            <span>{{ copyLabel }}</span>
          </button>
        </div>
        <p class="copy-feedback" aria-live="polite">{{ copyFeedback }}</p>

        <dl class="server-facts">
          <div>
            <dt>服务器地址</dt>
            <dd>{{ serverAddress }}</dd>
          </div>
          <div>
            <dt>游戏版本</dt>
            <dd>Minecraft Java 26.2</dd>
          </div>
          <div>
            <dt>在线状态</dt>
            <dd :class="statusClass"><span class="status-dot"></span>{{ statusLabel }}</dd>
          </div>
          <div>
            <dt>在线人数</dt>
            <dd>{{ playersLabel }}</dd>
          </div>
        </dl>
      </div>

      <div class="world-visual" aria-label="抽象体素山谷与世界坐标视图" role="img">
        <div class="visual-grid"></div>
        <div class="visual-sun"></div>
        <div class="contour contour-a"></div>
        <div class="contour contour-b"></div>
        <div class="terrain terrain-back"></div>
        <div class="terrain terrain-mid"></div>
        <div class="terrain terrain-front"></div>
        <div class="watchtower"><span></span><i></i><b></b></div>
        <div class="map-pin"><MapPin :size="18" /><span>公共出生点</span><small>X 213 · Z -48</small></div>
        <div class="visual-coordinate top"><span>N 00°</span><span>WORLD / 04</span></div>
        <div class="visual-coordinate bottom"><span>ALT 072</span><span>SEED LOCKED</span></div>
        <div class="visual-status" :class="statusClass">
          <span class="status-dot"></span>
          <div><small>SERVER SIGNAL</small><strong>{{ statusShortLabel }}</strong></div>
        </div>
      </div>

      <a class="scroll-cue" href="#features"><span>向下探索</span><ArrowDown :size="16" /></a>
    </section>

    <section id="features" class="features-band">
      <div class="section-shell section-content">
        <div class="section-heading split-heading">
          <div><p class="eyebrow">01 / SURVIVAL, SIMPLY</p><h2>纯粹，但不单调。</h2></div>
          <p>我们只为原版生存补足必要的便利，不用数值系统替代玩家自己的目标。</p>
        </div>

        <div class="feature-grid">
          <article v-for="(feature, index) in features" :key="feature.title" :class="`feature-${index + 1}`">
            <div class="feature-top"><span>0{{ index + 1 }}</span><component :is="feature.icon" :size="22" /></div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <small>{{ feature.note }}</small>
          </article>
        </div>
      </div>
    </section>

    <section
      id="world"
      class="adventure-band"
      tabindex="0"
      aria-roledescription="轮播"
      aria-label="今天想做什么"
      @keydown.left.prevent="previous"
      @keydown.right.prevent="next"
      @mouseenter="setInteractionPaused(true)"
      @mouseleave="setInteractionPaused(false)"
      @focusin="setInteractionPaused(true)"
      @focusout="handleCarouselFocusOut"
    >
      <div class="section-shell section-content">
        <div class="carousel-header">
          <div class="section-heading"><p class="eyebrow">02 / YOUR NEXT DAY</p><h2>今天，想做什么？</h2></div>
          <div class="carousel-controls" aria-label="轮播控制">
            <span>{{ String(currentIndex + 1).padStart(2, '0') }} / {{ String(adventures.length).padStart(2, '0') }}</span>
            <button type="button" :aria-label="manuallyPaused ? '继续自动播放' : '暂停自动播放'" :title="manuallyPaused ? '继续自动播放' : '暂停自动播放'" @click="toggleAutoplay">
              <Play v-if="manuallyPaused" :size="17" fill="currentColor" />
              <Pause v-else :size="17" fill="currentColor" />
            </button>
            <button type="button" aria-label="上一项" title="上一项" @click="previous"><ChevronLeft :size="19" /></button>
            <button type="button" aria-label="下一项" title="下一项" @click="next"><ChevronRight :size="19" /></button>
          </div>
        </div>

        <div class="progress-track" aria-hidden="true"><span :style="{ transform: `scaleX(${progress / 100})` }"></span></div>

        <div class="carousel-layout">
          <div class="adventure-tabs" role="tablist" aria-label="玩法选择">
            <button
              v-for="(adventure, index) in adventures"
              :id="`adventure-tab-${adventure.id}`"
              :key="adventure.id"
              type="button"
              role="tab"
              :aria-selected="currentIndex === index"
              :aria-controls="`adventure-panel-${adventure.id}`"
              :tabindex="currentIndex === index ? 0 : -1"
              :class="{ active: currentIndex === index }"
              @click="goTo(index)"
            >
              <span>0{{ index + 1 }}</span><component :is="adventure.icon" :size="20" />
              <strong>{{ adventure.label }}</strong><ArrowUpRight :size="17" />
            </button>
          </div>

          <div class="adventure-stage" aria-live="polite">
            <Transition name="slide-fade" mode="out-in">
              <article
                :id="`adventure-panel-${currentAdventure.id}`"
                :key="currentAdventure.id"
                role="tabpanel"
                :aria-labelledby="`adventure-tab-${currentAdventure.id}`"
                :class="`adventure-${currentAdventure.id}`"
              >
                <div class="stage-art" aria-hidden="true">
                  <div class="art-grid"></div>
                  <component :is="currentAdventure.icon" :size="48" />
                  <span class="art-index">{{ currentAdventure.code }}</span>
                </div>
                <div class="stage-copy">
                  <p>{{ currentAdventure.code }} · {{ currentAdventure.kicker }}</p>
                  <h3>{{ currentAdventure.title }}</h3>
                  <span>{{ currentAdventure.description }}</span>
                  <ul><li v-for="tag in currentAdventure.tags" :key="tag">{{ tag }}</li></ul>
                </div>
              </article>
            </Transition>
          </div>
        </div>

        <div class="carousel-dots" role="tablist" aria-label="选择轮播页面">
          <button
            v-for="(adventure, index) in adventures"
            :key="`dot-${adventure.id}`"
            type="button"
            role="tab"
            :aria-label="`切换到${adventure.label}`"
            :aria-selected="currentIndex === index"
            :class="{ active: currentIndex === index }"
            @click="goTo(index)"
          ><span></span></button>
        </div>
      </div>
    </section>

    <section id="join" class="join-band">
      <div class="section-shell join-layout">
        <div class="join-intro">
          <p class="eyebrow">03 / JOIN THE WORLD</p>
          <h2>先认识彼此，<br />再一起出发。</h2>
          <p>白名单不是考试。我们只想确认，你期待的也是一个安静、长期、由玩家共同维护的生存世界。</p>
          <button class="apply-button" type="button" @click="openWhitelist">开始申请 <ArrowRight :size="18" /></button>
        </div>
        <ol class="join-steps">
          <li v-for="(step, index) in joinSteps" :key="step.title">
            <span>0{{ index + 1 }}</span>
            <div><component :is="step.icon" :size="22" /><h3>{{ step.title }}</h3><p>{{ step.description }}</p></div>
            <small>{{ step.time }}</small>
          </li>
        </ol>
      </div>
    </section>

    <AppFooter id="community" />

    <dialog ref="whitelistDialog" class="whitelist-dialog" aria-labelledby="whitelist-title" @close="handleDialogClose" @click.self="closeWhitelist">
      <div class="dialog-shell">
        <div class="dialog-header">
          <div><p class="eyebrow">WHITELIST APPLICATION</p><h2 id="whitelist-title">申请加入 Golden Carrot</h2><span>字段会根据服务器当前配置自动显示。</span></div>
          <button type="button" aria-label="关闭申请窗口" title="关闭" @click="closeWhitelist"><X :size="21" /></button>
        </div>
        <div class="dialog-body"><RegistrationForm /></div>
      </div>
    </dialog>
  </main>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref, type Component, type Ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowDown, ArrowRight, ArrowUpRight, Carrot, Check, ChevronLeft, ChevronRight,
  Compass, Copy, Feather, Gem, Hammer, Landmark, LogIn, MailCheck, Map, MapPin,
  Menu, Mountain, Pause, Play, Send, ShieldCheck, Sprout, Users, Wrench, X,
} from 'lucide-vue-next'
import AppFooter from '@/components/AppFooter.vue'
import RegistrationForm from '@/components/RegistrationForm.vue'
import { useLandingCarousel, copyServerAddress } from '@/composables/useLandingCarousel'
import { apiService } from '@/services/api'
import type { AppConfig, ServerStatusData } from '@/types'

interface Feature { title: string; description: string; note: string; icon: Component }
interface Adventure { id: string; label: string; code: string; kicker: string; title: string; description: string; tags: string[]; icon: Component }
interface JoinStep { title: string; description: string; time: string; icon: Component }
type CopyState = 'idle' | 'success' | 'error'

const config = inject<Ref<AppConfig>>('config', ref({}))
const serverStatus = ref<ServerStatusData | null>(null)
const statusLoading = ref(true)
const copyState = ref<CopyState>('idle')
const mobileMenuOpen = ref(false)
const whitelistDialog = ref<HTMLDialogElement | null>(null)

const features: Feature[] = [
  { title: '长期存档', description: '你的房子、铁路和走过的路不会因为短期热度被轻易清空。', note: '地图持续维护', icon: Landmark },
  { title: '原版探索', description: '保留生存本来的节奏，让第一颗钻石和每次远行仍然有意义。', note: '不设 RPG 数值', icon: Compass },
  { title: '玩家共建', description: '公共交通、聚落与活动由玩家发起，管理组只提供必要支持。', note: '社区共同决定', icon: Users },
  { title: '精选轻量插件', description: '只补足保护、查询和协作体验，不把生存改造成任务列表。', note: '克制地增强原版', icon: Feather },
  { title: '稳定维护', description: '持续备份、性能巡检和清晰规则，让投入的时间值得被认真对待。', note: '运维透明可靠', icon: Wrench },
]

const adventures: Adventure[] = [
  { id: 'build', label: '建造', code: 'A01', kicker: 'BUILD', title: '把一块空地，变成大家认得的地标。', description: '从自己的第一间木屋，到穿过山谷的车站。这里的建造会被使用，也会被记住。', tags: ['建筑协作', '公共工程', '长期保存'], icon: Hammer },
  { id: 'explore', label: '远行', code: 'A02', kicker: 'EXPLORE', title: '沿着地平线，去找地图还没写下的地方。', description: '带好补给，选一个方向，把新群系、遗迹与路上的故事带回聚落。', tags: ['原版群系', '地图记录', '结伴远征'], icon: Map },
  { id: 'mine', label: '挖矿', code: 'A03', kicker: 'MINE', title: '向下，直到听见岩浆和回声。', description: '资源来自真正的探索与劳动。每一箱材料，都能成为下一座建筑的起点。', tags: ['洞穴探索', '资源交换', '原版掉落'], icon: Gem },
  { id: 'survive', label: '生存', code: 'A04', kicker: 'SURVIVE', title: '从一张工作台开始，过自己的日子。', description: '种田、养蜂、收集唱片，或只是看一场方块世界里的日落。目标由你自己定义。', tags: ['自由节奏', '生活向', '无强制任务'], icon: Sprout },
  { id: 'together', label: '共建', code: 'A05', kicker: 'TOGETHER', title: '一个人的灵感，变成所有人的风景。', description: '参与道路、聚落与公共设施建设，让世界因每一位居民而逐渐完整。', tags: ['玩家自治', '公共项目', '社区协作'], icon: Mountain },
]

const joinSteps: JoinStep[] = [
  { title: '提交申请', description: '填写游戏 ID，按当前配置完成邮箱验证与问卷。', time: '约 5 分钟', icon: Send },
  { title: '等待审核', description: '管理员阅读申请并通过站内状态或邮件反馈结果。', time: '人工处理', icon: MailCheck },
  { title: '进入服务器', description: '白名单通过后，复制地址，从公共出生点开始生存。', time: 'JAVA 26.2', icon: ShieldCheck },
]

const { currentIndex, progress, manuallyPaused, goTo, next, previous, toggleAutoplay, setInteractionPaused } = useLandingCarousel(adventures.length)
const currentAdventure = computed(() => adventures[currentIndex.value])
const serverAddress = computed(() => config.value.webServerPrefix || 'play.goldencarrot.cn')
const copyLabel = computed(() => copyState.value === 'success' ? '地址已复制' : copyState.value === 'error' ? '复制失败，请手动复制' : serverAddress.value)
const copyFeedback = computed(() => copyState.value === 'success' ? `已复制 ${serverAddress.value}` : copyState.value === 'error' ? '浏览器未授权剪贴板访问' : '')
const statusLabel = computed(() => statusLoading.value ? '正在获取' : serverStatus.value?.online ? '稳定在线' : '暂时无法连接')
const statusShortLabel = computed(() => statusLoading.value ? 'CHECKING' : serverStatus.value?.online ? 'ONLINE' : 'UNAVAILABLE')
const statusClass = computed(() => statusLoading.value ? 'is-loading' : serverStatus.value?.online ? 'is-online' : 'is-unavailable')
const playersLabel = computed(() => serverStatus.value?.online && serverStatus.value.players ? `${serverStatus.value.players.online} / ${serverStatus.value.players.max}` : '暂不可用')

const handleCopyAddress = async () => {
  copyState.value = await copyServerAddress(serverAddress.value) ? 'success' : 'error'
  window.setTimeout(() => { copyState.value = 'idle' }, 2200)
}
const openWhitelist = () => {
  mobileMenuOpen.value = false
  whitelistDialog.value?.showModal()
  document.body.style.overflow = 'hidden'
}
const closeWhitelist = () => whitelistDialog.value?.close()
const handleDialogClose = () => { document.body.style.overflow = '' }
const handleCarouselFocusOut = (event: FocusEvent) => {
  const section = event.currentTarget as HTMLElement
  if (!section.contains(event.relatedTarget as Node | null)) setInteractionPaused(false)
}

onMounted(async () => {
  try {
    const response = await apiService.getServerStatus()
    if (response.success && response.data) serverStatus.value = response.data
  } catch {
    serverStatus.value = null
  } finally {
    statusLoading.value = false
  }
})
</script>

<style scoped>
:global(body:has(.landing-page)) { background: #050505; background-image: none; }
.landing-page {
  --ink: #050505;
  --surface: #090a09;
  --surface-2: #0d0f0d;
  --line: #292c29;
  --line-soft: #1b1e1b;
  --text: #f4f5ef;
  --muted: #a0a59e;
  --dim: #686d67;
  --lime: #d7ff3f;
  --moss: #70862c;
  --orange: #ff9d32;
  min-height: 100vh;
  overflow: clip;
  color: var(--text);
  background: var(--ink);
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  letter-spacing: 0;
}
.landing-page *, .landing-page *::before, .landing-page *::after { box-sizing: border-box; }
.section-shell { width: min(100%, 1700px); margin-inline: auto; padding-inline: clamp(22px, 4vw, 72px); }
.site-header { position: sticky; top: 0; z-index: 40; border-bottom: 1px solid #232623; background: rgba(5, 5, 5, .96); }
.header-inner { width: min(100%, 1700px); height: 72px; margin: auto; padding-inline: clamp(22px, 4vw, 72px); display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 28px; }
.brand { display: inline-flex; align-items: center; gap: 10px; width: fit-content; color: var(--text); text-decoration: none; }
.brand-mark { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid #3d423d; border-radius: 2px; color: var(--orange); background: #0b0d0b; }
.brand-name { font: 800 15px ui-monospace, SFMono-Regular, Menlo, monospace; }
.brand-edition { padding-left: 10px; border-left: 1px solid var(--line); color: var(--dim); font: 700 9px ui-monospace, monospace; }
.desktop-nav { display: flex; gap: 34px; }
.desktop-nav a, .login-link { color: var(--muted); text-decoration: none; font-size: 13px; transition: color .2s ease; }
.desktop-nav a:hover, .desktop-nav a:focus-visible, .login-link:hover, .login-link:focus-visible { color: var(--text); }
.header-actions { justify-self: end; display: flex; align-items: center; gap: 18px; }
.login-link { display: inline-flex; align-items: center; gap: 7px; }
.apply-button, .copy-button { min-height: 48px; padding: 0 20px; display: inline-flex; align-items: center; justify-content: center; gap: 9px; border-radius: 2px; font: 750 13px ui-monospace, SFMono-Regular, Menlo, monospace; cursor: pointer; transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease; }
.apply-button { border: 1px solid var(--lime); color: #050505; background: var(--lime); }
.apply-button:hover { background: #edff9a; border-color: #edff9a; transform: translateY(-1px); }
.apply-button.compact { min-height: 40px; padding: 0 15px; font-size: 12px; }
.copy-button { max-width: 290px; border: 1px solid #3a3e3a; color: var(--text); background: #080908; font-family: ui-monospace, monospace; overflow: hidden; }
.copy-button span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.copy-button:hover { color: var(--lime); border-color: #66742e; background: #0c0e0b; }
.menu-button { display: none; width: 42px; height: 42px; place-items: center; border: 1px solid var(--line); border-radius: 4px; color: var(--text); background: transparent; }
.mobile-nav { padding: 12px 22px 18px; display: none; border-top: 1px solid var(--line-soft); background: #060706; }
.mobile-nav a, .mobile-nav button { min-height: 46px; display: flex; align-items: center; color: var(--text); border: 0; border-bottom: 1px solid var(--line-soft); background: none; text-decoration: none; font: 650 14px inherit; }
.hero-section { position: relative; min-height: 690px; padding-top: clamp(48px, 6vh, 76px); padding-bottom: 58px; display: grid; grid-template-columns: minmax(0, .93fr) minmax(520px, 1.07fr); align-items: center; gap: clamp(50px, 6vw, 110px); }
.hero-copy { position: relative; z-index: 2; }
.eyebrow { margin: 0; color: var(--lime); font: 750 11px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .08em; }
.hero-copy > .eyebrow { display: flex; align-items: center; gap: 10px; }
.hero-copy > .eyebrow span { width: 18px; height: 1px; background: var(--lime); }
h1 { max-width: 720px; margin: 22px 0 24px; font-family: ui-monospace, SFMono-Regular, Menlo, "Microsoft YaHei", monospace; font-size: clamp(48px, 5vw, 76px); line-height: 1.07; font-weight: 800; letter-spacing: 0; }
h1 span { display: block; margin-bottom: 12px; color: var(--orange); font: 800 15px ui-monospace, monospace; text-transform: uppercase; letter-spacing: .08em; }
.hero-description { max-width: 600px; margin: 0; color: var(--muted); font-size: 16px; line-height: 1.85; }
.hero-actions { margin-top: 32px; display: flex; flex-wrap: wrap; gap: 10px; }
.copy-feedback { height: 18px; margin: 8px 0 0; color: var(--dim); font-size: 11px; }
.server-facts { margin: 30px 0 0; display: grid; grid-template-columns: 1.2fr 1fr; border: 1px solid var(--line); background: #070807; }
.server-facts div { min-width: 0; padding: 14px 16px; }
.server-facts div + div { padding-left: 16px; border-left: 1px solid var(--line); }
.server-facts div:nth-child(3) { padding-left: 0; border-top: 1px solid var(--line); border-left: 0; }
.server-facts div:nth-child(4) { border-top: 1px solid var(--line); }
.server-facts dt { margin-bottom: 7px; color: var(--dim); font-size: 10px; }
.server-facts dd { margin: 0; overflow: hidden; color: #e8eadf; font: 700 12px ui-monospace, monospace; text-overflow: ellipsis; white-space: nowrap; }
.status-dot { width: 7px; height: 7px; display: inline-block; margin-right: 7px; background: #8b927e; }
.is-online { color: var(--lime) !important; }.is-online .status-dot { background: var(--lime); box-shadow: 0 0 0 4px rgba(201, 223, 103, .11); }
.is-unavailable { color: #c9b87d !important; }.is-unavailable .status-dot { background: #c9b87d; }
.world-visual { height: clamp(450px, 58vh, 620px); position: relative; overflow: hidden; border: 1px solid #343834; border-radius: 2px; background: #070907; isolation: isolate; box-shadow: inset 0 0 0 1px #0d100d; }
.visual-grid, .art-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(177, 190, 172, .1) 1px, transparent 1px), linear-gradient(90deg, rgba(177, 190, 172, .1) 1px, transparent 1px); background-size: 34px 34px; }
.visual-grid::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 45%, #060706 96%); }
.visual-sun { position: absolute; top: 70px; right: 14%; width: 104px; height: 104px; border: 1px solid var(--lime); background: #11150a; box-shadow: inset 0 0 0 12px #0b0e08; }
.contour { position: absolute; border: 1px solid rgba(194, 213, 150, .25); border-radius: 50%; transform: rotate(-14deg); }
.contour-a { width: 330px; height: 160px; top: 55px; left: -100px; }.contour-b { width: 440px; height: 210px; right: -170px; bottom: 110px; }
.terrain { position: absolute; bottom: 0; clip-path: polygon(0 100%, 0 65%, 8% 65%, 8% 53%, 17% 53%, 17% 41%, 27% 41%, 27% 28%, 38% 28%, 38% 43%, 49% 43%, 49% 19%, 60% 19%, 60% 36%, 73% 36%, 73% 49%, 85% 49%, 85% 62%, 100% 62%, 100% 100%); }
.terrain-back { inset-inline: -4%; height: 58%; background: #171b17; opacity: .72; transform: translateY(-70px) scale(.96); }
.terrain-mid { inset-inline: -6%; height: 55%; background: #111511; transform: translateX(-8%); }
.terrain-front { inset-inline: -8%; height: 42%; background: #090c09; transform: translateX(10%); box-shadow: inset 0 2px #4f5b35; }
.watchtower { position: absolute; left: 52%; bottom: 30%; width: 70px; height: 170px; border: 1px solid #72532f; background: #17120c; box-shadow: inset -12px 0 #0e0b08; }
.watchtower span { position: absolute; width: 118px; height: 52px; left: -24px; top: -24px; border: 1px solid #9b703c; background: #20160d; box-shadow: inset 0 2px #ff9d32; }
.watchtower i, .watchtower b { position: absolute; top: -46px; width: 18px; height: 28px; border: 1px solid #846231; background: #161108; }.watchtower i { left: -15px; }.watchtower b { right: -15px; }
.map-pin { position: absolute; z-index: 2; left: calc(52% + 80px); bottom: 49%; display: grid; grid-template-columns: auto auto; align-items: center; gap: 1px 8px; color: var(--lime); }
.map-pin svg { grid-row: 1 / 3; }.map-pin span { color: var(--text); font-size: 12px; font-weight: 700; }.map-pin small { color: #89977b; font: 9px ui-monospace, monospace; }
.visual-coordinate { position: absolute; z-index: 3; left: 18px; right: 18px; display: flex; justify-content: space-between; color: #91a181; font: 9px ui-monospace, monospace; }.visual-coordinate.top { top: 18px; }.visual-coordinate.bottom { bottom: 18px; }
.visual-status { position: absolute; z-index: 4; right: 18px; bottom: 45px; min-width: 150px; padding: 12px; display: flex; align-items: center; border: 1px solid #3a4038; background: rgba(5, 6, 5, .92); }
.visual-status small, .visual-status strong { display: block; }.visual-status small { color: #7f8c73; font: 8px ui-monospace, monospace; }.visual-status strong { margin-top: 4px; font: 800 11px ui-monospace, monospace; }
.scroll-cue { position: absolute; left: clamp(22px, 4vw, 72px); bottom: 26px; display: inline-flex; align-items: center; gap: 8px; color: var(--dim); font-size: 11px; text-decoration: none; }
.features-band, .join-band { border-top: 1px solid var(--line-soft); background: #070807; }
.section-content { padding-top: 78px; padding-bottom: 112px; }
.split-heading { display: grid; grid-template-columns: 1fr 440px; gap: 60px; align-items: end; }
.section-heading h2, .join-intro h2 { margin: 12px 0 0; font-size: 40px; line-height: 1.2; letter-spacing: 0; }
.split-heading > p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.8; }
.feature-grid { margin-top: 52px; display: grid; grid-template-columns: repeat(12, 1fr); border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
.feature-grid article { min-height: 260px; padding: 28px; position: relative; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); background: #090a09; }
.feature-grid article:nth-child(1), .feature-grid article:nth-child(2) { grid-column: span 6; min-height: 290px; }.feature-grid article:nth-child(n+3) { grid-column: span 4; }
.feature-grid article:nth-child(2), .feature-grid article:nth-child(4) { background: #0c0d0c; }.feature-grid article:nth-child(5) { background: #0d0b08; }
.feature-top { display: flex; justify-content: space-between; color: var(--lime); }.feature-top span { color: #65705e; font: 10px ui-monospace, monospace; }
.feature-grid h3 { margin: 58px 0 12px; font-size: 22px; }.feature-grid p { max-width: 440px; margin: 0; color: var(--muted); font-size: 14px; line-height: 1.75; }.feature-grid small { position: absolute; left: 28px; bottom: 25px; color: #788272; font: 10px ui-monospace, monospace; }
.adventure-band { background: #050505; outline: none; scroll-margin-top: 72px; }
.adventure-band:focus-visible { box-shadow: inset 0 0 0 2px var(--lime); }
.carousel-header { display: flex; align-items: end; justify-content: space-between; gap: 30px; }
.carousel-controls { display: flex; align-items: center; gap: 7px; }.carousel-controls > span { margin-right: 8px; color: var(--lime); font: 750 11px ui-monospace, monospace; }
.carousel-controls button { width: 42px; height: 42px; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 2px; color: var(--muted); background: #090a09; cursor: pointer; }
.carousel-controls button:hover, .carousel-controls button:focus-visible { color: var(--lime); border-color: var(--moss); outline: 2px solid rgba(201, 223, 103, .25); outline-offset: 2px; }
.progress-track { height: 2px; margin-top: 30px; overflow: hidden; background: #273026; }.progress-track span { width: 100%; height: 100%; display: block; transform-origin: left; background: var(--lime); transition: transform .1s linear; }
.carousel-layout { margin-top: 14px; display: grid; grid-template-columns: minmax(260px, .42fr) minmax(0, 1.58fr); gap: 14px; }
.adventure-tabs { display: flex; flex-direction: column; gap: 7px; }
.adventure-tabs button { min-height: 69px; padding: 0 17px; display: grid; grid-template-columns: 30px 26px 1fr auto; align-items: center; gap: 9px; color: #8f958e; border: 1px solid var(--line-soft); border-radius: 2px; background: #080908; cursor: pointer; text-align: left; transition: transform .2s ease, border-color .2s ease, background .2s ease, color .2s ease; }
.adventure-tabs button > span { font: 10px ui-monospace, monospace; }.adventure-tabs button strong { font-size: 13px; }
.adventure-tabs button:hover, .adventure-tabs button:focus-visible, .adventure-tabs button.active { color: var(--text); border-color: #697a32; background: #0d100b; transform: translateX(3px); outline: none; }.adventure-tabs button.active > span { color: var(--lime); }
.adventure-stage { min-height: 373px; overflow: hidden; border: 1px solid var(--line); border-radius: 2px; }
.adventure-stage article { min-height: 373px; display: grid; grid-template-columns: minmax(320px, 1.2fr) minmax(320px, .8fr); }
.stage-art { position: relative; min-height: 373px; display: grid; place-items: center; overflow: hidden; background: #090c09; }.stage-art > svg { position: relative; z-index: 2; width: 64px; height: 64px; color: var(--lime); }
.stage-art::before, .stage-art::after { content: ''; position: absolute; border: 1px solid #343a32; background: #0f120f; box-shadow: 34px 34px 0 #090b09, 68px 0 0 #151915, 102px 68px 0 #080a08; transform: rotate(45deg); }
.stage-art::before { width: 180px; height: 180px; left: -45px; bottom: -80px; }.stage-art::after { width: 100px; height: 100px; right: 25px; top: 28px; }
.adventure-explore .stage-art, .adventure-mine .stage-art, .adventure-survive .stage-art, .adventure-together .stage-art { background: #080908; }
.art-index { position: absolute; z-index: 3; left: 22px; bottom: 18px; color: rgba(235, 240, 214, .38); font: 800 56px ui-monospace, monospace; }
.stage-copy { padding: clamp(34px, 4vw, 62px); display: flex; flex-direction: column; justify-content: center; background: #0b0c0b; }
.stage-copy > p { margin: 0; color: var(--lime); font: 750 10px ui-monospace, monospace; }.stage-copy h3 { max-width: 480px; margin: 16px 0; font-size: 28px; line-height: 1.35; }.stage-copy > span { color: var(--muted); font-size: 14px; line-height: 1.8; }
.stage-copy ul { margin: 28px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px 18px; list-style: none; }.stage-copy li { color: #8e9985; font: 10px ui-monospace, monospace; }.stage-copy li::before { content: '+ '; color: var(--orange); }
.carousel-dots { margin-top: 20px; display: flex; justify-content: center; gap: 5px; }.carousel-dots button { width: 44px; height: 44px; padding: 0 7px; border: 0; background: transparent; cursor: pointer; }.carousel-dots span { height: 2px; display: block; background: #3b4438; transition: background .2s ease, transform .2s ease; }.carousel-dots button.active span { background: var(--lime); transform: scaleY(2); }
.slide-fade-enter-active, .slide-fade-leave-active { transition: opacity .22s ease, transform .22s ease; }.slide-fade-enter-from { opacity: 0; transform: translateX(18px); }.slide-fade-leave-to { opacity: 0; transform: translateX(-18px); }
.join-band { background: #080908; }.join-layout { padding-top: 112px; padding-bottom: 112px; display: grid; grid-template-columns: .8fr 1.2fr; gap: clamp(70px, 9vw, 150px); }
.join-intro > p:not(.eyebrow) { max-width: 520px; margin: 22px 0 30px; color: var(--muted); font-size: 14px; line-height: 1.8; }
.join-steps { margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--line); }
.join-steps li { min-height: 140px; padding: 24px 0; display: grid; grid-template-columns: 45px 1fr auto; gap: 20px; align-items: start; border-bottom: 1px solid var(--line); }.join-steps > li > span { color: var(--lime); font: 10px ui-monospace, monospace; }.join-steps svg { color: var(--orange); }.join-steps h3 { margin: 10px 0 7px; font-size: 17px; }.join-steps p { margin: 0; color: var(--muted); font-size: 13px; line-height: 1.65; }.join-steps small { color: #737d6d; font: 9px ui-monospace, monospace; }
.site-footer { border-top: 0; background: transparent; }
.whitelist-dialog { width: min(900px, calc(100% - 32px)); max-height: min(900px, calc(100dvh - 32px)); padding: 0; overflow: hidden; border: 1px solid #4c5a43; border-radius: 6px; color: var(--text); background: #111711; box-shadow: 0 28px 90px rgba(0, 0, 0, .62); }.whitelist-dialog::backdrop { background: rgba(4, 7, 4, .82); }.dialog-shell { max-height: min(900px, calc(100dvh - 32px)); display: flex; flex-direction: column; }.dialog-header { padding: 22px 24px; display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; border-bottom: 1px solid var(--line); background: #151d14; }.dialog-header h2 { margin: 7px 0 5px; font-size: 22px; }.dialog-header > div > span { color: var(--muted); font-size: 12px; }.dialog-header > button { width: 42px; height: 42px; flex: 0 0 auto; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 3px; color: var(--muted); background: transparent; cursor: pointer; }.dialog-header > button:hover { color: var(--text); border-color: var(--moss); }.dialog-body { padding: 28px 24px 36px; overflow-y: auto; }
:deep(.dialog-body .glass-panel), :deep(.dialog-body .glass-card), :deep(.dialog-body .glass-input) { backdrop-filter: none; -webkit-backdrop-filter: none; }
:deep(.dialog-body .glass-card) { border-radius: 2px; background: #0b0d0b; border-color: #303430; box-shadow: none; }
:deep(.dialog-body .glass-input) { min-height: 44px; border-radius: 2px; border-color: #343834; background: #070807; box-shadow: none; }
:deep(.dialog-body .glass-input:focus) { border-color: var(--lime); box-shadow: 0 0 0 3px rgba(201, 223, 103, .12); }
:deep(.dialog-body .glass-button), :deep(.dialog-body .glass-button-primary) { min-height: 44px; border-radius: 2px; border-color: #3c4238; background: #0d0f0d; box-shadow: none; transform: none; }
:deep(.dialog-body .glass-button-primary) { color: #12170d; border-color: var(--lime); background: var(--lime); }
:deep(.dialog-body .text-blue-200), :deep(.dialog-body .text-blue-400) { color: var(--lime); }
.whitelist-dialog { border-color: #3e433e; border-radius: 2px; background: #080908; }
.whitelist-dialog::backdrop { background: rgba(0, 0, 0, .9); }
.dialog-header { background: #0b0d0b; }

button:focus-visible, a:focus-visible { outline: 2px solid var(--lime); outline-offset: 3px; }
@media (max-width: 1120px) {
  .desktop-nav { display: none; }.header-inner { grid-template-columns: 1fr auto; }.menu-button { display: grid; }.mobile-nav { display: grid; grid-template-columns: repeat(2, 1fr); column-gap: 24px; }
  .hero-section { min-height: auto; grid-template-columns: 1fr 1fr; gap: 38px; }
  .world-visual { height: 520px; }
}
@media (max-width: 820px) {
  .header-inner { height: 64px; }.login-link, .header-actions .compact { display: none; }.brand-edition { display: none; }
  .hero-section { padding-top: 52px; padding-bottom: 58px; grid-template-columns: 1fr; }.hero-copy { max-width: 690px; }.world-visual { height: 390px; }.scroll-cue { display: none; }
  h1 { font-size: 52px; }.split-heading, .join-layout { grid-template-columns: 1fr; }.split-heading { gap: 20px; }.feature-grid article:nth-child(n) { grid-column: span 6; }.feature-grid article:last-child { grid-column: span 12; }
  .carousel-layout { grid-template-columns: 1fr; }.adventure-tabs { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; }.adventure-tabs button { min-width: 0; min-height: 58px; padding: 0; display: flex; justify-content: center; }.adventure-tabs button span, .adventure-tabs button strong, .adventure-tabs button > svg:last-child { display: none; }.adventure-tabs button:hover, .adventure-tabs button.active { transform: none; }
  .adventure-stage article { grid-template-columns: 1fr; }.stage-art { min-height: 240px; }.stage-copy { min-height: 280px; }.join-layout { gap: 54px; }
}
@media (max-width: 560px) {
  .section-shell { padding-inline: 18px; }.mobile-nav { grid-template-columns: 1fr; }.hero-section { padding-top: 30px; padding-bottom: 38px; gap: 22px; }.hero-copy > .eyebrow { font-size: 10px; } h1 { margin-top: 16px; margin-bottom: 18px; font-size: 38px; }.hero-description { font-size: 13px; line-height: 1.65; }
  .hero-actions { margin-top: 22px; display: grid; grid-template-columns: 1fr 1fr; }.apply-button, .copy-button { width: 100%; max-width: none; min-height: 44px; padding-inline: 12px; font-size: 12px; }.server-facts { margin-top: 18px; }.server-facts div { padding: 10px 8px 10px 0; }.server-facts div + div { padding-left: 8px; }.server-facts dt { margin-bottom: 4px; }.server-facts dd { font-size: 9px; }
  .world-visual { height: 190px; }.visual-sun { width: 48px; height: 48px; top: 44px; }.terrain-back { transform: translateY(-10px) scale(.96); }.watchtower { transform: scale(.52); transform-origin: bottom; }.map-pin, .visual-status { display: none; }.visual-coordinate { left: 12px; right: 12px; }
  .section-content, .join-layout { padding-top: 76px; padding-bottom: 80px; }.section-heading h2, .join-intro h2 { font-size: 32px; }.feature-grid { margin-top: 34px; }.feature-grid article:nth-child(n) { grid-column: span 12; min-height: 225px; padding: 22px; }.feature-grid h3 { margin-top: 42px; }.feature-grid small { left: 22px; bottom: 20px; }
  .carousel-header { align-items: flex-start; flex-direction: column; }.carousel-controls { width: 100%; }.carousel-controls > span { margin-right: auto; }.carousel-controls button { width: 44px; height: 44px; }.adventure-stage, .adventure-stage article { min-height: 500px; }.stage-art { min-height: 210px; }.stage-copy { min-height: 290px; padding: 28px 24px; }.stage-copy h3 { font-size: 23px; }.stage-copy ul { margin-top: 20px; }.carousel-dots { margin-top: 12px; }
  .join-steps li { grid-template-columns: 34px 1fr; }.join-steps small { grid-column: 2; }
  .whitelist-dialog { width: 100%; max-width: 100%; max-height: 100dvh; height: 100dvh; margin: 0; border: 0; border-radius: 0; }.dialog-shell { max-height: 100dvh; height: 100%; }.dialog-header { padding: 18px; }.dialog-header h2 { font-size: 19px; }.dialog-header > div > span { display: none; }.dialog-body { padding: 22px 16px 32px; }
}
@media (prefers-reduced-motion: reduce) {
  .landing-page *, .landing-page *::before, .landing-page *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; }
}
</style>
