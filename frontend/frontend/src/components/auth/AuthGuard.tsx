import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-golden-500/30 border-t-golden-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the / login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    // Note: We might want to trigger the auth modal here depending on implementation
    return <Navigate to="/" state={{ from: location, requireAuth: true }} replace />;
  }

  return <Outlet />;
}
