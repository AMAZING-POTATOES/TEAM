import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import FridgeHome from "./pages/Fridge";
import FridgeEdit from "./pages/FridgeEdit";
import UploadReceipt from "./pages/UploadReceipt";
import RecipeHome from "./pages/recipes/RecipeHome";
import RecipeDetail from "./pages/recipes/RecipeDetail";
import RecipeCommunity from "./pages/recipes/RecipeCommunity";
import RecipeCreate from "./pages/recipes/RecipeCreate";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="pt-16 bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadReceipt />} />
          <Route path="/fridge" element={<FridgeHome />} />
          <Route path="/fridge/edit/:id" element={<FridgeEdit />} />
          <Route path="/recipes" element={<RecipeHome />} />
          {/* 정적 라우트를 동적 라우트보다 먼저 선언 */}
          <Route path="/recipes/community" element={<RecipeCommunity />} />
          <Route path="/recipes/create" element={<RecipeCreate />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="*" element={<div className="p-10">Not Found</div>} />
        </Routes>
      </div>
    </>
  );
}
