import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) =>
        location.pathname === path ? "active" : "";

    function logout() {
        localStorage.removeItem("civicpulse_user");
        navigate("/login");
    }

    return (
        <nav className="civic-navbar">

            <Link to="/civic-home" className="civic-logo">
                <div className="logo-mark">🌐</div>

                <div>
                    <strong>
                        CivicPulse <span>AI</span>
                    </strong>

                    <small>
                        Civic intelligence
                    </small>
                </div>
            </Link>

            <div className="civic-nav-links">

                <Link
                    to="/civic-home"
                    className={isActive("/civic-home")}
                >
                    Home
                </Link>

                <Link
                    to="/report"
                    className={isActive("/report")}
                >
                    Report Problem
                </Link>

                <Link
                    to="/pulse-map"
                    className={isActive("/pulse-map")}
                >
                    PulseMap
                </Link>

                <Link
                    to="/reports"
                    className={isActive("/reports")}
                >
                    My Reports
                </Link>

                <Link
                    to="/dashboard"
                    className={isActive("/dashboard")}
                >
                    Dashboard
                </Link>

            </div>

            <div className="navbar-actions">

                <Link
                    to="/profile"
                    className="navbar-profile"
                >
                    👤 Profile
                </Link>

                <button
                    onClick={logout}
                    className="navbar-logout"
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;