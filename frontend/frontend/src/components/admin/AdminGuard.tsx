import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useStore } from '@/store/useStore';
import { AdminLayout } from './AdminLayout';

export function AdminGuard() {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const { setAuthModalOpen } = useStore();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    verify();
  }, [checkAuth]);

  useEffect(() => {
    if (!isChecking) {
      if (!isAuthenticated) {
        navigate('/');
        setAuthModalOpen(true);
      } else if (user?.role !== 'admin' && user?.role !== 'moderator') {
        navigate('/');
      }
    }
  }, [isChecking, isAuthenticated, user, navigate, setAuthModalOpen]);

  if (isChecking || !isAuthenticated || (user?.role !== 'admin' && user?.role !== 'moderator')) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-10 h-10 border-4 border-golden-500/30 border-t-golden-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
