import { Suspense, useEffect, lazy, useRef, useState, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { BackToTop } from '@/components/BackToTop';
import { Footer } from '@/components/Footer';
import { useAuthStore } from '@/store/useAuthStore';
import { NotFound } from '@/components/errors/NotFound';
import { Forbidden } from '@/components/errors/Forbidden';
import { ServerError } from '@/components/errors/ServerError';
import { ToastProvider } from '@/components/ui/Toast';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { useStore } from '@/store/useStore';

const AuthModal = lazy(() => import('@/components/auth/AuthModal').then(({ AuthModal }) => ({ default: AuthModal })));
const AdminGuard = lazy(() => import('@/components/admin/AdminGuard').then(({ AdminGuard }) => ({ default: AdminGuard })));
const Maintenance = lazy(() => import('@/components/errors/Maintenance').then(({ Maintenance }) => ({ default: Maintenance })));
const Dashboard = lazy(() => import('@/components/admin/Dashboard'));
const Users = lazy(() => import('@/components/admin/Users'));
const News = lazy(() => import('@/components/admin/News'));
const Timeline = lazy(() => import('@/components/admin/Timeline'));
const Team = lazy(() => import('@/components/admin/Team'));
const Logs = lazy(() => import('@/components/admin/Logs'));
const Settings = lazy(() => import('@/components/admin/Settings'));
const AdminVotes = lazy(() => import('@/components/admin/AdminVotes'));
const AdminEvents = lazy(() => import('@/components/admin/AdminEvents'));

const About = lazy(() => import('@/pages/About'));
const ProfileLayout = lazy(() => import('@/pages/ProfileLayout'));
const ProfileInfo = lazy(() => import('@/pages/ProfileInfo'));
const ProfileSecurity = lazy(() => import('@/pages/ProfileSecurity'));
const ProfileMessages = lazy(() => import('@/pages/ProfileMessages'));

const VoteList = lazy(() => import('@/pages/votes/VoteList'));
const VoteDetail = lazy(() => import('@/pages/votes/VoteDetail'));
const EventCalendar = lazy(() => import('@/pages/events/EventCalendar'));
const Whitelist = lazy(() => import('@/pages/Whitelist'));
const MarqueeSection = lazy(() => import('@/components/MarqueeSection').then(({ MarqueeSection }) => ({ default: MarqueeSection })));
const FeaturesSection = lazy(() => import('@/components/FeaturesSection').then(({ FeaturesSection }) => ({ default: FeaturesSection })));
const SciFiTransition = lazy(() => import('@/components/ui/SciFiTransition').then(({ SciFiTransition }) => ({ default: SciFiTransition })));
const NewsSection = lazy(() => import('@/components/NewsSection').then(({ NewsSection }) => ({ default: NewsSection })));

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [location]);

  return null;
}

function DeferredSection({ children, id }: { children: ReactNode; id?: string }) {
  const [visible, setVisible] = useState(false);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(marker);

    return () => observer.disconnect();
  }, []);

  return <div ref={markerRef} id={id}>{visible && children}</div>;
}

function Home() {
  return (
    <>
      <HeroSection />
      <DeferredSection><Suspense fallback={null}><MarqueeSection /></Suspense></DeferredSection>
      <DeferredSection id="features"><Suspense fallback={null}><FeaturesSection /></Suspense></DeferredSection>
      <DeferredSection><Suspense fallback={null}><SciFiTransition /></Suspense></DeferredSection>
    </>
  );
}

