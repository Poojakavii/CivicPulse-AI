import { Link, useNavigate } from "react-router-dom";

function CivicHome() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("civicpulse_user") || "{}"
    );

    function logout() {

        localStorage.removeItem("civicpulse_logged_in");

        navigate("/");
    }

    return (

        <div className="civic-home">

            {/* NAVBAR */}

            <nav className="civic-navbar">

                <Link to="/civic-home" className="civic-logo">
                    <div className="logo-mark">
                        🌐
                    </div>

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

                    <Link to="/civic-home" className="active">
                        Home
                    </Link>

                    <Link to="/report">
                        Report Problem
                    </Link>

                    <Link to="/pulse-map">
                        PulseMap
                    </Link>

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                </div>


                <div className="civic-user">

                    <Link to="/profile" className="user-profile">

                        <div className="user-avatar">
                            {(user.name || "C").charAt(0).toUpperCase()}
                        </div>

                        <div className="user-name">
                            <strong>
                                {user.name || "Citizen"}
                            </strong>

                            <small>
                                Citizen
                            </small>
                        </div>

                    </Link>

                    <button
                        onClick={logout}
                        className="logout-btn"
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* HERO */}

            <main className="civic-main">

                <section className="civic-hero">

                    <div className="hero-content">

                        <div className="hero-badge">
                            ● COMMUNITY SIGNALS ARE ACTIVE
                        </div>

                        <h1>
                            Make your city
                            <br />
                            <span>better, one signal at a time.</span>
                        </h1>

                        <p>
                            Report civic problems, discover issues around
                            you and follow every step from citizen report
                            to verified resolution.
                        </p>


                        <div className="hero-actions">

                            <Link
                                to="/report"
                                className="primary-action"
                            >
                                🚨 Report a Problem
                                <span>→</span>
                            </Link>

                            <Link
                                to="/pulse-map"
                                className="secondary-action"
                            >
                                📍 Explore PulseMap
                            </Link>

                        </div>

                    </div>


                    {/* LIVE SIGNAL CARD */}

                    <div className="signal-card">

                        <div className="signal-header">

                            <div>
                                <span className="live-dot"></span>
                                LIVE CIVIC SIGNALS
                            </div>

                            <span>
                                TODAY
                            </span>

                        </div>


                        <div className="signal-number">
                            24
                        </div>

                        <p>
                            community reports nearby
                        </p>


                        <div className="signal-bars">

                            <div>
                                <span style={{ width: "82%" }}></span>
                            </div>

                            <div>
                                <span style={{ width: "61%" }}></span>
                            </div>

                            <div>
                                <span style={{ width: "74%" }}></span>
                            </div>

                            <div>
                                <span style={{ width: "48%" }}></span>
                            </div>

                            <div>
                                <span style={{ width: "91%" }}></span>
                            </div>

                        </div>


                        <div className="signal-footer">

                            <span>
                                ↑ 18% this week
                            </span>

                            <span>
                                AI monitored
                            </span>

                        </div>

                    </div>

                </section>


                {/* QUICK ACTIONS */}

                <section className="quick-section">

                    <div className="section-heading">

                        <div>
                            <span>
                                YOUR CIVIC SPACE
                            </span>

                            <h2>
                                What would you like to do?
                            </h2>
                        </div>

                        <p>
                            Everything you need to participate,
                            track and understand your community.
                        </p>

                    </div>


                    <div className="feature-grid">


                        <Link
                            to="/report"
                            className="feature-card report-card"
                        >

                            <div className="feature-icon">
                                🚨
                            </div>

                            <h3>
                                Report a Problem
                            </h3>

                            <p>
                                Found a damaged road, drainage issue,
                                garbage hotspot or broken streetlight?
                            </p>

                            <span>
                                Create report →
                            </span>

                        </Link>


                        <Link
                            to="/pulse-map"
                            className="feature-card"
                        >

                            <div className="feature-icon map-icon">
                                📍
                            </div>

                            <h3>
                                PulseMap
                            </h3>

                            <p>
                                See reported civic problems around
                                your location and stay aware.
                            </p>

                            <span>
                                Open live map →
                            </span>

                        </Link>


                        <Link
                            to="/reports"
                            className="feature-card"
                        >

                            <div className="feature-icon reports-icon">
                                📋
                            </div>

                            <h3>
                                My Reports
                            </h3>

                            <p>
                                Follow reports you submitted and see
                                whether officials have acted.
                            </p>

                            <span>
                                Track reports →
                            </span>

                        </Link>


                        <Link
                            to="/dashboard"
                            className="feature-card"
                        >

                            <div className="feature-icon dashboard-icon">
                                📊
                            </div>

                            <h3>
                                Civic Dashboard
                            </h3>

                            <p>
                                Understand local civic activity,
                                trends and resolution progress.
                            </p>

                            <span>
                                View insights →
                            </span>

                        </Link>

                    </div>

                </section>


                {/* HOW IT WORKS */}

                <section className="civic-process">

                    <div className="section-heading">

                        <div>
                            <span>
                                FROM SIGNAL TO SOLUTION
                            </span>

                            <h2>
                                What happens after you report?
                            </h2>
                        </div>

                    </div>


                    <div className="process-grid">

                        <div className="process-item">

                            <div className="process-number">
                                01
                            </div>

                            <h3>
                                You report
                            </h3>

                            <p>
                                Submit the problem with a description,
                                photo and location.
                            </p>

                        </div>


                        <div className="process-line"></div>


                        <div className="process-item">

                            <div className="process-number">
                                02
                            </div>

                            <h3>
                                CivicPulse detects
                            </h3>

                            <p>
                                AI analyses the report and identifies
                                its category and priority.
                            </p>

                        </div>


                        <div className="process-line"></div>


                        <div className="process-item">

                            <div className="process-number">
                                03
                            </div>

                            <h3>
                                Officer receives
                            </h3>

                            <p>
                                The responsible authority can review
                                and assign the issue.
                            </p>

                        </div>


                        <div className="process-line"></div>


                        <div className="process-item">

                            <div className="process-number">
                                04
                            </div>

                            <h3>
                                Citizen verifies
                            </h3>

                            <p>
                                Once fixed, the citizen can confirm
                                that the problem is actually resolved.
                            </p>

                        </div>

                    </div>

                </section>


                {/* FOOTER */}

                <footer className="civic-footer">

                    <strong>
                        CivicPulse <span>AI</span>
                    </strong>

                    <p>
                        From citizen signal to verified resolution.
                    </p>

                    <div>
                        <Link to="/report">
                            Report
                        </Link>

                        <Link to="/pulse-map">
                            PulseMap
                        </Link>

                        <Link to="/dashboard">
                            Dashboard
                        </Link>
                    </div>

                </footer>

            </main>

        </div>
    );
}

export default CivicHome;