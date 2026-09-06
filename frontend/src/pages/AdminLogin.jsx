import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [emailFocused, setEmailFocused] =
        useState(false);

    const [passwordFocused, setPasswordFocused] =
        useState(false);


    // =====================================================
    // OFFICER LOGIN
    // =====================================================

    function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setLoading(true);

        const officerEmail =
            email.trim().toLowerCase();

        /*
         * DEMO LOGIN CREDENTIALS
         *
         * These are NOT displayed anywhere.
         * Officer must enter them manually.
         */

        if (
            officerEmail === "admin@civicpulse.ai" &&
            password === "admin123"
        ) {

            localStorage.setItem(
                "adminLoggedIn",
                "true"
            );

            setTimeout(() => {

                navigate(
                    "/admin-dashboard"
                );

            }, 400);

            return;
        }


        setLoading(false);

        setError(
            "Invalid officer credentials. Please check your email and password."
        );
    }


    return (

        <main className="admin-login-page">

            {/* BACKGROUND */}

            <div className="admin-bg-circle circle-one"></div>

            <div className="admin-bg-circle circle-two"></div>


            <section className="admin-login-wrapper">


                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="admin-login-intro">


                    {/* BACK */}

                    <button
                        type="button"
                        className="admin-back-btn"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        ← CivicPulse
                    </button>


                    {/* BRAND */}

                    <div className="admin-brand">

                        <div className="admin-logo">
                            CP
                        </div>

                        <div>

                            <h3>
                                CivicPulse <span>AI</span>
                            </h3>

                            <p>
                                SMART CIVIC MANAGEMENT
                            </p>

                        </div>

                    </div>


                    {/* INTRO */}

                    <div className="admin-intro-content">

                        <div className="admin-small-label">

                            <span></span>

                            OFFICER CONTROL CENTER

                        </div>


                        <h1>

                            Turn citizen
                            <br />

                            reports into
                            <br />

                            <strong>action.</strong>

                        </h1>


                        <p>

                            Monitor civic problems, identify
                            emerging hotspots, coordinate
                            responses and track every reported
                            issue until resolution.

                        </p>

                    </div>


                    {/* FEATURES */}

                    <div className="admin-feature-list">


                        <div className="admin-feature">

                            <div className="admin-feature-icon">
                                📍
                            </div>

                            <div>

                                <strong>
                                    Location Intelligence
                                </strong>

                                <span>
                                    See where civic problems are happening.
                                </span>

                            </div>

                        </div>


                        <div className="admin-feature">

                            <div className="admin-feature-icon">
                                📊
                            </div>

                            <div>

                                <strong>
                                    Civic Analytics
                                </strong>

                                <span>
                                    Understand reports and emerging patterns.
                                </span>

                            </div>

                        </div>


                        <div className="admin-feature">

                            <div className="admin-feature-icon">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    Resolution Tracking
                                </strong>

                                <span>
                                    Follow issues from report to resolution.
                                </span>

                            </div>

                        </div>

                    </div>

                </div>



                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="admin-login-right">


                    <div className="admin-login-card">


                        {/* TOP */}

                        <div className="admin-card-top">

                            <div className="admin-lock-icon">
                                🔐
                            </div>

                            <div className="admin-secure-label">
                                SECURE OFFICER ACCESS
                            </div>

                        </div>


                        {/* HEADING */}

                        <div className="admin-card-heading">

                            <h2>
                                Welcome back
                            </h2>

                            <p>
                                Sign in to access the CivicPulse
                                Officer Control Center.
                            </p>

                        </div>



                        {/* =================================================
                            LOGIN FORM
                        ================================================= */}

                        <form
                            onSubmit={handleSubmit}
                            autoComplete="off"
                        >


                            {/* =================================================
                                EMAIL
                            ================================================= */}

                            <div className="admin-field">

                                <label>
                                    Officer Email
                                </label>


                                <div className="admin-input">

                                    <span>
                                        ✉
                                    </span>


                                    <input
                                        type="email"

                                        name="officer-login-email"

                                        placeholder="Enter officer email"

                                        value={email}

                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }

                                        onFocus={() =>
                                            setEmailFocused(true)
                                        }

                                        onBlur={() =>
                                            setEmailFocused(false)
                                        }

                                        autoComplete="off"

                                        autoCorrect="off"

                                        autoCapitalize="none"

                                        spellCheck="false"

                                        required
                                    />

                                </div>

                            </div>



                            {/* =================================================
                                PASSWORD
                            ================================================= */}

                            <div className="admin-field">

                                <div className="admin-password-heading">

                                    <label>
                                        Password
                                    </label>

                                    <span>
                                        Secure access
                                    </span>

                                </div>


                                <div className="admin-input">

                                    <span>
                                        🔑
                                    </span>


                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }

                                        name="officer-login-password"

                                        placeholder="Enter password"

                                        value={password}

                                        onChange={(event) =>
                                            setPassword(
                                                event.target.value
                                            )
                                        }

                                        onFocus={() =>
                                            setPasswordFocused(true)
                                        }

                                        onBlur={() =>
                                            setPasswordFocused(false)
                                        }

                                        /*
                                         * Important:
                                         * Do not use the demo password
                                         * as the default value.
                                         */

                                        autoComplete="new-password"

                                        required
                                    />


                                    <button
                                        type="button"

                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >

                                        {
                                            showPassword
                                                ? "Hide"
                                                : "Show"
                                        }

                                    </button>

                                </div>

                            </div>



                            {/* =================================================
                                ERROR
                            ================================================= */}

                            {error && (

                                <div className="admin-error">

                                    <div>
                                        !
                                    </div>

                                    <p>
                                        {error}
                                    </p>

                                </div>

                            )}



                            {/* =================================================
                                LOGIN BUTTON
                            ================================================= */}

                            <button
                                type="submit"

                                className="admin-login-button"

                                disabled={loading}
                            >

                                <span>

                                    {
                                        loading
                                            ? "Authenticating..."
                                            : "Enter Officer Dashboard"
                                    }

                                </span>

                                <b>
                                    →
                                </b>

                            </button>

                        </form>



                        {/* =================================================
                            CITIZEN LOGIN
                            ================================================= */}

                        <div className="admin-citizen-link">

                            <span>
                                Are you a citizen?
                            </span>

                            <button
                                type="button"

                                onClick={() =>
                                    navigate("/login")
                                }
                            >

                                Go to Citizen Login →

                            </button>

                        </div>

                    </div>



                    {/* FOOTER */}

                    <div className="admin-footer">

                        <span>
                            🛡️ Authorized Personnel Only
                        </span>

                        <span>
                            CivicPulse AI
                        </span>

                    </div>

                </div>

            </section>

        </main>
    );
}


export default AdminLogin;