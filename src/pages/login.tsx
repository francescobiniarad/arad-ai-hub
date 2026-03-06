import { useAuth } from '../context/auth-context';
import { Button } from '../components/ui';

export const LoginPage = () => {
  const { login, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-mono text-4xl font-bold mb-4 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          ARAD AI Hub
        </h1>
        <p className="text-slate-500 mb-8">
          Sign in with your company Google account to continue
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={login}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </div>
    </div>
  );
};
