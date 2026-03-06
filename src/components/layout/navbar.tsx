import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { HomeIcon, BackIcon, LogOutIcon } from '../icons';
import { Button } from '../ui';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isHome = location.pathname === '/';

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path.startsWith('/formazione')) {
      if (path === '/formazione') return 'Formazione AI';
      if (path.includes('certificazioni')) return 'Formazione AI › Certificazioni';
      if (path.includes('workshop')) return 'Formazione AI › Workshop';
      if (path.includes('practical')) return 'Formazione AI › Practical AI';
      if (path.includes('news')) return 'Formazione AI › News';
      if (path.includes('gamification')) return 'Formazione AI › Gamification';
    }
    if (path.startsWith('/rd')) {
      if (path === '/rd') return 'R&D';
      if (path.includes('kanban')) return 'R&D › Kanban';
      if (path.includes('tabella')) return 'R&D › Tabella Idee';
    }
    if (path === '/offering') return 'AI Offering';
    return '';
  };

  const handleBack = () => {
    const path = location.pathname;
    if (path.startsWith('/formazione/')) navigate('/formazione');
    else if (path.startsWith('/rd/')) navigate('/rd');
    else navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-primary-500/15 bg-dark-bg/85 backdrop-blur-xl px-6 py-3">
      <div className="flex items-center gap-4">
        {!isHome && (
          <Button variant="secondary" size="sm" onClick={handleBack}>
            <BackIcon size={16} /> Back
          </Button>
        )}

        <Link
          to="/"
          className="text-primary-500 hover:text-primary-400 transition-colors"
        >
          <HomeIcon />
        </Link>

        <div className="font-mono text-sm font-bold tracking-widest text-primary-500">
          ARAD AI HUB
        </div>

        <div className="flex-1" />

        <div className="text-xs text-slate-500">{getBreadcrumb()}</div>

        {user && (
          <div className="flex items-center gap-3 ml-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-300 text-xs font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
            )}
            <button
              onClick={logout}
              className="text-slate-500 hover:text-slate-300 transition-colors"
              title="Sign out"
            >
              <LogOutIcon size={18} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
