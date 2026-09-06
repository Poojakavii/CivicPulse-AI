import { useEffect, useMemo, useState } from "react";
import { getReports } from "../services/api";

function Dashboard() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedSection, setSelectedSection] = useState("total");
    const [updatingId, setUpdatingId] = useState(null);

    // =====================================================
    // CURRENT CITIZEN
    // =====================================================

    const user = JSON.parse(
        localStorage.getItem("civicpulse_user") || "{}"
    );

    const currentUserId =
        user.id ??
        user.user_id ??
        user.citizen_id ??
        null;

    // =====================================================
    // STATUS STORAGE
    // =====================================================

    function getStoredStatuses() {
        try {
            return JSON.parse(
                localStorage.getItem(
                    "civicPulseReportStatuses"
                ) || "{}"
            );
        } catch {
            return {};
        }
    }

    // =====================================================
    // GET EFFECTIVE REPORT STATUS
    // =====================================================

    function getStatus(report) {
        const statuses = getStoredStatuses();

        const savedStatus =
            statuses[String(report.id)];

        if (savedStatus) {
            return String(savedStatus)
                .trim()
                .toLowerCase();
        }

        return String(
            report.status || "Reported"
        )
            .trim()
            .toLowerCase();
    }

    // =====================================================
    // DISPLAY STATUS
    // =====================================================

    function getDisplayStatus(report) {
        const status = getStatus(report);

        if (status === "action taken") {
            return "Action Taken";
        }

        if (status === "resolved") {
            return "Resolved";
        }

        if (
            status === "reported" ||
            status === "submitted" ||
            status === "pending"
        ) {
            return "Reported";
        }

        return "Reported";
    }

    // =====================================================
    // NORMALIZE RISK
    // =====================================================

    function getRisk(report) {
        return String(
            report.risk_level ||
            report.risk ||
            "Under Review"
        )
            .trim()
            .toUpperCase();
    }

    // =====================================================
    // CHECK REPORT OWNER
    // =====================================================

    function isMyReport(report) {
        if (!currentUserId) {
            return false;
        }

        const reportUserId =
            report.citizen_id ??
            report.user_id ??
            report.userId ??
            report.created_by;

        if (
            reportUserId === undefined ||
            reportUserId === null
        ) {
            return false;
        }

        return (
            String(reportUserId) ===
            String(currentUserId)
        );
    }

    // =====================================================
    // LOAD REPORTS
    // =====================================================

    async function loadReports() {
        try {
            setError("");

            const response = await getReports();

            const backendReports =
                Array.isArray(response)
                    ? response
                    : response?.reports || [];

            // -------------------------------------------------
            // LOCAL REPORTS
            // -------------------------------------------------

            let localReports = [];

            try {
                localReports = JSON.parse(
                    localStorage.getItem(
                        "civicpulse_reports"
                    ) || "[]"
                );
            } catch {
                localReports = [];
            }

            // -------------------------------------------------
            // MERGE BACKEND + LOCAL
            // -------------------------------------------------

            const combined = [
                ...backendReports,
                ...localReports
            ];

            const uniqueReports =
                Array.from(
                    new Map(
                        combined.map((report) => {
                            const id =
                                report.id ??
                                `${report.category}-${report.location}-${report.description}`;

                            return [
                                String(id),
                                report
                            ];
                        })
                    ).values()
                );

            // -------------------------------------------------
            // APPLY LOCAL STATUS STORAGE
            // -------------------------------------------------

            const statuses =
                getStoredStatuses();

            const finalReports =
                uniqueReports.map((report) => {
                    const savedStatus =
                        statuses[
                            String(report.id)
                        ];

                    if (savedStatus) {
                        return {
                            ...report,
                            status: savedStatus
                        };
                    }

                    return report;
                });

            setReports(finalReports);

        } catch (err) {
            console.error(
                "Dashboard reports error:",
                err
            );

            // -------------------------------------------------
            // FALLBACK TO LOCAL REPORTS
            // -------------------------------------------------

            try {
                const localReports =
                    JSON.parse(
                        localStorage.getItem(
                            "civicpulse_reports"
                        ) || "[]"
                    );

                const statuses =
                    getStoredStatuses();

                const updatedReports =
                    localReports.map(
                        (report) => {
                            const savedStatus =
                                statuses[
                                    String(report.id)
                                ];

                            if (savedStatus) {
                                return {
                                    ...report,
                                    status: savedStatus
                                };
                            }

                            return report;
                        }
                    );

                setReports(
                    updatedReports
                );

            } catch {
                setReports([]);
            }

            setError(
                "Unable to load live reports from CivicPulse."
            );

        } finally {
            setLoading(false);
        }
    }

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadReports();

        // Refresh reports periodically
        const interval =
            setInterval(() => {
                loadReports();
            }, 2000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    // =====================================================
    // LISTEN FOR LOCAL STORAGE CHANGES
    // =====================================================

    useEffect(() => {
        function handleStorageChange(event) {
            if (
                event.key ===
                "civicPulseReportStatuses"
            ) {
                loadReports();
            }

            if (
                event.key ===
                "civicpulse_reports"
            ) {
                loadReports();
            }
        }

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };
    }, []);

    // =====================================================
    // STATISTICS
    // =====================================================

    const statistics = useMemo(() => {
        const total =
            reports.length;

        const resolved =
            reports.filter(
                (report) =>
                    getStatus(report) ===
                    "resolved"
            ).length;

        const highRisk =
            reports.filter(
                (report) =>
                    getRisk(report)
                        .includes("HIGH")
            ).length;

        const locationCounts = {};

        reports.forEach((report) => {
            const location =
                String(
                    report.location || ""
                ).trim();

            if (!location) {
                return;
            }

            locationCounts[location] =
                (locationCounts[location] || 0) +
                1;
        });

        const hotspots =
            Object.entries(
                locationCounts
            ).filter(
                ([, count]) =>
                    count >= 2
            ).length;

        return {
            total,
            resolved,
            highRisk,
            hotspots
        };
    }, [reports]);

    // =====================================================
    // REPORTS SHOWN WHEN CARD CLICKED
    // =====================================================

    const visibleReports = useMemo(() => {
        switch (selectedSection) {
            case "resolved":
                return reports.filter(
                    (report) =>
                        getStatus(report) ===
                        "resolved"
                );

            case "high":
                return reports.filter(
                    (report) =>
                        getRisk(report)
                            .includes("HIGH")
                );

            case "hotspots": {
                const locationCounts = {};

                reports.forEach((report) => {
                    const location =
                        String(
                            report.location || ""
                        ).trim();

                    if (!location) {
                        return;
                    }

                    locationCounts[location] =
                        (locationCounts[location] || 0) +
                        1;
                });

                return reports.filter(
                    (report) => {
                        const location =
                            String(
                                report.location || ""
                            ).trim();

                        return (
                            location &&
                            locationCounts[
                                location
                            ] >= 2
                        );
                    }
                );
            }

            case "total":
            default:
                return reports;
        }
    }, [
        reports,
        selectedSection
    ]);

    // =====================================================
    // SAVE RESOLVED STATUS
    // =====================================================

    function saveResolvedStatus(reportId) {
        try {
            const statuses =
                getStoredStatuses();

            statuses[String(reportId)] =
                "Resolved";

            localStorage.setItem(
                "civicPulseReportStatuses",
                JSON.stringify(statuses)
            );

            // Also update local reports
            const localReports =
                JSON.parse(
                    localStorage.getItem(
                        "civicpulse_reports"
                    ) || "[]"
                );

            const updatedLocalReports =
                localReports.map(
                    (report) => {
                        if (
                            String(report.id) ===
                            String(reportId)
                        ) {
                            return {
                                ...report,
                                status: "Resolved"
                            };
                        }

                        return report;
                    }
                );

            localStorage.setItem(
                "civicpulse_reports",
                JSON.stringify(
                    updatedLocalReports
                )
            );

        } catch (err) {
            console.error(
                "Resolved status save failed:",
                err
            );
        }
    }

    // =====================================================
    // CITIZEN VERIFICATION
    // =====================================================

    async function verifyResolution(report) {
        if (!report.id) {
            alert(
                "This report does not have a valid ID."
            );
            return;
        }

        if (!isMyReport(report)) {
            alert(
                "Only the citizen who submitted this report can verify it."
            );
            return;
        }

        const status =
            getStatus(report);

        // Citizen cannot resolve before officer action
        if (
            status !==
            "action taken"
        ) {
            alert(
                "The officer must take action before you can verify the resolution."
            );
            return;
        }

        const confirmed =
            window.confirm(
                "Has the officer's action actually solved the civic problem?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setUpdatingId(
                report.id
            );

            // Immediately update screen
            setReports(
                (previousReports) =>
                    previousReports.map(
                        (item) => {
                            if (
                                String(
                                    item.id
                                ) ===
                                String(
                                    report.id
                                )
                            ) {
                                return {
                                    ...item,
                                    status: "Resolved"
                                };
                            }

                            return item;
                        }
                    )
            );

            // Save status
            saveResolvedStatus(
                report.id
            );

        } catch (err) {
            console.error(
                "Verification error:",
                err
            );

            alert(
                "Unable to verify this report."
            );

        } finally {
            setUpdatingId(null);
        }
    }

    // =====================================================
    // CARD CLICK
    // =====================================================

    function selectSection(section) {
        setSelectedSection(
            section
        );

        window.scrollTo({
            top: 430,
            behavior: "smooth"
        });
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-heading">
                    <div className="badge">
                        CIVIC INTELLIGENCE
                    </div>

                    <h1>
                        Community Dashboard
                    </h1>

                    <p>
                        Loading real civic reports...
                    </p>
                </div>
            </main>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main className="dashboard-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="dashboard-heading">

                <div className="badge">
                    CIVIC INTELLIGENCE
                </div>

                <h1>
                    Community Dashboard
                </h1>

                <p>
                    Explore real citizen reports,
                    track civic problems and verify
                    completed issues.
                </p>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div
                    className="error-box"
                    style={{
                        marginBottom: "20px"
                    }}
                >
                    ⚠️ {error}
                </div>
            )}

            {/* =================================================
                STAT CARDS
            ================================================= */}

            <section className="stats-grid">

                {/* TOTAL */}

                <button
                    type="button"
                    className={
                        selectedSection === "total"
                            ? "stat-card dashboard-stat active"
                            : "stat-card dashboard-stat"
                    }
                    onClick={() =>
                        selectSection("total")
                    }
                >
                    <span>📋</span>

                    <small>
                        TOTAL REPORTS
                    </small>

                    <strong>
                        {statistics.total}
                    </strong>

                    <em>
                        View all reports →
                    </em>
                </button>

                {/* RESOLVED */}

                <button
                    type="button"
                    className={
                        selectedSection === "resolved"
                            ? "stat-card dashboard-stat active"
                            : "stat-card dashboard-stat"
                    }
                    onClick={() =>
                        selectSection(
                            "resolved"
                        )
                    }
                >
                    <span>✅</span>

                    <small>
                        RESOLVED
                    </small>

                    <strong>
                        {statistics.resolved}
                    </strong>

                    <em>
                        View resolved issues →
                    </em>
                </button>

                {/* HIGH RISK */}

                <button
                    type="button"
                    className={
                        selectedSection === "high"
                            ? "stat-card dashboard-stat danger active"
                            : "stat-card dashboard-stat danger"
                    }
                    onClick={() =>
                        selectSection("high")
                    }
                >
                    <span>🔴</span>

                    <small>
                        HIGH RISK
                    </small>

                    <strong>
                        {statistics.highRisk}
                    </strong>

                    <em>
                        View high-risk issues →
                    </em>
                </button>

                {/* HOTSPOTS */}

                <button
                    type="button"
                    className={
                        selectedSection ===
                        "hotspots"
                            ? "stat-card dashboard-stat active"
                            : "stat-card dashboard-stat"
                    }
                    onClick={() =>
                        selectSection(
                            "hotspots"
                        )
                    }
                >
                    <span>📍</span>

                    <small>
                        EMERGING HOTSPOTS
                    </small>

                    <strong>
                        {statistics.hotspots}
                    </strong>

                    <em>
                        View hotspot reports →
                    </em>
                </button>

            </section>

            {/* =================================================
                REPORT SECTION
            ================================================= */}

            <section
                className="dashboard-reports-section"
                style={{
                    marginTop: "35px"
                }}
            >

                {/* SECTION HEADER */}

                <div
                    className="dashboard-reports-header"
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        gap: "20px",
                        marginBottom:
                            "20px",
                        flexWrap:
                            "wrap"
                    }}
                >

                    <div>

                        <div className="badge">
                            LIVE REPORTS
                        </div>

                        <h2
                            style={{
                                marginTop:
                                    "8px"
                            }}
                        >
                            {selectedSection ===
                                "total" &&
                                "All Civic Reports"}

                            {selectedSection ===
                                "resolved" &&
                                "Resolved Reports"}

                            {selectedSection ===
                                "high" &&
                                "High-Risk Reports"}

                            {selectedSection ===
                                "hotspots" &&
                                "Reports in Emerging Hotspots"}
                        </h2>

                    </div>

                    <div
                        style={{
                            fontWeight: "700",
                            fontSize: "15px"
                        }}
                    >
                        {visibleReports.length}{" "}
                        report
                        {visibleReports.length !==
                        1
                            ? "s"
                            : ""}
                    </div>

                </div>

                {/* =================================================
                    NO REPORTS
                ================================================= */}

                {visibleReports.length ===
                0 ? (
                    <div
                        className="dashboard-card"
                        style={{
                            padding: "45px",
                            textAlign:
                                "center"
                        }}
                    >
                        <div
                            style={{
                                fontSize:
                                    "45px"
                            }}
                        >
                            📭
                        </div>

                        <h3>
                            No reports in this
                            section
                        </h3>

                        <p>
                            CivicPulse has no
                            reports matching
                            this category yet.
                        </p>
                    </div>
                ) : (

                    /* =================================================
                       REPORT CARDS
                    ================================================= */

                    <div
                        className="civic-report-list"
                        style={{
                            display:
                                "grid",
                            gap: "18px"
                        }}
                    >

                        {visibleReports.map(
                            (
                                report,
                                index
                            ) => {

                                const status =
                                    getStatus(
                                        report
                                    );

                                const displayStatus =
                                    getDisplayStatus(
                                        report
                                    );

                                const risk =
                                    getRisk(
                                        report
                                    );

                                const mine =
                                    isMyReport(
                                        report
                                    );

                                const isReported =
                                    status ===
                                        "reported" ||
                                    status ===
                                        "submitted" ||
                                    status ===
                                        "pending";

                                const isActionTaken =
                                    status ===
                                    "action taken";

                                const isResolved =
                                    status ===
                                    "resolved";

                                return (
                                    <article
                                        className="dashboard-card civic-report-card"
                                        key={
                                            report.id ??
                                            index
                                        }
                                        style={{
                                            padding:
                                                "24px",
                                            borderRadius:
                                                "18px"
                                        }}
                                    >

                                        {/* =================================================
                                            REPORT TOP
                                        ================================================= */}

                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "flex-start",
                                                gap:
                                                    "15px",
                                                flexWrap:
                                                    "wrap"
                                            }}
                                        >

                                            <div>

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "13px",
                                                        fontWeight:
                                                            "800",
                                                        textTransform:
                                                            "uppercase",
                                                        letterSpacing:
                                                            "1px"
                                                    }}
                                                >
                                                    {report.category ||
                                                        "Civic Issue"}
                                                </div>

                                                <h3
                                                    style={{
                                                        margin:
                                                            "7px 0"
                                                    }}
                                                >
                                                    {report.problem ||
                                                        report.title ||
                                                        report.category ||
                                                        "Civic Problem"}
                                                </h3>

                                            </div>

                                            {/* =================================================
                                                STATUS BADGE
                                            ================================================= */}

                                            <span
                                                style={{
                                                    padding:
                                                        "8px 14px",
                                                    borderRadius:
                                                        "999px",
                                                    fontSize:
                                                        "12px",
                                                    fontWeight:
                                                        "900",
                                                    background:
                                                        isResolved
                                                            ? "#dcfce7"
                                                            : isActionTaken
                                                            ? "#dbeafe"
                                                            : "#fef3c7",
                                                    color:
                                                        isResolved
                                                            ? "#166534"
                                                            : isActionTaken
                                                            ? "#1d4ed8"
                                                            : "#92400e"
                                                }}
                                            >
                                                {isResolved
                                                    ? "✓ RESOLVED"
                                                    : isActionTaken
                                                    ? "🛠️ ACTION TAKEN"
                                                    : "● REPORTED"}
                                            </span>

                                        </div>

                                        {/* =================================================
                                            LOCATION
                                        ================================================= */}

                                        <div
                                            style={{
                                                marginTop:
                                                    "12px",
                                                fontWeight:
                                                    "600"
                                            }}
                                        >
                                            📍{" "}
                                            {report.location ||
                                                "Location not provided"}
                                        </div>

                                        {/* =================================================
                                            DESCRIPTION
                                        ================================================= */}

                                        <p
                                            style={{
                                                lineHeight:
                                                    "1.7",
                                                marginTop:
                                                    "12px"
                                            }}
                                        >
                                            {report.description ||
                                                "No description provided."}
                                        </p>

                                        {/* =================================================
                                            DETAILS
                                        ================================================= */}

                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                gap:
                                                    "10px",
                                                flexWrap:
                                                    "wrap",
                                                marginTop:
                                                    "15px"
                                            }}
                                        >

                                            <span
                                                style={{
                                                    padding:
                                                        "7px 11px",
                                                    borderRadius:
                                                        "8px",
                                                    background:
                                                        "#f1f5f9",
                                                    fontSize:
                                                        "13px"
                                                }}
                                            >
                                                🚦 Status:{" "}
                                                <strong>
                                                    {
                                                        displayStatus
                                                    }
                                                </strong>
                                            </span>

                                            <span
                                                style={{
                                                    padding:
                                                        "7px 11px",
                                                    borderRadius:
                                                        "8px",
                                                    background:
                                                        risk.includes(
                                                            "HIGH"
                                                        )
                                                            ? "#fee2e2"
                                                            : "#f1f5f9",
                                                    fontSize:
                                                        "13px"
                                                }}
                                            >
                                                ⚠️ Risk:{" "}
                                                <strong>
                                                    {report.risk_level ||
                                                        report.risk ||
                                                        "Under Review"}
                                                </strong>
                                            </span>

                                            {report.id && (
                                                <span
                                                    style={{
                                                        padding:
                                                            "7px 11px",
                                                        borderRadius:
                                                            "8px",
                                                        background:
                                                            "#f1f5f9",
                                                        fontSize:
                                                            "13px"
                                                    }}
                                                >
                                                    ID:{" "}
                                                    <strong>
                                                        #
                                                        {
                                                            report.id
                                                        }
                                                    </strong>
                                                </span>
                                            )}

                                        </div>

                                        {/* =================================================
                                            OFFICER ACTION / CITIZEN VERIFICATION
                                        ================================================= */}

                                        {mine && (
                                            <div
                                                style={{
                                                    marginTop:
                                                        "22px",
                                                    padding:
                                                        "18px",
                                                    borderRadius:
                                                        "14px",
                                                    background:
                                                        isResolved
                                                            ? "#ecfdf5"
                                                            : isActionTaken
                                                            ? "#eff6ff"
                                                            : "#fff7ed",
                                                    border:
                                                        isResolved
                                                            ? "1px solid #86efac"
                                                            : isActionTaken
                                                            ? "1px solid #93c5fd"
                                                            : "1px solid #fed7aa"
                                                }}
                                            >

                                                {/* =================================================
                                                    REPORTED - WAITING FOR OFFICER
                                                ================================================= */}

                                                {isReported && (
                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            gap:
                                                                "14px"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "28px"
                                                            }}
                                                        >
                                                            ⏳
                                                        </div>

                                                        <div>
                                                            <strong
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    color:
                                                                        "#9a3412",
                                                                    fontSize:
                                                                        "15px"
                                                                }}
                                                            >
                                                                Waiting for officer action
                                                            </strong>

                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "5px 0 0",
                                                                    fontSize:
                                                                        "13px",
                                                                    color:
                                                                        "#64748b"
                                                                }}
                                                            >
                                                                Your report has been submitted successfully. An officer has not marked action as taken yet.
                                                            </p>
                                                        </div>

                                                    </div>
                                                )}

                                                {/* =================================================
                                                    ACTION TAKEN - IMPORTANT MESSAGE
                                                ================================================= */}

                                                {isActionTaken && (
                                                    <div>

                                                        <div
                                                            style={{
                                                                display:
                                                                    "flex",
                                                                justifyContent:
                                                                    "space-between",
                                                                alignItems:
                                                                    "center",
                                                                gap:
                                                                    "15px",
                                                                flexWrap:
                                                                    "wrap"
                                                            }}
                                                        >

                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    gap:
                                                                        "14px"
                                                                }}
                                                            >

                                                                <div
                                                                    style={{
                                                                        fontSize:
                                                                            "30px"
                                                                    }}
                                                                >
                                                                    🛠️
                                                                </div>

                                                                <div>
                                                                    <strong
                                                                        style={{
                                                                            display:
                                                                                "block",
                                                                            color:
                                                                                "#1d4ed8",
                                                                            fontSize:
                                                                                "16px"
                                                                        }}
                                                                    >
                                                                        Action Taken by Officer
                                                                    </strong>

                                                                    <p
                                                                        style={{
                                                                            margin:
                                                                                "5px 0 0",
                                                                            fontSize:
                                                                                "13px",
                                                                            color:
                                                                                "#475569"
                                                                        }}
                                                                    >
                                                                        An officer has taken action on your reported civic problem.
                                                                    </p>
                                                                </div>

                                                            </div>

                                                            <span
                                                                style={{
                                                                    padding:
                                                                        "8px 12px",
                                                                    borderRadius:
                                                                        "999px",
                                                                    background:
                                                                        "#dbeafe",
                                                                    color:
                                                                        "#1d4ed8",
                                                                    fontWeight:
                                                                        "900",
                                                                    fontSize:
                                                                        "11px"
                                                                }}
                                                            >
                                                                OFFICER ACTION
                                                            </span>

                                                        </div>

                                                        {/* VERIFICATION */}

                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    "15px",
                                                                paddingTop:
                                                                    "15px",
                                                                borderTop:
                                                                    "1px solid #bfdbfe",
                                                                display:
                                                                    "flex",
                                                                justifyContent:
                                                                    "space-between",
                                                                alignItems:
                                                                    "center",
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
                                                                            "#334155"
                                                                    }}
                                                                >
                                                                    👤 Your verification is required
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
                                                                    Check the real-world problem. If it is actually fixed, verify the resolution.
                                                                </p>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    verifyResolution(
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
                                                                    cursor:
                                                                        updatingId ===
                                                                        report.id
                                                                            ? "not-allowed"
                                                                            : "pointer",
                                                                    fontWeight:
                                                                        "900",
                                                                    boxShadow:
                                                                        "0 5px 15px rgba(37,99,235,.20)"
                                                                }}
                                                            >
                                                                {updatingId ===
                                                                report.id
                                                                    ? "Verifying..."
                                                                    : "✓ Verify Resolution"}
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
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            gap:
                                                                "14px"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "30px"
                                                            }}
                                                        >
                                                            ✅
                                                        </div>

                                                        <div>
                                                            <strong
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    color:
                                                                        "#15803d",
                                                                    fontSize:
                                                                        "16px"
                                                                }}
                                                            >
                                                                Resolution Verified
                                                            </strong>

                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "5px 0 0",
                                                                    fontSize:
                                                                        "13px",
                                                                    color:
                                                                        "#475569"
                                                                }}
                                                            >
                                                                You confirmed that the officer's action actually solved this civic problem.
                                                            </p>
                                                        </div>

                                                    </div>
                                                )}

                                            </div>
                                        )}

                                        {/* =================================================
                                            NON-OWNER INFORMATION
                                        ================================================= */}

                                        {!mine &&
                                            isActionTaken && (
                                                <div
                                                    style={{
                                                        marginTop:
                                                            "20px",
                                                        padding:
                                                            "14px 16px",
                                                        borderRadius:
                                                            "12px",
                                                        background:
                                                            "#eff6ff",
                                                        border:
                                                            "1px solid #bfdbfe",
                                                        color:
                                                            "#1e40af",
                                                        fontSize:
                                                            "13px"
                                                    }}
                                                >
                                                    🛠️{" "}
                                                    <strong>
                                                        Officer Action Taken:
                                                    </strong>{" "}
                                                    Civic action has been taken on this report. The original reporter is responsible for verifying the resolution.
                                                </div>
                                            )}

                                        {!mine &&
                                            isResolved && (
                                                <div
                                                    style={{
                                                        marginTop:
                                                            "20px",
                                                        padding:
                                                            "14px 16px",
                                                        borderRadius:
                                                            "12px",
                                                        background:
                                                            "#ecfdf5",
                                                        border:
                                                            "1px solid #bbf7d0",
                                                        color:
                                                            "#166534",
                                                        fontSize:
                                                            "13px"
                                                    }}
                                                >
                                                    ✓{" "}
                                                    <strong>
                                                        Verified Resolution:
                                                    </strong>{" "}
                                                    The citizen who submitted this report confirmed that the problem was resolved.
                                                </div>
                                            )}

                                    </article>
                                );
                            }
                        )}

                    </div>
                )}

            </section>

            {/* =================================================
                MOST REPORTED PROBLEMS
            ================================================= */}

            <section
                className="dashboard-grid"
                style={{
                    marginTop: "35px"
                }}
            >

                <div className="dashboard-card">

                    <h2>
                        Most Reported Problems
                    </h2>

                    {reports.length === 0 ? (
                        <p className="empty">
                            No reports yet.
                        </p>
                    ) : (
                        Object.entries(
                            reports.reduce(
                                (
                                    result,
                                    report
                                ) => {
                                    const category =
                                        report.category ||
                                        "Other";

                                    result[
                                        category
                                    ] =
                                        (result[
                                            category
                                        ] || 0) + 1;

                                    return result;
                                },
                                {}
                            )
                        )
                            .sort(
                                (a, b) =>
                                    b[1] -
                                    a[1]
                            )
                            .map(
                                ([
                                    category,
                                    count
                                ]) => (
                                    <div
                                        className="problem-row"
                                        key={
                                            category
                                        }
                                    >
                                        <span>
                                            {
                                                category
                                            }
                                        </span>

                                        <strong>
                                            {count}
                                        </strong>
                                    </div>
                                )
                            )
                    )}

                </div>

                {/* =================================================
                    HOTSPOTS
                ================================================= */}

                <div className="dashboard-card">

                    <h2>
                        📍 Emerging Hotspots
                    </h2>

                    {(() => {
                        const locationCounts =
                            {};

                        reports.forEach(
                            (report) => {
                                const location =
                                    String(
                                        report.location ||
                                            ""
                                    ).trim();

                                if (!location) {
                                    return;
                                }

                                locationCounts[
                                    location
                                ] =
                                    (locationCounts[
                                        location
                                    ] || 0) + 1;
                            }
                        );

                        const hotspots =
                            Object.entries(
                                locationCounts
                            )
                                .filter(
                                    ([, count]) =>
                                        count >=
                                        2
                                )
                                .sort(
                                    (a, b) =>
                                        b[1] -
                                        a[1]
                                );

                        if (
                            hotspots.length ===
                            0
                        ) {
                            return (
                                <p className="empty">
                                    No emerging
                                    hotspots
                                    detected
                                    yet.
                                </p>
                            );
                        }

                        return hotspots.map(
                            ([
                                location,
                                count
                            ]) => (
                                <div
                                    className="problem-row"
                                    key={
                                        location
                                    }
                                >
                                    <span>
                                        📍{" "}
                                        {
                                            location
                                        }
                                    </span>

                                    <strong>
                                        {count}{" "}
                                        reports
                                    </strong>
                                </div>
                            )
                        );
                    })()}

                </div>

            </section>

            {/* =================================================
                WORKFLOW EXPLANATION
            ================================================= */}

            <section
                className="dashboard-card"
                style={{
                    marginTop: "30px",
                    padding: "24px"
                }}
            >

                <h2>
                    🔄 CivicPulse Resolution Workflow
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(3, minmax(0, 1fr))",
                        gap: "15px",
                        marginTop: "18px"
                    }}
                >

                    <div
                        style={{
                            padding: "18px",
                            borderRadius:
                                "12px",
                            background:
                                "#fff7ed",
                            border:
                                "1px solid #fed7aa"
                        }}
                    >
                        <strong>
                            01. Reported
                        </strong>

                        <p
                            style={{
                                fontSize:
                                    "13px",
                                lineHeight:
                                    "1.6",
                                color:
                                    "#64748b"
                            }}
                        >
                            Citizen submits a
                            civic complaint.
                        </p>
                    </div>

                    <div
                        style={{
                            padding: "18px",
                            borderRadius:
                                "12px",
                            background:
                                "#eff6ff",
                            border:
                                "1px solid #bfdbfe"
                        }}
                    >
                        <strong>
                            02. Action Taken
                        </strong>

                        <p
                            style={{
                                fontSize:
                                    "13px",
                                lineHeight:
                                    "1.6",
                                color:
                                    "#64748b"
                            }}
                        >
                            Officer takes
                            action and the
                            citizen is informed.
                        </p>
                    </div>

                    <div
                        style={{
                            padding: "18px",
                            borderRadius:
                                "12px",
                            background:
                                "#ecfdf5",
                            border:
                                "1px solid #bbf7d0"
                        }}
                    >
                        <strong>
                            03. Verified Resolution
                        </strong>

                        <p
                            style={{
                                fontSize:
                                    "13px",
                                lineHeight:
                                    "1.6",
                                color:
                                    "#64748b"
                            }}
                        >
                            Citizen verifies
                            that the problem
                            was actually solved.
                        </p>
                    </div>

                </div>

            </section>

            {/* =================================================
                IMPORTANT NOTE
            ================================================= */}

            <div
                style={{
                    marginTop: "30px",
                    padding: "18px",
                    borderRadius: "14px",
                    background:
                        "#f8fafc",
                    fontSize: "13px",
                    lineHeight: "1.6"
                }}
            >
                💡{" "}
                <strong>
                    CivicPulse verification:
                </strong>{" "}
                A report becomes
                <strong>
                    {" "}Resolved
                </strong>{" "}
                only after the officer marks
                <strong>
                    {" "}Action Taken
                </strong>{" "}
                and the citizen who submitted
                the report verifies the result.
            </div>

        </main>
    );
}

export default Dashboard;