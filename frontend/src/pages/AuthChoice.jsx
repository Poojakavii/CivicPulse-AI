import { Link } from "react-router-dom";

function AuthChoice() {
    return (
        <main className="welcome-page">

            {/* Background decoration */}
            <div className="welcome-orb orb-one"></div>
            <div className="welcome-orb orb-two"></div>

            <section className="welcome-shell">

                {/* NAVBAR */}
                <header className="welcome-nav">

                    <div className="welcome-brand">
                        <div className="brand-mark">
                            CP
                        </div>

                        <div>
                            <strong>CivicPulse</strong>
                            <span>AI</span>
                        </div>
                    </div>

                    <div className="nav-right">
                        <span className="nav-status">
                            <i></i>
                            Community Intelligence
                        </span>

                        <Link
                            to="/admin-login"
                            className="officer-link"
                        >
                            Officer Login
                        </Link>
                    </div>

                </header>


                {/* HERO */}
                <div className="welcome-content">

                    {/* LEFT */}
                    <div className="welcome-copy">

                        <div className="welcome-label">
                            <span>✦</span>
                            SMARTER CIVIC REPORTING
                        </div>

                        <h1>
                            Your voice.
                            <br />
                            Your <em>community.</em>
                            <br />
                            Your impact.
                        </h1>

                        <p>
                            CivicPulse AI helps citizens report local
                            problems, discover issues around them,
                            and follow every problem from report
                            to resolution.
                        </p>


                        <div className="welcome-actions">

                            <Link
                                to="/login"
                                className="primary-auth-btn"
                            >
                                <span>Login to CivicPulse</span>
                                <b>→</b>
                            </Link>

                            <Link
                                to="/register"
                                className="secondary-auth-btn"
                            >
                                Create an account
                            </Link>

                        </div>


                        <div className="trust-row">

                            <div className="trust-item">
                                <div>🔒</div>
                                <span>
                                    Secure citizen access
                                </span>
                            </div>

                            <div className="trust-item">
                                <div>🤖</div>
                                <span>
                                    AI-powered analysis
                                </span>
                            </div>

                            <div className="trust-item">
                                <div>📍</div>
                                <span>
                                    Location-aware reporting
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* RIGHT VISUAL */}
                    <div className="welcome-visual">

                        <div className="visual-glow"></div>

                        <div className="civic-panel">

                            <div className="panel-top">

                                <div>
                                    <small>
                                        CIVICPULSE LIVE
                                    </small>

                                    <h3>
                                        Community Pulse
                                    </h3>
                                </div>

                                <div className="live-dot">
                                    <i></i>
                                    LIVE
                                </div>

                            </div>


                            {/* MAP */}
                            <div className="mini-map">

                                <div className="map-grid"></div>

                                <div className="road road-one"></div>
                                <div className="road road-two"></div>
                                <div className="road road-three"></div>

                                <div className="map-pin pin-one">
                                    🚧
                                </div>

                                <div className="map-pin pin-two">
                                    💧
                                </div>

                                <div className="map-pin pin-three">
                                    💡
                                </div>

                                <div className="you-location">
                                    <span></span>
                                    You
                                </div>

                            </div>


                            {/* ACTIVITY */}
                            <div className="activity-list">

                                <div className="activity">

                                    <div className="activity-icon road-icon">
                                        🚧
                                    </div>

                                    <div>
                                        <strong>
                                            Damaged Road
                                        </strong>

                                        <small>
                                            0.8 km from you
                                        </small>
                                    </div>

                                    <b className="high">
                                        HIGH
                                    </b>

                                </div>


                                <div className="activity">

                                    <div className="activity-icon water-icon">
                                        💧
                                    </div>

                                    <div>
                                        <strong>
                                            Drainage Issue
                                        </strong>

                                        <small>
                                            1.2 km from you
                                        </small>
                                    </div>

                                    <b className="medium">
                                        MEDIUM
                                    </b>

                                </div>


                                <div className="activity">

                                    <div className="activity-icon light-icon">
                                        💡
                                    </div>

                                    <div>
                                        <strong>
                                            Streetlight
                                        </strong>

                                        <small>
                                            1.7 km from you
                                        </small>
                                    </div>

                                    <b className="low">
                                        LOW
                                    </b>

                                </div>

                            </div>


                            <div className="panel-footer">
                                <span>●</span>
                                AI detected nearby civic activity
                            </div>

                        </div>


                        {/* FLOATING CARD */}

                        <div className="floating-card">

                            <div className="floating-icon">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Civic issue resolved
                                </strong>

                                <small>
                                    Report #CP-1042
                                </small>
                            </div>

                        </div>


                        <div className="floating-stat">

                            <strong>
                                94%
                            </strong>

                            <span>
                                Community
                                response
                            </span>

                        </div>

                    </div>

                </div>


                {/* BOTTOM */}
                <footer className="welcome-footer">

                    <span>
                        © 2026 CivicPulse AI
                    </span>

                    <div>
                        <span>Report</span>
                        <span>Track</span>
                        <span>Resolve</span>
                    </div>

                </footer>

            </section>

        </main>
    );
}

export default AuthChoice;