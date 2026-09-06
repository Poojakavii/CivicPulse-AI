import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home-page">

            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <nav className="navbar">

                {/* LOGO */}
                <Link
                    to="/"
                    className="logo"
                    style={{
                        textDecoration: "none",
                        color: "inherit"
                    }}
                >
                    🌐 CivicPulse <span>AI</span>
                </Link>


                {/* NAVIGATION */}
                <div className="nav-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/pulse-map">
                        PulseMap
                    </Link>


                    {/* LOGIN GROUP */}
                    <div
                        className="login-button-group"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >

                        {/* CITIZEN LOGIN */}
                        <Link
                            to="/login"
                            className="nav-login"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "42px",
                                padding: "0 18px",
                                borderRadius: "9px",
                                textDecoration: "none",
                                fontWeight: "700",
                                whiteSpace: "nowrap"
                            }}
                        >
                            👤 Citizen Login
                        </Link>


                        {/* OFFICER LOGIN */}
                        <Link
                            to="/admin-login"
                            className="nav-officer-login"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "42px",
                                padding: "0 18px",
                                borderRadius: "9px",
                                textDecoration: "none",
                                fontWeight: "700",
                                whiteSpace: "nowrap"
                            }}
                        >
                            🛡️ Officer Login
                        </Link>


                        {/* REGISTER */}
                        <Link
                            to="/register"
                            className="nav-register"
                        >
                            Register
                        </Link>

                    </div>

                </div>

            </nav>


            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="hero">

                <div className="hero-content">

                    <div className="hero-badge">
                        ✦ AI-POWERED CIVIC INTELLIGENCE
                    </div>


                    <h1>
                        Turn civic problems
                        <br />
                        into <span>action.</span>
                    </h1>


                    <p>
                        Report problems around you, track
                        their progress, and see how your
                        community is changing in real time.
                    </p>


                    <div className="hero-buttons">

                        <Link
                            to="/report"
                            className="primary-button"
                        >
                            Report a Problem →
                        </Link>


                        <Link
                            to="/pulse-map"
                            className="secondary-button"
                        >
                            Explore PulseMap
                        </Link>

                    </div>

                </div>


                {/* =================================================
                    HERO CARD
                ================================================= */}

                <div className="hero-card">

                    <div className="card-header">

                        <div>

                            <small>
                                COMMUNITY PULSE
                            </small>

                            <h3>
                                Live Civic Activity
                            </h3>

                        </div>


                        <span className="live">
                            ● LIVE
                        </span>

                    </div>


                    <div className="activity">

                        <div className="activity-icon road">
                            🚧
                        </div>

                        <div>
                            <strong>
                                Road Damage
                            </strong>

                            <small>
                                18 reports nearby
                            </small>
                        </div>

                        <span className="high">
                            HIGH
                        </span>

                    </div>


                    <div className="activity">

                        <div className="activity-icon water">
                            💧
                        </div>

                        <div>
                            <strong>
                                Drainage
                            </strong>

                            <small>
                                14 reports nearby
                            </small>
                        </div>

                        <span className="high">
                            HIGH
                        </span>

                    </div>


                    <div className="activity">

                        <div className="activity-icon waste">
                            🗑️
                        </div>

                        <div>
                            <strong>
                                Waste
                            </strong>

                            <small>
                                16 reports nearby
                            </small>
                        </div>

                        <span className="medium">
                            MEDIUM
                        </span>

                    </div>


                    <div className="card-footer">

                        <span>
                            🧠 AI detected
                            <strong>
                                {" "}3 emerging hotspots
                            </strong>
                        </span>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FEATURES
            ===================================================== */}

            <section className="features">

                <div className="section-heading">

                    <span>
                        HOW CIVICPULSE WORKS
                    </span>

                    <h2>
                        From a report to real action.
                    </h2>

                </div>


                <div className="feature-grid">

                    <div className="feature-card">

                        <div>
                            📍
                        </div>

                        <h3>
                            Report
                        </h3>

                        <p>
                            Submit a civic problem with
                            location, description and photo.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div>
                            🧠
                        </div>

                        <h3>
                            AI Intelligence
                        </h3>

                        <p>
                            CivicPulse classifies, prioritizes
                            and detects repeated problems.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div>
                            🛡️
                        </div>

                        <h3>
                            Track
                        </h3>

                        <p>
                            Follow your report from submission
                            to officer assignment and resolution.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div>
                            ✅
                        </div>

                        <h3>
                            Verify
                        </h3>

                        <p>
                            Citizens verify whether the reported
                            problem was actually resolved.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                CTA
            ===================================================== */}

            <section className="home-cta">

                <h2>
                    See what's happening around you.
                </h2>

                <p>
                    Explore active civic issues and
                    emerging hotspots on the live map.
                </p>

                <Link
                    to="/pulse-map"
                    className="primary-button"
                >
                    Open CivicPulse Map →
                </Link>

            </section>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer>

                <strong>
                    🌐 CivicPulse AI
                </strong>

                <span>
                    From citizen signal to verified resolution.
                </span>

            </footer>

        </div>
    );
}

export default Home;