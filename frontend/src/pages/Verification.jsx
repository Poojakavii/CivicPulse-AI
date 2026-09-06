import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VerificationCard from "../components/VerificationCard";

function Verification() {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadReports();

    }, []);

    function loadReports() {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(
                        "civicpulse_reports"
                    ) || "[]"
                );

            setReports(saved);

        } catch (error) {

            console.error(
                "Verification loading error:",
                error
            );

            setReports([]);

        } finally {

            setLoading(false);

        }
    }

    function verifyReport(report) {

        const updated =
            reports.map(item => {

                if (item.id === report.id) {

                    return {
                        ...item,
                        verified: true,
                        verification_status: "Verified"
                    };

                }

                return item;
            });

        setReports(updated);

        localStorage.setItem(
            "civicpulse_reports",
            JSON.stringify(updated)
        );
    }

    const verifiedCount =
        reports.filter(
            report =>
                report.verified === true
        ).length;

    const pendingCount =
        reports.length - verifiedCount;

    return (
        <div className="verification-page">

            <nav className="civic-navbar">

                <Link
                    to="/civic-home"
                    className="civic-logo"
                >
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

                    <Link to="/civic-home">
                        Home
                    </Link>

                    <Link to="/report">
                        Report Problem
                    </Link>

                    <Link to="/pulse-map">
                        PulseMap
                    </Link>

                    <Link to="/reports">
                        My Reports
                    </Link>

                    <Link
                        to="/verification"
                        className="active"
                    >
                        Verification
                    </Link>

                </div>

            </nav>

            <main className="verification-container">

                <div className="verification-heading">

                    <div className="badge">
                        CIVIC VERIFICATION
                    </div>

                    <h1>
                        Verify Community Reports
                    </h1>

                    <p>
                        Review reported civic issues and
                        improve the reliability of CivicPulse
                        community intelligence.
                    </p>

                </div>

                <div className="verification-stats">

                    <div>
                        <strong>
                            {reports.length}
                        </strong>

                        <span>
                            Total Reports
                        </span>
                    </div>

                    <div>
                        <strong>
                            {verifiedCount}
                        </strong>

                        <span>
                            Verified
                        </span>
                    </div>

                    <div>
                        <strong>
                            {pendingCount}
                        </strong>

                        <span>
                            Pending
                        </span>
                    </div>

                </div>

                {loading ? (

                    <div className="verification-empty">
                        Loading reports...
                    </div>

                ) : reports.length === 0 ? (

                    <div className="verification-empty">

                        <div>
                            🔎
                        </div>

                        <h2>
                            No reports available
                        </h2>

                        <p>
                            Civic reports will appear here
                            when citizens submit them.
                        </p>

                    </div>

                ) : (

                    <div className="verification-list">

                        {reports.map(report => (

                            <VerificationCard
                                key={report.id}
                                report={report}
                                onVerify={verifyReport}
                            />

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

export default Verification;