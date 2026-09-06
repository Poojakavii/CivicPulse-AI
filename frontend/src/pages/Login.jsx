import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    function handleChange(e) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    }


    async function handleSubmit(e) {

        e.preventDefault();

        setError("");

        if (!form.email.trim() || !form.password) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);

        try {

            const response = await loginUser({
                email: form.email.trim(),
                password: form.password
            });

            console.log("LOGIN RESPONSE:", response);

            if (!response.success) {
                setError(
                    response.message ||
                    "Invalid email or password."
                );
                return;
            }

            /*
             * IMPORTANT
             *
             * Store the complete user object.
             */

            const user = response.user;

            if (!user || !user.id) {

                setError(
                    "Login succeeded, but user information was not returned by the server."
                );

                console.error(
                    "Invalid user response:",
                    response
                );

                return;
            }

            localStorage.setItem(
                "civicpulse_user",
                JSON.stringify(user)
            );

            /*
             * Remove old temporary data.
             */

            localStorage.removeItem("user");

            /*
             * Go to citizen home after successful login.
             */

            navigate("/civic-home");

        } catch (err) {

            console.error("LOGIN ERROR:", err);

            setError(
                err.message ||
                "Unable to connect to the CivicPulse server."
            );

        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="citizen-login-page">

            <div className="citizen-login-wrapper">


                {/* BRAND */}

                <Link
                    to="/"
                    className="citizen-login-brand"
                >
                    <div className="brand-logo">
                        CP
                    </div>

                    <div>
                        <strong>
                            CivicPulse
                        </strong>

                        <span>
                            AI
                        </span>
                    </div>
                </Link>


                {/* CARD */}

                <div className="citizen-login-card">


                    <div className="citizen-login-icon">
                        👋
                    </div>


                    <div className="citizen-login-heading">

                        <div className="citizen-login-label">
                            CITIZEN PORTAL
                        </div>

                        <h1>
                            Welcome back
                        </h1>

                        <p>
                            Sign in to report civic problems,
                            explore the PulseMap and track
                            your reports.
                        </p>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        autoComplete="off"
                    >


                        {/* EMAIL */}

                        <div className="citizen-login-field">

                            <label>
                                Email address
                            </label>

                            <div className="citizen-input-wrapper">

                                <span>
                                    ✉
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    required
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="citizen-login-field">

                            <label>
                                Password
                            </label>

                            <div className="citizen-input-wrapper">

                                <span>
                                    🔒
                                </span>

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="citizen-login-error">

                                ⚠️ {error}

                            </div>

                        )}


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="citizen-login-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign in to CivicPulse"
                            }

                            {!loading && (
                                <span>→</span>
                            )}

                        </button>

                    </form>


                    {/* REGISTER */}

                    <div className="citizen-login-register">

                        <span>
                            Don't have a CivicPulse account?
                        </span>

                        <Link to="/register">
                            Create account
                        </Link>

                    </div>


                    {/* OFFICER */}

                    <div className="citizen-officer-box">

                        <div>
                            🛡️
                        </div>

                        <div>

                            <strong>
                                CivicPulse Officer?
                            </strong>

                            <p>
                                Authorized personnel can access
                                the administration center.
                            </p>

                        </div>

                        <Link to="/admin-login">
                            Officer Login →
                        </Link>

                    </div>


                    <div className="citizen-login-footer">

                        🔐 Secure CivicPulse access

                    </div>

                </div>


                <Link
                    to="/"
                    className="citizen-back-home"
                >
                    ← Back to CivicPulse
                </Link>

            </div>

        </div>

    );

}

export default Login;