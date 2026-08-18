<template>
  <main class="register-page">
    <header class="register-header">
      <RouterLink class="brand" to="/">
        <span class="brand-mark"><Carrot :size="18" /></span>
        <span>Golden Carrot</span>
      </RouterLink>
      <RouterLink class="back-link" to="/"><ArrowLeft :size="16" />返回官网</RouterLink>
    </header>

    <div class="register-layout">
      <section class="register-intro">
        <p>WHITELIST / APPLICATION</p>
        <h1>申请加入<br />Golden Carrot</h1>
        <span>我们想认识认真对待长期生存的玩家，也让你确认这里是否适合自己。</span>
        <ol>
          <li><ShieldCheck :size="19" /><div><strong>按配置验证</strong><small>邮箱、验证码与问卷会按服务器设置出现</small></div></li>
          <li><FileText :size="19" /><div><strong>人工阅读</strong><small>每一份申请都会被认真对待</small></div></li>
          <li><Sprout :size="19" /><div><strong>从零开始</strong><small>没有商城与数值捷径，只有纯生存</small></div></li>
        </ol>
      </section>
      <section class="register-form-panel" aria-label="白名单申请表单">
        <RegistrationForm />
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ArrowLeft, Carrot, FileText, ShieldCheck, Sprout } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import RegistrationForm from '@/components/RegistrationForm.vue'
</script>

<style scoped>
:global(body:has(.register-page)) { background: #050505; background-image: none; }
.register-page { min-height: 100vh; color: #f2f3e9; background: #050505; font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif; letter-spacing: 0; }
.register-page * { box-sizing: border-box; }
.register-header { width: min(100%, 1700px); height: 72px; margin: auto; padding: 0 clamp(22px, 4vw, 72px); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #2b3328; }
.brand, .back-link { display: inline-flex; align-items: center; gap: 10px; color: #f2f3e9; text-decoration: none; font-size: 14px; font-weight: 750; }
.brand-mark { width: 34px; height: 34px; display: grid; place-items: center; color: #ff9d32; border: 1px solid #3d423d; border-radius: 2px; background: #0b0d0b; }
.back-link { min-height: 42px; color: #a7ad9d; font-size: 12px; }.back-link:hover { color: #c9df67; }
.register-layout { width: min(100%, 1440px); min-height: calc(100vh - 72px); margin: auto; padding: 72px clamp(22px, 5vw, 82px); display: grid; grid-template-columns: .72fr 1.28fr; gap: clamp(60px, 10vw, 150px); align-items: start; }
.register-intro { position: sticky; top: 130px; }.register-intro > p { margin: 0; color: #c9df67; font: 750 10px ui-monospace, monospace; letter-spacing: .08em; }.register-intro h1 { margin: 20px 0 20px; font-size: 48px; line-height: 1.12; letter-spacing: 0; }.register-intro > span { max-width: 430px; display: block; color: #a7ad9d; font-size: 14px; line-height: 1.8; }
.register-intro ol { margin: 44px 0 0; padding: 0; list-style: none; border-top: 1px solid #313b2e; }.register-intro li { padding: 18px 0; display: flex; gap: 13px; border-bottom: 1px solid #313b2e; }.register-intro li > svg { color: #ee9b38; }.register-intro strong, .register-intro small { display: block; }.register-intro strong { font-size: 13px; }.register-intro small { margin-top: 5px; color: #737c6e; font-size: 11px; line-height: 1.5; }
.register-form-panel { min-width: 0; padding: 36px; border: 1px solid #292c29; border-radius: 2px; background: #090a09; }
:deep(.register-form-panel .glass-card), :deep(.register-form-panel .glass-input) { backdrop-filter: none; -webkit-backdrop-filter: none; }
:deep(.register-form-panel .glass-card) { border-radius: 4px; box-shadow: none; }
@media (max-width: 860px) { .register-layout { grid-template-columns: 1fr; gap: 48px; padding-top: 48px; }.register-intro { position: static; }.register-intro ol { display: none; } }
@media (max-width: 560px) { .register-header { height: 64px; padding-inline: 18px; }.register-layout { min-height: calc(100vh - 64px); padding: 34px 16px 50px; }.register-intro h1 { font-size: 36px; }.register-form-panel { padding: 22px 14px; } }
</style>
