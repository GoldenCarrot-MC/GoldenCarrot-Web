<template>
  <footer class="app-footer">
    <div class="footer-shell">
      <div class="footer-grid">
        <div class="footer-intro">
          <RouterLink class="footer-brand" to="/" aria-label="返回 Golden Carrot 首页">
            <span class="footer-brand-mark"><Carrot :size="18" /></span>
            <span>Golden Carrot</span>
          </RouterLink>
          <p>把日子，种进同一个长期生长的生存世界。</p>
          <div class="footer-socials" aria-label="社区链接">
            <a href="https://github.com/KiteMC/VerifyMC" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
              <Github :size="17" />
            </a>
            <a href="/#community" aria-label="社区讨论" title="社区讨论">
              <MessageCircle :size="17" />
            </a>
            <a href="/#community" aria-label="视频频道" title="视频频道">
              <Youtube :size="17" />
            </a>
            <a href="/#community" aria-label="社交主页" title="社交主页">
              <AtSign :size="17" />
            </a>
          </div>
        </div>

        <nav class="footer-links" aria-label="服务器导航">
          <div>
            <h2>探索世界</h2>
            <RouterLink to="/#features">服务器特色</RouterLink>
            <RouterLink to="/#world">游戏世界</RouterLink>
            <RouterLink to="/#join">加入方式</RouterLink>
          </div>
          <div>
            <h2>社区资源</h2>
            <RouterLink to="/#community">社区动态</RouterLink>
            <RouterLink to="/register">申请白名单</RouterLink>
            <RouterLink to="/login">管理入口</RouterLink>
          </div>
          <div>
            <h2>关于我们</h2>
            <RouterLink to="/#top">关于 Golden Carrot</RouterLink>
            <RouterLink to="/status">服务器状态</RouterLink>
            <RouterLink to="/#community">联系我们</RouterLink>
          </div>
        </nav>
      </div>

      <div class="footer-wordmark" aria-hidden="true">GOLDEN CARROT</div>

      <div class="footer-bottom">
        <p>© {{ currentYear }} Golden Carrot · Minecraft Java 生存服务器</p>
        <nav aria-label="法律信息">
          <a href="/#community">安全与规则</a>
          <a href="/#community">服务条款</a>
          <a href="/#community">隐私说明</a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { AtSign, Carrot, Github, MessageCircle, Youtube } from 'lucide-vue-next'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  --footer-surface: #090c09;
  --footer-line: #292e28;
  --footer-muted: #9ea69a;
  --footer-dim: #697269;
  --footer-accent: #d7ff3f;
  color: #f4f5ef;
  background: var(--footer-surface);
  border-top: 1px solid var(--footer-line);
}

.footer-shell {
  width: min(100%, 1700px);
  margin: 0 auto;
  padding: 64px clamp(22px, 4vw, 72px) 20px;
}

.footer-grid {
  display: grid;
  grid-template-columns: minmax(240px, 0.9fr) minmax(0, 1.6fr);
  gap: clamp(48px, 9vw, 150px);
}

.footer-intro {
  max-width: 280px;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #f4f5ef;
  font: 800 16px ui-monospace, SFMono-Regular, Menlo, monospace;
  text-decoration: none;
}

.footer-brand-mark {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  color: #ff9d32;
  border: 1px solid #3d453c;
  border-radius: 2px;
  background: #0b0e0b;
}

.footer-intro p {
  margin: 20px 0 24px;
  color: var(--footer-muted);
  font-size: 14px;
  line-height: 1.75;
}

.footer-socials {
  display: flex;
  gap: 8px;
}

.footer-socials a {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  color: var(--footer-muted);
  border: 1px solid #3a4139;
  border-radius: 3px;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.footer-socials a:hover,
.footer-socials a:focus-visible {
  color: var(--footer-accent);
  border-color: #70862c;
  background: #10150d;
  outline: none;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}

.footer-links > div {
  padding-top: 17px;
  border-top: 1px solid var(--footer-line);
}

.footer-links h2 {
  margin: 0 0 14px;
  color: #f4f5ef;
  font-size: 17px;
}

.footer-links a,
.footer-bottom a {
  display: block;
  width: fit-content;
  margin-top: 9px;
  color: var(--footer-muted);
  font-size: 13px;
  line-height: 1.45;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover,
.footer-links a:focus-visible,
.footer-bottom a:hover,
.footer-bottom a:focus-visible {
  color: var(--footer-accent);
  outline: none;
}

.footer-wordmark {
  margin-top: 62px;
  overflow: hidden;
  color: transparent;
  font: 900 clamp(60px, 13.5vw, 210px)/0.72 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.04em;
  white-space: nowrap;
  -webkit-text-stroke: 1px rgba(215, 255, 63, 0.3);
  user-select: none;
}

.footer-bottom {
  min-height: 54px;
  margin-top: 18px;
  padding-top: 18px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 22px;
  border-top: 1px solid var(--footer-line);
}

.footer-bottom p {
  margin: 0;
  color: var(--footer-dim);
  font: 11px ui-monospace, SFMono-Regular, Menlo, monospace;
}

.footer-bottom nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 20px;
}

.footer-bottom a {
  margin-top: 0;
  font-size: 11px;
}

@media (max-width: 760px) {
  .footer-shell {
    padding-top: 48px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 42px;
  }

  .footer-intro {
    max-width: 360px;
  }

  .footer-links {
    gap: 18px;
  }

  .footer-wordmark {
    margin-top: 48px;
    font-size: clamp(48px, 15vw, 110px);
  }

  .footer-bottom {
    flex-direction: column;
    gap: 12px;
  }

  .footer-bottom nav {
    justify-content: flex-start;
    gap: 14px;
  }
}

@media (max-width: 480px) {
  .footer-links {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-wordmark {
    font-size: 18vw;
  }
}
</style>
