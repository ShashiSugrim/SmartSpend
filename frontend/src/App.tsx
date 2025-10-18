import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage.tsx";
import SignupPage from "@/pages/SignupPage.tsx";

function App() {
    return (
        <Routes>
            {/* Root → Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Other pages */}
            <Route path="/signup" element={<SignupPage />} />

            {/* Optional: alias /home -> / */}
            <Route path="/home" element={<Navigate to="/" replace />} />

            {/* 404 */}
            <Route path="*" element={<div className="p-10 text-center">404 — Not found</div>} />
        </Routes>
    );
}

export default App;
