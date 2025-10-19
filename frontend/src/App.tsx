import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage.tsx";
import SignupPage from "@/pages/SignupPage.tsx";
import BudgetPage from "@/pages/BudgetPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import CategoriesPage from "@/pages/CategoriesPage.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path ="/main" element = {<BudgetPage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<div className="p-10 text-center">404 — Not found</div>} />
        </Routes>
    );
}

export default App;
