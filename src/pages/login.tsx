import { useAuth } from '../context/auth-context';
import { Button } from '../components/ui';

export const LoginPage = () => {
  const { login, loading } = useAuth();

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="text-center">
        <img
          src="https://images.squarespace-cdn.com/content/v1/61c4fffab8833a68db0827cd/c837e6e7-fb71-4d9d-b5a3-32e7d6ab09de/01+Arad_logo-up+footer.png"
          alt="ARAD Digital"
          className="inline-block h-10 w-auto object-contain mb-4"
          referrerPolicy="no-referrer"
        />
        <h1 className="font-heading text-2xl mb-3">AI Hub</h1>
        <p className="text-brand-muted text-sm mb-8">
          Sign in with your company Google account to continue
        </p>
        <Button variant="primary" size="lg" onClick={login} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </div>
    </div>
  );
};
