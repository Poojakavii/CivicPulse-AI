import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
    getReports
} from "../services/api";

import {
    getReportStatus,
    markResolved
} from "../services/reportStatus";


// =====================================================
// ICONS
// =====================================================

const icons = {
    Road: "🛣️",
    Drainage: "🚰",
    Streetlight: "💡",
    Waste: "🗑️",
    Pollution: "🌫️",
    Water: "💧",
    Other: "⚠️"
};


// =====================================================
// STATUS STEPS
// =====================================================

const statusSteps = [
    "Submitted",
    "Received",
    "Viewed",
    "Assigned",
    "In Progress",
    "Action Taken",
    "Resolved"
];


// =====================================================
// STATUS CLASS
// =====================================================

function getStatusClass(status) {

    switch (status) {

        case "Resolved":
            return "status-resolved";

        case "Action Taken":
            return "status-action";

        case "In Progress":
            return "status-progress";

        case "Viewed":
            return "status-viewed";

        case "Assigned":
            return "status-assigned";

        case "Received":
            return "status-received";

        default:
            return "status-submitted";
    }
}


// =====================================================
// PROGRESS
// =====================================================

function getProgress(status) {

    const index =
        statusSteps.indexOf(status);

    if (index === -1) {
        return 1;
    }

    return index + 1;
}


// =====================================================
// REPORTS
// =====================================================