function PublicLayout() {
  const { isAuthModalOpen } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-200 dark:bg-black dark:text-slate-200 transition-colors">
      <Navigation />
      {isAuthModalOpen && <Suspense fallback={null}><AuthModal /></Suspense>}
      <BackToTop />
      
      <main className="flex-grow pt-24">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  const { checkAuth, user } = useAuthStore();
  const [maintenance, setMaintenance] = useState<{ active: boolean; message?: string; until?: string }>({ active: false });

  useEffect(() => {
    const init = async () => {
      const maintenanceCheck = axios.get('http://localhost:3001/api/maintenance/status', { timeout: 1500 }).then(({ data }) => {
        if (data.maintenanceMode) {
          setMaintenance({ active: true, message: data.maintenanceMessage, until: data.maintenanceUntil });
        }
      }).catch(() => undefined);

      await Promise.allSettled([maintenanceCheck, checkAuth()]);
    };
    void init();
  }, [checkAuth]);

  if (maintenance.active && user?.role !== 'admin' && user?.role !== 'moderator') {
    return <Maintenance message={maintenance.message} until={maintenance.until} />;
  }

  return (
    <>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToHash />
        <ToastProvider />
        <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={
          <Suspense fallback={<div className="h-screen bg-black" />}>
            <AdminGuard />
          </Suspense>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={
            <Suspense fallback={<div className="p-8 text-center text-golden-500 animate-pulse">Loading...</div>}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="users" element={
            <Suspense fallback={<div className="p-8 text-center text-golden-500 animate-pulse">Loading...</div>}>
              <Users />
            </Suspense>
          } />
          <Route path="news" element={
            <Suspense fallback={<div className="p-8 text-center text-golden-500 animate-pulse">Loading...</div>}>
              <News />
            </Suspense>
          } />
          <Route path="timeline" element={
            <Suspense fallback={<div className="p-8 text-center text-golden-500 animate-pulse">Loading...</div>}>
              <Timeline />
            </Suspense>
          } />
          <Route path="team" element={
            <Suspense fallback={<div className="p-8 text-center text-golden-500 animate-pulse">Loading...</div>}>
              <Team />
            </Suspense>
          } />
          <Route path="logs" element={
            <Suspense fallback={<div className="p-8 text-center text-golden-500 animate-pulse">Loading...</div>}>
              <Logs />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<div className="p-8 text-center text-golden-500 animate-pulse">Loading...</div>}>
              <Settings />
            </Suspense>
          } />
          <Route path="votes" element={
            <Suspense fallback={<div className="p-8 text-center text-golden-500 animate-pulse">Loading...</div>}>
              <AdminVotes />
            </Suspense>
          } />
          <Route path="events" element={
            <Suspense fallback={<div className="p-8 text-center text-golden-500 animate-pulse">Loading...</div>}>
              <AdminEvents />
            </Suspense>
          } />
        </Route>

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={
            <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-4 border-golden-500/30 border-t-golden-500 rounded-full animate-spin" /></div>}>
              <About />
            </Suspense>
          } />
          <Route path="/news" element={<NewsSection />} />
          
          {/* Votes & Events */}
          <Route path="/vote/bug" element={
            <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-4 border-golden-500/30 border-t-golden-500 rounded-full animate-spin" /></div>}>
              <VoteList />
            </Suspense>
          } />
          <Route path="/vote/trial" element={
            <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-4 border-golden-500/30 border-t-golden-500 rounded-full animate-spin" /></div>}>
              <VoteList />
            </Suspense>
          } />
          <Route path="/vote/post/:postId" element={
            <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-4 border-golden-500/30 border-t-golden-500 rounded-full animate-spin" /></div>}>
              <VoteDetail />
            </Suspense>
          } />
          <Route path="/events" element={
            <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-4 border-golden-500/30 border-t-golden-500 rounded-full animate-spin" /></div>}>
              <EventCalendar />
            </Suspense>
          } />
          <Route path="/whitelist" element={
            <Suspense fallback={<div className="min-h-screen bg-[#030506]" />}>
              <Whitelist />
            </Suspense>
          } />

          {/* Protected Profile Routes */}
          <Route element={<AuthGuard />}>
            <Route path="/profile" element={
              <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-4 border-golden-500/30 border-t-golden-500 rounded-full animate-spin" /></div>}>
                <ProfileLayout />
              </Suspense>
            }>
              <Route index element={<Navigate to="/profile/info" replace />} />
              <Route path="info" element={
                <Suspense fallback={<div className="p-8 text-center text-golden-500 animate-pulse">Loading...</div>}>
                  <ProfileInfo />
                </Suspense>
              } />
              <Route path="security" element={
                <Suspense fallback={<div className="p-8 text-center text-golden-500 animate-pulse">Loading...</div>}>
                  <ProfileSecurity />
                </Suspense>
              } />
              <Route path="messages" element={
                <Suspense fallback={<div className="p-8 text-center text-golden-500 animate-pulse">Loading...</div>}>
                  <ProfileMessages />
                </Suspense>
              } />
            </Route>
          </Route>

          <Route path="/403" element={<Forbidden />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="/503" element={<Maintenance />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
