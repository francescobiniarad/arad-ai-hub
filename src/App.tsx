import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/auth-context';
import { Navbar } from './components/layout';

// Pages
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { FormazionePage } from './pages/formazione';
import { CertificazioniPage } from './pages/formazione/certificazioni';
import { WorkshopPage } from './pages/formazione/workshop';
import { PracticalPage } from './pages/formazione/practical';
import { NewsPage, GamificationPage } from './pages/formazione/placeholder';
import { RDPage } from './pages/rd';
import { KanbanPage } from './pages/rd/kanban';
import { TabellaPage } from './pages/rd/tabella';
import { OfferingPage } from './pages/offering';

const USE_EMULATORS = import.meta.env.VITE_USE_EMULATORS === 'true';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // Skip auth in local emulator mode
  if (USE_EMULATORS) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary-500 font-mono">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Main layout with navbar
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
};

// Kanban layout (wider)
const KanbanLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main className="px-3 py-6">{children}</main>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Formazione */}
      <Route
        path="/formazione"
        element={
          <ProtectedRoute>
            <Layout>
              <FormazionePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/formazione/certificazioni"
        element={
          <ProtectedRoute>
            <Layout>
              <CertificazioniPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/formazione/workshop"
        element={
          <ProtectedRoute>
            <Layout>
              <WorkshopPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/formazione/practical"
        element={
          <ProtectedRoute>
            <Layout>
              <PracticalPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/formazione/news"
        element={
          <ProtectedRoute>
            <Layout>
              <NewsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/formazione/gamification"
        element={
          <ProtectedRoute>
            <Layout>
              <GamificationPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* R&D */}
      <Route
        path="/rd"
        element={
          <ProtectedRoute>
            <Layout>
              <RDPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rd/kanban"
        element={
          <ProtectedRoute>
            <KanbanLayout>
              <KanbanPage />
            </KanbanLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rd/tabella"
        element={
          <ProtectedRoute>
            <Layout>
              <TabellaPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Offering */}
      <Route
        path="/offering"
        element={
          <ProtectedRoute>
            <Layout>
              <OfferingPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1E293B',
              color: '#E2E8F0',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: '#1E293B',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#1E293B',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