function Reports() {

    const [reports, setReports] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [updatingId, setUpdatingId] =
        useState(null);


    // =================================================
    // GET LOGGED-IN USER
    // =================================================

    function getLoggedInUser() {

        try {

            const savedUser =
                localStorage.getItem(
                    "civicpulse_user"
                );

            if (!savedUser) {
                return null;
            }

            return JSON.parse(
                savedUser
            );

        } catch (error) {

            console.error(
                "Invalid user:",
                error
            );

            return null;
        }
    }


    // =================================================
    // LOAD REPORTS
    // =================================================

    async function loadReports() {

        try {

            setLoading(true);
            setError("");

            const user =
                getLoggedInUser();

            if (
                !user ||
                !user.id
            ) {

                setError(
                    "Please login again to view your reports."
                );

                setReports([]);

                return;
            }


            const response =
                await getReports();


            console.log(
                "DATABASE REPORTS:",
                response
            );


            const databaseReports =
                Array.isArray(response)
                    ? response
                    : response?.reports || [];


            // =========================================
            // ONLY LOGGED-IN CITIZEN REPORTS
            // =========================================

            const myReports =
                databaseReports.filter(
                    report =>
                        String(
                            report.citizen_id
                        ) ===
                        String(user.id)
                );


            setReports(
                myReports
            );

        } catch (error) {

            console.error(
                "Failed to load reports:",
                error
            );

            setError(
                error.message ||
                "Unable to load reports from the server."
            );

            setReports([]);

        } finally {

            setLoading(false);

        }
    }


    // =================================================
    // INITIAL LOAD
    // =================================================

    useEffect(() => {

        loadReports();

    }, []);


    // =================================================
    // CITIZEN VERIFIES RESOLUTION
    // =================================================

    function handleMarkSolved(report) {

        if (!report?.id) {

            setError(
                "This report does not have a valid ID."
            );

            return;
        }


        const confirmed =
            window.confirm(
                "Confirm that this civic problem has actually been resolved?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setUpdatingId(
                report.id
            );

            setError("");


            // =========================================
            // SAVE RESOLVED STATUS
            // =========================================

            markResolved(
                report.id
            );


            // =========================================
            // UPDATE SCREEN
            // =========================================

            setReports(
                previousReports =>
                    previousReports.map(
                        item => {

                            if (
                                String(item.id) ===
                                String(report.id)
                            ) {

                                return {
                                    ...item,
                                    status:
                                        "Resolved"
                                };
                            }

                            return item;
                        }
                    )
            );

        } catch (error) {

            console.error(
                "Resolution update failed:",
                error
            );

            setError(
                "Unable to update the report."
            );

        } finally {

            setUpdatingId(
                null
            );
        }
    }


    // =================================================
    // STATISTICS
    // =================================================

    const totalReports =
        reports.length;


    const resolvedReports =
        reports.filter(
            report =>
                getReportStatus(report) ===
                "Resolved"
        ).length;


    const actionTakenReports =
        reports.filter(
            report =>
                getReportStatus(report) ===
                "Action Taken"
        ).length;


    const activeReports =
        totalReports -
        resolvedReports;


    // =================================================
    // PAGE
    // =================================================

    return (

        <div
            className="reports-page"
            style={{
                minHeight: "100vh",
                background: "#f5f7fb"
            }}
        >


            {/* =================================================
                NAVBAR
            ================================================= */}

            <nav
                className="civic-navbar"
            >

                <Link
                    to="/civic-home"
                    className="civic-logo"
                >

                    <div className="logo-mark">
                        🌐
                    </div>

                    <div>

                        <strong>
                            CivicPulse{" "}
                            <span>AI</span>
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

                    <Link
                        to="/reports"
                        className="active"
                    >
                        My Reports
                    </Link>

                    <Link to="/dashboard">
                        Dashboard
                    </Link>

                </div>


                <Link
                    to="/profile"
                    className="reports-profile"
                >
                    👤 Profile
                </Link>

            </nav>


            {/* =================================================
                MAIN
            ================================================= */}

            <main
                className="reports-container"
            >


                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="reports-heading"
                >

                    <div>

                        <span>
                            CITIZEN ACTIVITY
                        </span>

                        <h1>
                            My Reports
                        </h1>

                        <p>
                            Track your reported civic
                            problems and verify
                            officer actions.
                        </p>

                    </div>


                    <Link
                        to="/report"
                        className="new-report-btn"
                    >
                        + Report New Problem
                    </Link>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div
                        className="reports-error"
                    >
                        ⚠️ {error}
                    </div>

                )}


                {/* =================================================
                    SUMMARY
                ================================================= */}

                {!loading && (

                    <div
                        className="report-summary"
                    >

                        <div>

                            <strong>
                                {totalReports}
                            </strong>

                            <span>
                                My Reports
                            </span>

                        </div>


                        <div>

                            <strong>
                                {actionTakenReports}
                            </strong>

                            <span>
                                Officer Action Taken
                            </span>

                        </div>


                        <div>

                            <strong>
                                {resolvedReports}
                            </strong>

                            <span>
                                Resolved
                            </span>

                        </div>


                        <div>

                            <strong>
                                {activeReports}
                            </strong>

                            <span>
                                Active Issues
                            </span>

                        </div>

                    </div>

                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div
                        className="reports-loading"
                    >

                        <div
                            className="loading-spinner"
                        />

                        <h2>
                            Loading your reports...
                        </h2>

                        <p>
                            Fetching your civic activity
                            from CivicPulse.
                        </p>

                    </div>

                )}


                {/* =================================================
                    NO REPORTS
                ================================================= */}

                {!loading &&
                    reports.length === 0 &&
                    !error && (

                    <div
                        className="empty-reports"
                    >

                        <div
                            className="empty-icon"
                        >
                            📋
                        </div>

                        <h2>
                            No reports found
                        </h2>

                        <p>
                            You haven't submitted
                            any civic problems yet.
                        </p>

                        <Link
                            to="/report"
                            className="empty-report-btn"
                        >
                            Report a Problem →
                        </Link>

                    </div>

                )}


                {/* =================================================
                    REPORT LIST
                ================================================= */}

                {!loading &&
                    reports.length > 0 && (

                    <div
                        className="reports-list"
                    >

                        {reports.map(
                            report => {

                                // =================================
                                // IMPORTANT:
                                // READ OFFICER STATUS
                                // =================================

                                const status =
                                    getReportStatus(
                                        report
                                    );


                                const progress =
                                    getProgress(
                                        status
                                    );


                                const icon =
                                    icons[
                                        report.category
                                    ] ||
                                    icons.Other;


                                const isActionTaken =
                                    status ===
                                    "Action Taken";


                                const isResolved =
                                    status ===
                                    "Resolved";


                                return (

                                    <article
                                        className="report-item"
                                        key={report.id}
                                        style={{
                                            background:
                                                "#ffffff",
                                            border:
                                                "1px solid #e2e8f0",
                                            borderRadius:
                                                "18px",
                                            padding:
                                                "24px",
                                            marginBottom:
                                                "20px",
                                            boxShadow:
                                                "0 8px 25px rgba(15,23,42,.05)"
                                        }}
                                    >


                                        {/* =================================
                                            HEADER
                                        ================================= */}

                                        <div
                                            className="report-item-header"
                                        >

                                            <div>

                                                <div
                                                    className="report-category"
                                                >

                                                    <span>
                                                        {icon}
                                                    </span>

                                                    {report.category ||
                                                        "Civic Issue"}

                                                </div>


                                                <h2>

                                                    {report.problem ||
                                                        `${report.category || "Civic"} Issue`}

                                                </h2>


                                                <p
                                                    className="report-description-preview"
                                                >
                                                    {report.description}
                                                </p>

                                            </div>


                                            {/* =================================
                                                CURRENT STATUS
                                            ================================= */}

                                            <span
                                                className={
                                                    `report-status ${getStatusClass(status)}`
                                                }
                                                style={{
                                                    whiteSpace:
                                                        "nowrap"
                                                }}
                                            >

                                                ● {status}

                                            </span>

                                        </div>


                                        {/* =================================
                                            DETAILS
                                        ================================= */}

                                        <div
                                            className="report-information"
                                        >

                                            <span>
                                                🆔 {report.id}
                                            </span>

                                            <span>
                                                📍{" "}
                                                {report.location ||
                                                    "Location unavailable"}
                                            </span>

                                            <span>
                                                📅{" "}
                                                {report.date ||
                                                    report.created_at ||
                                                    "Date unavailable"}
                                            </span>

                                        </div>


                                        {/* =================================
                                            AI INFORMATION
                                        ================================= */}

                                        {(report.severity ||
                                            report.risk_level ||
                                            report.risk_score !==
                                                undefined) && (

                                            <div
                                                className="ai-analysis"
                                            >

                                                <div
                                                    className="ai-icon"
                                                >
                                                    ✦
                                                </div>

                                                <div>

                                                    <strong>
                                                        CivicPulse AI Analysis
                                                    </strong>

                                                    <p>

                                                        {report.severity &&
                                                            `Severity: ${report.severity}`}

                                                        {report.severity &&
                                                            report.risk_level &&
                                                            " • "}

                                                        {report.risk_level &&
                                                            `Risk: ${report.risk_level}`}

                                                        {report.risk_score !==
                                                            undefined &&
                                                            ` • Score: ${report.risk_score}`}

                                                    </p>

                                                </div>

                                            </div>

                                        )}


                                        {/* =================================================
                                            OFFICER ACTION TAKEN
                                        ================================================= */}

                                        {isActionTaken && (

                                            <div
                                                style={{
                                                    marginTop:
                                                        "20px",
                                                    padding:
                                                        "20px",
                                                    background:
                                                        "#eff6ff",
                                                    border:
                                                        "1px solid #bfdbfe",
                                                    borderRadius:
                                                        "15px"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "flex-start",
                                                        gap:
                                                            "14px"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            width:
                                                                "42px",
                                                            height:
                                                                "42px",
                                                            borderRadius:
                                                                "12px",
                                                            background:
                                                                "#2563eb",
                                                            color:
                                                                "#ffffff",
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            fontSize:
                                                                "20px",
                                                            flexShrink:
                                                                0
                                                        }}
                                                    >
                                                        🛠️
                                                    </div>


                                                    <div
                                                        style={{
                                                            flex:
                                                                1
                                                        }}
                                                    >

                                                        <strong
                                                            style={{
                                                                display:
                                                                    "block",
                                                                color:
                                                                    "#1d4ed8",
                                                                fontSize:
                                                                    "17px",
                                                                marginBottom:
                                                                    "5px"
                                                            }}
                                                        >
                                                            Officer Action Taken
                                                        </strong>


                                                        <p
                                                            style={{
                                                                margin:
                                                                    0,
                                                                color:
                                                                    "#475569",
                                                                lineHeight:
                                                                    1.6
                                                            }}
                                                        >
                                                            An officer has reviewed
                                                            your report and taken
                                                            action on this civic
                                                            issue.
                                                        </p>


                                                        <p
                                                            style={{
                                                                margin:
                                                                    "8px 0 0",
                                                                color:
                                                                    "#64748b",
                                                                fontSize:
                                                                    "13px"
                                                            }}
                                                        >
                                                            Please check the actual
                                                            situation at the reported
                                                            location and verify whether
                                                            the problem has been solved.
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* =================================
                                                    CITIZEN VERIFICATION
                                                ================================= */}

                                                <div
                                                    style={{
                                                        marginTop:
                                                            "18px",
                                                        paddingTop:
                                                            "18px",
                                                        borderTop:
                                                            "1px solid #bfdbfe",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "space-between",
                                                        gap:
                                                            "15px",
                                                        flexWrap:
                                                            "wrap"
                                                    }}
                                                >

                                                    <div>

                                                        <strong
                                                            style={{
                                                                color:
                                                                    "#173b63"
                                                            }}
                                                        >
                                                            Is the problem actually solved?
                                                        </strong>

                                                        <p
                                                            style={{
                                                                margin:
                                                                    "4px 0 0",
                                                                fontSize:
                                                                    "12px",
                                                                color:
                                                                    "#64748b"
                                                            }}
                                                        >
                                                            Only you can verify the final resolution.
                                                        </p>

                                                    </div>


                                                    <button
                                                        onClick={() =>
                                                            handleMarkSolved(
                                                                report
                                                            )
                                                        }
                                                        disabled={
                                                            updatingId ===
                                                            report.id
                                                        }
                                                        style={{
                                                            border:
                                                                "none",
                                                            padding:
                                                                "12px 18px",
                                                            borderRadius:
                                                                "10px",
                                                            background:
                                                                "#2563eb",
                                                            color:
                                                                "#ffffff",
                                                            fontWeight:
                                                                "800",
                                                            cursor:
                                                                "pointer"
                                                        }}
                                                    >

                                                        {updatingId ===
                                                        report.id
                                                            ? "Updating..."
                                                            : "✓ Yes, Problem is Solved"}

                                                    </button>

                                                </div>

                                            </div>

                                        )}


                                        {/* =================================================
                                            RESOLVED
                                        ================================================= */}

                                        {isResolved && (

                                            <div
                                                style={{
                                                    marginTop:
                                                        "20px",
                                                    padding:
                                                        "20px",
                                                    background:
                                                        "#f0fdf4",
                                                    border:
                                                        "1px solid #bbf7d0",
                                                    borderRadius:
                                                        "15px",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "flex-start",
                                                    gap:
                                                        "14px"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        width:
                                                            "42px",
                                                        height:
                                                            "42px",
                                                        borderRadius:
                                                            "12px",
                                                        background:
                                                            "#16a34a",
                                                        color:
                                                            "#ffffff",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        fontSize:
                                                            "20px",
                                                        flexShrink:
                                                            0
                                                    }}
                                                >
                                                    ✓
                                                </div>


                                                <div>

                                                    <strong
                                                        style={{
                                                            display:
                                                                "block",
                                                            color:
                                                                "#15803d",
                                                            fontSize:
                                                                "17px",
                                                            marginBottom:
                                                                "5px"
                                                        }}
                                                    >
                                                        Resolution Verified
                                                    </strong>


                                                    <p
                                                        style={{
                                                            margin:
                                                                0,
                                                            color:
                                                                "#475569",
                                                            lineHeight:
                                                                1.6
                                                        }}
                                                    >
                                                        You confirmed that the
                                                        civic problem has been
                                                        resolved.
                                                    </p>

                                                </div>

                                            </div>

                                        )}


                                        {/* =================================================
                                            TRACKING
                                        ================================================= */}

                                        <div
                                            style={{
                                                marginTop:
                                                    "25px"
                                            }}
                                        >

                                            <div
                                                className="tracking-title"
                                            >
                                                REPORT PROGRESS
                                            </div>


                                            <div
                                                className="tracking"
                                            >

                                                <div
                                                    className="tracking-line"
                                                >

                                                    <span
                                                        style={{
                                                            width:
                                                                `${Math.min(
                                                                    (progress /
                                                                        statusSteps.length) *
                                                                        100,
                                                                    100
                                                                )}%`
                                                        }}
                                                    />

                                                </div>


                                                <div
                                                    className="tracking-steps"
                                                >

                                                    {statusSteps.map(
                                                        (
                                                            step,
                                                            stepIndex
                                                        ) => (

                                                        <div
                                                            className={
                                                                `tracking-step ${
                                                                    stepIndex <
                                                                    progress
                                                                        ? "completed"
                                                                        : ""
                                                                }`
                                                            }
                                                            key={step}
                                                        >

                                                            <div>

                                                                {
                                                                    stepIndex <
                                                                    progress
                                                                        ? "✓"
                                                                        : stepIndex + 1
                                                                }

                                                            </div>


                                                            <span>
                                                                {step}
                                                            </span>

                                                        </div>

                                                    )
                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    </article>

                                );

                            }
                        )}

                    </div>

                )}

            </main>

        </div>

    );
}


export default Reports;