import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");


    function handleChange(e) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    }


    async function handleSubmit(e) {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.phone.trim() ||
            !form.password ||
            !form.confirmPassword
        ) {

            setError(
                "Please fill in all fields."
            );

            return;
        }


        if (form.password.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }


        if (form.password !== form.confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        setLoading(true);


        try {

            const response = await registerUser({

                name: form.name.trim(),

                email: form.email.trim(),

                password: form.password,

                phone: form.phone.trim()

            });


            if (response.success) {

                setSuccess(
                    "Account created successfully! Redirecting to login..."
                );


                // Save only basic user information locally.
                // Password is NOT stored in localStorage.

                localStorage.setItem(
                    "civicpulse_user",
                    JSON.stringify(
                        response.user
                    )
                );


                setTimeout(() => {

                    navigate("/login");

                }, 1200);

            } else {

                setError(
                    response.message ||
                    "Registration failed."
                );

            }


        } catch (err) {

            console.error(
                "Registration error:",
                err
            );

            setError(
                err.message ||
                "Unable to connect to the server."
            );

        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="register-page">


            {/* LEFT SIDE */}

            <div className="register-info">

                <Link
                    to="/"
                    className="register-brand"
                >
                    🌐 CivicPulse <span>AI</span>
                </Link>


                <div className="register-message">

                    <div className="register-badge">
                        JOIN THE CIVIC PULSE
                    </div>


                    <h1>
                        Your city needs
                        <br />
                        <span>your signal.</span>
                    </h1>


                    <p>
                        Create your CivicPulse account
                        and help identify problems before
                        they become bigger community issues.
                    </p>


                    <div className="register-stats">

                        <div>
                            <strong>📍</strong>
                            <span>
                                Report local issues
                            </span>
                        </div>


                        <div>
                            <strong>🧠</strong>
                            <span>
                                Let AI identify patterns
                            </span>
                        </div>


                        <div>
                            <strong>🔎</strong>
                            <span>
                                Track every update
                            </span>
                        </div>


                        <div>
                            <strong>✅</strong>
                            <span>
                                Verify the resolution
                            </span>
                        </div>

                    </div>

                </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="register-form-area">

                <div className="register-form-card">


                    <div className="register-mobile-brand">
                        🌐 CivicPulse <span>AI</span>
                    </div>


                    <div className="register-heading">

                        <div className="register-step">
                            CREATE YOUR ACCOUNT
                        </div>

                        <h2>
                            Become a civic signal.
                        </h2>

                        <p>
                            It takes less than a minute
                            to get started.
                        </p>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        autoComplete="off"
                    >


                        {/* NAME */}

                        <div className="register-field">

                            <label>
                                Full name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="off"
                                required
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="register-field">

                            <label>
                                Email address
                            </label>

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


                        {/* PHONE */}

                        <div className="register-field">

                            <label>
                                Phone number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                placeholder="+91 98765 43210"
                                value={form.phone}
                                onChange={handleChange}
                                autoComplete="off"
                                required
                            />

                        </div>


                        {/* PASSWORDS */}

                        <div className="register-two-columns">


                            <div className="register-field">

                                <label>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Minimum 6 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />

                            </div>


                            <div className="register-field">

                                <label>
                                    Confirm password
                                </label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Repeat password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="register-error">

                                ⚠️ {error}

                            </div>

                        )}


                        {/* SUCCESS */}

                        {success && (

                            <div
                                className="register-success"
                            >

                                ✓ {success}

                            </div>

                        )}


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="register-submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating account..."
                                : "Create CivicPulse Account"
                            }

                            {!loading && (
                                <span>→</span>
                            )}

                        </button>


                    </form>


                    <div className="register-login">

                        Already have an account?

                        <Link to="/login">
                            Login
                        </Link>

                    </div>


                    <div className="register-bottom">

                        <Link to="/pulse-map">
                            📍 Explore PulseMap
                        </Link>

                        <Link to="/auth">
                            ← Back
                        </Link>

                    </div>


                    <div className="register-security">

                        <span>🔒</span>

                        <div>

                            <strong>
                                Your information stays protected
                            </strong>

                            <p>
                                Your account helps CivicPulse
                                connect your reports to their
                                progress.
                            </p>

                        </div>

                    </div>


                </div>

            </div>

        </div>

    );

}

export default Register;