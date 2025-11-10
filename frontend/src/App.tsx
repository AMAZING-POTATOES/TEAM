import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import FridgeHome from "./pages/Fridge";
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
          <Route path="/fridge" element={<FridgeHome />} />
          <Route path="/recipes" element={<RecipeHome />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/recipes/community" element={<RecipeCommunity />} />
          <Route path="/recipes/create" element={<RecipeCreate />} />
          <Route path="*" element={<div className="p-10">Not Found</div>} />
        </Routes>
      </div>
    </>
  );
}
