import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import AuthChoice from "./pages/AuthChoice";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";
import PulseMap from "./pages/PulseMap";
import CivicHome from "./pages/CivicHome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";


/* =========================================
   PROTECTED PAGE
========================================= */

function ProtectedRoute({ children }) {

    const user =
        localStorage.getItem("civicpulse_user");

    if (!user) {

        return (
            <Navigate
                to="/auth"
                replace
            />
        );

    }

    return children;
}


/* =========================================
   APP
========================================= */

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================
                    PUBLIC PAGES
                ========================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/auth"
                    element={<AuthChoice />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/admin-login"
                    element={<AdminLogin />}
                />


                {/* =========================
                    CITIZEN HOME
                ========================= */}

                <Route
                    path="/civic-home"
                    element={
                        <ProtectedRoute>
                            <CivicHome />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    REPORT PROBLEM
                ========================= */}

                <Route
                    path="/report"
                    element={
                        <ProtectedRoute>
                            <Report />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    MY REPORTS
                ========================= */}

                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <Reports />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    CIVIC DASHBOARD
                ========================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    PULSE MAP
                ========================= */}

                <Route
                    path="/pulse-map"
                    element={
                        <ProtectedRoute>
                            <PulseMap />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    UNKNOWN URL
                ========================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}
export default App;