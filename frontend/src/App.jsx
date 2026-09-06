import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import AuthChoice from "./pages/AuthChoice";
import Report from "./pages/Report";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";
import PulseMap from "./pages/PulseMap";
import CivicHome from "./pages/CivicHome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

/* =========================================
   PROTECTED ROUTE
   Only logged-in citizens can access these
========================================= */

function ProtectedRoute({ children }) {

    const user = localStorage.getItem("civicpulse_user");

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

                {/* =================================
                    FIRST PAGE
                    LOGIN / REGISTER ONLY
                ================================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/auth"
                            replace
                        />
                    }
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


                {/* =================================
                    ADMIN LOGIN
                ================================= */}

                <Route
                    path="/admin-login"
                    element={<AdminLogin />}
                />
                <Route
                path="/admin-dashboard"
                element={<AdminDashboard />}
                />

                {/* =================================
                    AFTER CITIZEN LOGIN
                ================================= */}

                <Route
                    path="/civic-home"
                    element={
                        <ProtectedRoute>
                            <CivicHome />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/report"
                    element={
                        <ProtectedRoute>
                            <Report />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <Reports />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/pulse-map"
                    element={
                        <ProtectedRoute>
                            <PulseMap />
                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    ANY UNKNOWN URL
                ================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/auth"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;