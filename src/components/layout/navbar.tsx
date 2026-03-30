import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { BackIcon, LogOutIcon } from '../icons';
import { Button } from '../ui';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isHome = location.pathname === '/';

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return '';
    if (path.startsWith('/formazione')) {
      if (path === '/formazione') return 'Formazione AI';
      if (path.includes('certificazioni')) return 'Formazione AI › Certificazioni';
      if (path.includes('workshop')) return 'Formazione AI › Workshop';
      if (path.includes('practical')) return 'Formazione AI › Practical AI';
      if (path.includes('materiali')) return 'Formazione AI › Materiali Utili';
      if (path.includes('news')) return 'Formazione AI › News';
      if (path.includes('gamification')) return 'Formazione AI › Gamification';
    }
    if (path.startsWith('/rd')) {
      if (path === '/rd') return 'R&D';
      if (path.includes('kanban')) return 'R&D › Kanban';
      if (path.includes('tabella')) return 'R&D › Tabella Idee';
    }
    if (path === '/offering') return 'AI Offering';
    if (path === '/proposte') return 'Tutte le proposte';
    return '';
  };

  const handleBack = () => {
    const path = location.pathname;
    if (path.startsWith('/formazione/')) navigate('/formazione');
    else if (path.startsWith('/rd/')) navigate('/rd');
    else navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
        {!isHome && (
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <BackIcon size={16} /> Back
          </Button>
        )}

        <Link to="/">
          <img
            src="https://images.squarespace-cdn.com/content/v1/61c4fffab8833a68db0827cd/c837e6e7-fb71-4d9d-b5a3-32e7d6ab09de/01+Arad_logo-up+footer.png"
            alt="ARAD Digital"
            className="h-7 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </Link>

        <div className="flex-1" />

        <div className="text-xs text-brand-muted tracking-wider uppercase">{getBreadcrumb()}</div>

        {isHome && (
          <>
            <Button variant="primary" size="sm" onClick={() => window.dispatchEvent(new CustomEvent('open-proponi'))}>
              Proponi
            </Button>
          </>
        )}

        {user && (
          <div className="flex items-center gap-3 ml-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-8 h-8 rounded-full border border-gray-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold text-xs font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
            )}
            <button
              onClick={logout}
              className="text-brand-muted hover:text-brand-title transition-colors"
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
