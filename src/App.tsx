import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { seedCurriculumIfEmpty } from "./data/seedCurriculum";
import { RosterPage } from "./pages/RosterPage";
import { ChildDetailPage } from "./pages/ChildDetailPage";
import "./App.css";

function App() {
  useEffect(() => {
    seedCurriculumIfEmpty().catch((err) =>
      console.error("Failed to seed curriculum", err)
    );
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RosterPage />} />
        <Route path="/child/:childId" element={<ChildDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
