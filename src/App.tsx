import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { useAuth } from "./auth/useAuth";
import { seedCurriculumIfEmpty } from "./data/seedCurriculum";
import { RosterPage } from "./pages/RosterPage";
import { ChildDetailPage } from "./pages/ChildDetailPage";
import { CatalogPage } from "./pages/CatalogPage";
import { LoginPage } from "./pages/LoginPage";
import "./App.css";

function AuthenticatedApp() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user) return;
    seedCurriculumIfEmpty().catch((err) =>
      console.error("Failed to seed curriculum", err)
    );
  }, [user]);

  if (loading) {
    return <div className="app-loading">Loading…</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RosterPage />} />
        <Route path="/child/:childId" element={<ChildDetailPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;
