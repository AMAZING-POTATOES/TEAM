// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import UploadReceipt from "./pages/UploadReceipt";
import Fridge from "./pages/Fridge";
import FridgeEdit from "./pages/FridgeEdit";
import Recipes from "./pages/Recipes";
import ProtectedRoute from "./app/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<UploadReceipt />} />
        <Route path="/recipes" element={<Recipes />} />

        {/* 보호 라우트 */}
        <Route
          path="/fridge"
          element={
            <ProtectedRoute>
              <Fridge />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fridge/edit/:id"
          element={
            <ProtectedRoute>
              <FridgeEdit />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div className="p-8">페이지를 찾을 수 없어요.</div>} />
      </Routes>
    </>
  );
}
