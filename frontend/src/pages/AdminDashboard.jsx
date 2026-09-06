import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getReports } from "../services/api";

function AdminDashboard() {
    const navigate = useNavigate();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [updating, setUpdating] = useState(null);

    // =====================================================
    // STATUS STORAGE
    // =====================================================

    function getStoredStatuses() {
        try {
            return JSON.parse(
                localStorage.getItem("civicPulseReportStatuses") || "{}"
            );
        } catch {
            return {};
        }
    }

    function getReportStatus(report) {
        const statuses = getStoredStatuses();

        const savedStatus = statuses[String(report.id)];

        if (savedStatus) {
            return savedStatus;
        }

        // Backend status if available
        if (report.status) {
            return report.status;
        }

        return "Reported";
    }

    function markActionTaken(reportId) {
        const statuses = getStoredStatuses();

        statuses[String(reportId)] = "Action Taken";

        localStorage.setItem(
            "civicPulseReportStatuses",
            JSON.stringify(statuses)
        );
    }

    // =====================================================
    // AUTHENTICATION
    // =====================================================

    useEffect(() => {
        if (localStorage.getItem("adminLoggedIn") !== "true") {
            navigate("/admin-login");
            return;
        }

        loadReports();
    }, [navigate]);

    // =====================================================
    // LOAD REPORTS
    // =====================================================

    async function loadReports() {
        try {
            setLoading(true);

            const response = await getReports();

            const backendReports = Array.isArray(response)
                ? response
                : response?.reports || [];

            setReports(backendReports);
        } catch (error) {
            console.error("Failed to load reports:", error);
        } finally {
            setLoading(false);
        }
    }

    // =====================================================
    // LOGOUT
    // =====================================================

    function logout() {
        localStorage.removeItem("adminLoggedIn");
        navigate("/admin-login");
    }

    // =====================================================
    // OFFICER ACTION
    // =====================================================

    function handleActionTaken(report) {
        const confirmed = window.confirm(
            "Mark this report as Action Taken?\n\nThe citizen will then be asked to verify whether the problem has actually been resolved."
        );

        if (!confirmed) {
            return;
        }

        setUpdating(report.id);

        try {
            markActionTaken(report.id);

            setReports((previous) =>
                previous.map((item) => {
                    if (
                        String(item.id) === String(report.id)
                    ) {
                        return {
                            ...item,
                            status: "Action Taken",
                        };
                    }

                    return item;
                })
            );
        } catch (error) {
            console.error("Status update failed:", error);
        } finally {
            setUpdating(null);
        }
    }

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalReports = reports.length;

    const resolvedReports = reports.filter(
        (report) =>
            getReportStatus(report) === "Resolved"
    ).length;

    const actionTakenReports = reports.filter(
        (report) =>
            getReportStatus(report) === "Action Taken"
    ).length;

    const pendingReports = reports.filter((report) => {
        const status = getReportStatus(report);

        return (
            status === "Reported" ||
            status === "Pending"
        );
    }).length;

    const highRiskReports = reports.filter((report) => {
        const risk = String(
            report.risk_level ||
            report.risk ||
            ""
        ).toLowerCase();

        return (
            risk === "high" ||
            risk === "critical"
        );
    }).length;

    // =====================================================
    // FILTER
    // =====================================================

    const filteredReports = useMemo(() => {
        if (filter === "All") {
            return reports;
        }

        return reports.filter(
            (report) =>
                getReportStatus(report) === filter
        );
    }, [reports, filter]);

    // =====================================================
    // STATUS CLASS
    // =====================================================

    function statusClass(status) {
        return status
            .toLowerCase()
            .replace(/\s+/g, "-");
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#f4f7fb",
                color: "#172033",
                fontFamily:
                    "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <header
                style={{
                    background: "#ffffff",
                    borderBottom: "1px solid #e5eaf0",
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                }}
            >
                <div
                    style={{
                        maxWidth: "1280px",
                        width: "92%",
                        margin: "0 auto",
                        minHeight: "78px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "25px",
                    }}
                >

                    {/* BRAND */}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            minWidth: 0,
                        }}
                    >
                        <div
                            style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "12px",
                                background:
                                    "linear-gradient(135deg,#173b63,#2563eb)",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "900",
                                fontSize: "15px",
                                flexShrink: 0,
                            }}
                        >
                            CP
                        </div>

                        <div>
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "19px",
                                    color: "#173b63",
                                }}
                            >
                                CivicPulse{" "}
                                <span
                                    style={{
                                        color: "#2563eb",
                                    }}
                                >
                                    AI
                                </span>
                            </h2>

                            <p
                                style={{
                                    margin: "3px 0 0",
                                    fontSize: "10px",
                                    fontWeight: "800",
                                    letterSpacing: "1.2px",
                                    color: "#64748b",
                                }}
                            >
                                OFFICER CONTROL CENTER
                            </p>
                        </div>
                    </div>

                    {/* NAVIGATION */}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "9px",
                            flexWrap: "wrap",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Link
                            to="/pulse-map"
                            style={{
                                textDecoration: "none",
                                padding: "10px 14px",
                                borderRadius: "9px",
                                background: "#eff6ff",
                                color: "#1d4ed8",
                                fontWeight: "700",
                                fontSize: "13px",
                            }}
                        >
                            🗺️ Pulse Map
                        </Link>

                        <button
                            onClick={logout}
                            style={{
                                border: "none",
                                padding: "10px 15px",
                                borderRadius: "9px",
                                background: "#173b63",
                                color: "#ffffff",
                                fontWeight: "800",
                                cursor: "pointer",
                                fontSize: "13px",
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <section
                style={{
                    width: "92%",
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "42px 0 70px",
                }}
            >

                {/* PAGE TITLE */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        gap: "25px",
                        marginBottom: "30px",
                    }}
                >
                    <div>
                        <div
                            style={{
                                color: "#2563eb",
                                fontSize: "11px",
                                fontWeight: "900",
                                letterSpacing: "1.6px",
                            }}
                        >
                            CIVIC INTELLIGENCE
                        </div>

                        <h1
                            style={{
                                margin: "8px 0",
                                fontSize: "34px",
                                color: "#173b63",
                            }}
                        >
                            Officer Dashboard
                        </h1>

                        <p
                            style={{
                                margin: 0,
                                color: "#64748b",
                                maxWidth: "650px",
                                lineHeight: 1.6,
                            }}
                        >
                            Review citizen reports, take action,
                            and send completed work for citizen
                            verification.
                        </p>
                    </div>

                    <div
                        style={{
                            padding: "10px 15px",
                            background: "#ecfdf5",
                            border: "1px solid #bbf7d0",
                            color: "#166534",
                            borderRadius: "999px",
                            fontSize: "13px",
                            fontWeight: "800",
                            whiteSpace: "nowrap",
                        }}
                    >
                        🛡️ Authorized Officer
                    </div>
                </div>

                {/* =================================================
                    STAT CARDS
                ================================================= */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(4,minmax(0,1fr))",
                        gap: "16px",
                        marginBottom: "28px",
                    }}
                >

                    <StatCard
                        icon="📋"
                        number={totalReports}
                        title="Total Reports"
                        subtitle="All citizen reports"
                    />

                    <StatCard
                        icon="⏳"
                        number={pendingReports}
                        title="Awaiting Action"
                        subtitle="Needs officer attention"
                    />

                    <StatCard
                        icon="🛠️"
                        number={actionTakenReports}
                        title="Action Taken"
                        subtitle="Awaiting citizen verification"
                    />

                    <StatCard
                        icon="✓"
                        number={resolvedReports}
                        title="Resolved"
                        subtitle="Verified by citizen"
                    />

                </div>

                {/* =================================================
                    PRIORITY BAR
                ================================================= */}

                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e5eaf0",
                        borderRadius: "16px",
                        padding: "18px 22px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "35px",
                        boxShadow:
                            "0 5px 20px rgba(15,23,42,.04)",
                    }}
                >
                    <div>
                        <strong
                            style={{
                                color: "#173b63",
                            }}
                        >
                            ⚠️ High-priority civic issues
                        </strong>

                        <p
                            style={{
                                margin: "4px 0 0",
                                color: "#64748b",
                                fontSize: "13px",
                            }}
                        >
                            Reports classified as High or Critical risk.
                        </p>
                    </div>

                    <div
                        style={{
                            fontSize: "28px",
                            fontWeight: "900",
                            color: "#dc2626",
                        }}
                    >
                        {highRiskReports}
                    </div>
                </div>

                {/* =================================================
                    REPORT MANAGEMENT
                ================================================= */}

                <section>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            gap: "20px",
                            marginBottom: "20px",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    color: "#2563eb",
                                    fontSize: "11px",
                                    fontWeight: "900",
                                    letterSpacing: "1.5px",
                                }}
                            >
                                LIVE CIVIC REPORTS
                            </div>

                            <h2
                                style={{
                                    margin: "6px 0",
                                    color: "#173b63",
                                    fontSize: "24px",
                                }}
                            >
                                Report Management
                            </h2>

                            <p
                                style={{
                                    margin: 0,
                                    color: "#64748b",
                                    fontSize: "14px",
                                }}
                            >
                                Officer action → Citizen verification
                                → Verified resolution
                            </p>
                        </div>

                        <button
                            onClick={loadReports}
                            style={{
                                border: "1px solid #dbe3ec",
                                background: "#ffffff",
                                padding: "10px 15px",
                                borderRadius: "9px",
                                fontWeight: "800",
                                color: "#334155",
                                cursor: "pointer",
                            }}
                        >
                            ↻ Refresh
                        </button>
                    </div>

                    {/* FILTER */}

                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            marginBottom: "20px",
                            flexWrap: "wrap",
                        }}
                    >
                        {[
                            "All",
                            "Reported",
                            "Action Taken",
                            "Resolved",
                        ].map((item) => (
                            <button
                                key={item}
                                onClick={() => setFilter(item)}
                                style={{
                                    border: "1px solid #dbe3ec",
                                    background:
                                        filter === item
                                            ? "#173b63"
                                            : "#ffffff",
                                    color:
                                        filter === item
                                            ? "#ffffff"
                                            : "#475569",
                                    padding: "9px 15px",
                                    borderRadius: "999px",
                                    fontWeight: "800",
                                    cursor: "pointer",
                                }}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* LOADING */}

                    {loading && (
                        <div
                            style={{
                                background: "#ffffff",
                                borderRadius: "16px",
                                padding: "50px",
                                textAlign: "center",
                                color: "#64748b",
                            }}
                        >
                            Loading civic reports...
                        </div>
                    )}

                    {/* EMPTY */}

                    {!loading &&
                        filteredReports.length === 0 && (
                            <div
                                style={{
                                    background: "#ffffff",
                                    borderRadius: "16px",
                                    padding: "55px",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "35px",
                                    }}
                                >
                                    📭
                                </div>

                                <h3>
                                    No reports found
                                </h3>

                                <p
                                    style={{
                                        color: "#64748b",
                                    }}
                                >
                                    There are no reports in this category.
                                </p>
                            </div>
                        )}

                    {/* REPORT LIST */}

                    {!loading &&
                        filteredReports.length > 0 && (
                            <div
                                style={{
                                    display: "grid",
                                    gap: "16px",
                                }}
                            >
                                {filteredReports.map((report) => {
                                    const status =
                                        getReportStatus(report);

                                    const risk = String(
                                        report.risk_level ||
                                        report.risk ||
                                        "Unknown"
                                    );

                                    const isActionTaken =
                                        status === "Action Taken";

                                    const isResolved =
                                        status === "Resolved";

                                    return (
                                        <article
                                            key={report.id}
                                            style={{
                                                background: "#ffffff",
                                                border:
                                                    "1px solid #e3e8ef",
                                                borderRadius: "16px",
                                                padding: "22px",
                                                boxShadow:
                                                    "0 5px 20px rgba(15,23,42,.04)",
                                            }}
                                        >

                                            {/* TOP */}

                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: "15px",
                                                    alignItems:
                                                        "flex-start",
                                                }}
                                            >
                                                <div>
                                                    <span
                                                        style={{
                                                            color: "#2563eb",
                                                            fontSize: "11px",
                                                            fontWeight: "900",
                                                            textTransform:
                                                                "uppercase",
                                                        }}
                                                    >
                                                        {report.category ||
                                                            "Civic Issue"}
                                                    </span>

                                                    <h3
                                                        style={{
                                                            margin:
                                                                "7px 0 0",
                                                            color:
                                                                "#173b63",
                                                            fontSize:
                                                                "19px",
                                                        }}
                                                    >
                                                        {report.problem ||
                                                            report.description ||
                                                            "Civic Report"}
                                                    </h3>
                                                </div>

                                                <span
                                                    style={{
                                                        padding:
                                                            "7px 11px",
                                                        borderRadius:
                                                            "999px",
                                                        fontSize:
                                                            "12px",
                                                        fontWeight:
                                                            "800",
                                                        background:
                                                            status ===
                                                            "Resolved"
                                                                ? "#dcfce7"
                                                                : status ===
                                                                  "Action Taken"
                                                                ? "#eff6ff"
                                                                : "#fff7ed",
                                                        color:
                                                            status ===
                                                            "Resolved"
                                                                ? "#166534"
                                                                : status ===
                                                                  "Action Taken"
                                                                ? "#1d4ed8"
                                                                : "#9a3412",
                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    ● {status}
                                                </span>
                                            </div>

                                            {/* DESCRIPTION */}

                                            <p
                                                style={{
                                                    color:
                                                        "#475569",
                                                    lineHeight:
                                                        "1.6",
                                                    margin:
                                                        "12px 0 18px",
                                                }}
                                            >
                                                {report.description ||
                                                    "No description available."}
                                            </p>

                                            {/* DETAILS */}

                                            <div
                                                style={{
                                                    display:
                                                        "grid",
                                                    gridTemplateColumns:
                                                        "repeat(3,minmax(0,1fr))",
                                                    gap: "10px",
                                                    marginBottom:
                                                        "15px",
                                                }}
                                            >

                                                <Detail
                                                    icon="📍"
                                                    title="LOCATION"
                                                    value={
                                                        report.location ||
                                                        "Unknown"
                                                    }
                                                />

                                                <Detail
                                                    icon="⚠️"
                                                    title="RISK LEVEL"
                                                    value={risk}
                                                />

                                                <Detail
                                                    icon="🕐"
                                                    title="REPORTED"
                                                    value={
                                                        report.created_at
                                                            ? new Date(
                                                                  report.created_at
                                                              ).toLocaleString()
                                                            : "Unknown"
                                                    }
                                                />

                                            </div>

                                            {/* AI INFO */}

                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    gap: "25px",
                                                    flexWrap:
                                                        "wrap",
                                                    background:
                                                        "#f8fafc",
                                                    padding:
                                                        "12px 15px",
                                                    borderRadius:
                                                        "10px",
                                                    fontSize:
                                                        "13px",
                                                    color:
                                                        "#475569",
                                                }}
                                            >
                                                <span>
                                                    🤖 AI Severity:{" "}
                                                    <strong>
                                                        {report.severity ||
                                                            "Analysed"}
                                                    </strong>
                                                </span>

                                                <span>
                                                    🎯 Risk Score:{" "}
                                                    <strong>
                                                        {report.risk_score ??
                                                            "—"}
                                                    </strong>
                                                </span>
                                            </div>

                                            {/* ACTION */}

                                            <div
                                                style={{
                                                    marginTop:
                                                        "17px",
                                                    paddingTop:
                                                        "17px",
                                                    borderTop:
                                                        "1px solid #e5e7eb",
                                                    display:
                                                        "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems:
                                                        "center",
                                                    gap: "15px",
                                                    flexWrap:
                                                        "wrap",
                                                }}
                                            >

                                                {/* REPORTED */}

                                                {status ===
                                                    "Reported" && (
                                                    <>
                                                        <div>
                                                            <strong
                                                                style={{
                                                                    color:
                                                                        "#9a3412",
                                                                    fontSize:
                                                                        "14px",
                                                                }}
                                                            >
                                                                ⏳ Requires
                                                                officer action
                                                            </strong>

                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "4px 0 0",
                                                                    color:
                                                                        "#64748b",
                                                                    fontSize:
                                                                        "12px",
                                                                }}
                                                            >
                                                                Review the issue
                                                                and take necessary
                                                                civic action.
                                                            </p>
                                                        </div>

                                                        <button
                                                            onClick={() =>
                                                                handleActionTaken(
                                                                    report
                                                                )
                                                            }
                                                            disabled={
                                                                updating ===
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
                                                                    "pointer",
                                                                boxShadow:
                                                                    "0 5px 15px rgba(37,99,235,.2)",
                                                            }}
                                                        >
                                                            {updating ===
                                                            report.id
                                                                ? "Updating..."
                                                                : "🛠️ Mark Action Taken"}
                                                        </button>
                                                    </>
                                                )}

                                                {/* ACTION TAKEN */}

                                                {isActionTaken && (
                                                    <>
                                                        <div>
                                                            <strong
                                                                style={{
                                                                    color:
                                                                        "#1d4ed8",
                                                                    fontSize:
                                                                        "14px",
                                                                }}
                                                            >
                                                                👤 Waiting for
                                                                citizen verification
                                                            </strong>

                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "4px 0 0",
                                                                    color:
                                                                        "#64748b",
                                                                    fontSize:
                                                                        "12px",
                                                                }}
                                                            >
                                                                Officer has taken
                                                                action. Citizen
                                                                must verify the
                                                                real-world result.
                                                            </p>
                                                        </div>

                                                        <span
                                                            style={{
                                                                padding:
                                                                    "10px 14px",
                                                                borderRadius:
                                                                    "9px",
                                                                background:
                                                                    "#eff6ff",
                                                                color:
                                                                    "#1d4ed8",
                                                                fontWeight:
                                                                    "800",
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        >
                                                            👤 Citizen Verification
                                                        </span>
                                                    </>
                                                )}

                                                {/* RESOLVED */}

                                                {isResolved && (
                                                    <>
                                                        <div>
                                                            <strong
                                                                style={{
                                                                    color:
                                                                        "#15803d",
                                                                    fontSize:
                                                                        "14px",
                                                                }}
                                                            >
                                                                ✓ Resolution
                                                                verified
                                                            </strong>

                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "4px 0 0",
                                                                    color:
                                                                        "#64748b",
                                                                    fontSize:
                                                                        "12px",
                                                                }}
                                                            >
                                                                Citizen confirmed
                                                                that the issue was
                                                                resolved.
                                                            </p>
                                                        </div>

                                                        <span
                                                            style={{
                                                                padding:
                                                                    "10px 14px",
                                                                borderRadius:
                                                                    "9px",
                                                                background:
                                                                    "#dcfce7",
                                                                color:
                                                                    "#166534",
                                                                fontWeight:
                                                                    "800",
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        >
                                                            ✓ Verified by Citizen
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                </section>

                {/* =================================================
                    WORKFLOW
                ================================================= */}

                <section
                    style={{
                        marginTop: "38px",
                        background: "#173b63",
                        color: "#ffffff",
                        borderRadius: "18px",
                        padding: "28px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "11px",
                            fontWeight: "900",
                            letterSpacing: "1.5px",
                            opacity: 0.75,
                        }}
                    >
                        CIVICPULSE RESOLUTION MODEL
                    </div>

                    <h2
                        style={{
                            margin:
                                "8px 0 22px",
                        }}
                    >
                        Officer Action → Citizen Verification
                    </h2>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3,minmax(0,1fr))",
                            gap: "20px",
                        }}
                    >
                        <Workflow
                            number="01"
                            title="Officer Action"
                            text="Officer reviews the complaint and takes the required civic action."
                        />

                        <Workflow
                            number="02"
                            title="Citizen Verification"
                            text="Citizen is informed that action has been taken and checks the actual situation."
                        />

                        <Workflow
                            number="03"
                            title="Verified Resolution"
                            text="Only after citizen confirmation does the report become Resolved."
                        />
                    </div>
                </section>

            </section>
        </main>
    );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
    icon,
    number,
    title,
    subtitle,
}) {
    return (
        <div
            style={{
                background: "#ffffff",
                border: "1px solid #e3e8ef",
                borderRadius: "15px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                boxShadow:
                    "0 5px 18px rgba(15,23,42,.04)",
            }}
        >
            <div
                style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "11px",
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "19px",
                    flexShrink: 0,
                }}
            >
                {icon}
            </div>

            <div>
                <strong
                    style={{
                        display: "block",
                        fontSize: "25px",
                        color: "#173b63",
                    }}
                >
                    {number}
                </strong>

                <span
                    style={{
                        display: "block",
                        fontWeight: "800",
                        fontSize: "13px",
                        color: "#334155",
                    }}
                >
                    {title}
                </span>

                <small
                    style={{
                        display: "block",
                        marginTop: "2px",
                        color: "#94a3b8",
                        fontSize: "11px",
                    }}
                >
                    {subtitle}
                </small>
            </div>
        </div>
    );
}


// =====================================================
// DETAIL
// =====================================================

function Detail({
    icon,
    title,
    value,
}) {
    return (
        <div
            style={{
                background: "#f8fafc",
                borderRadius: "10px",
                padding: "12px",
                minWidth: 0,
            }}
        >
            <div
                style={{
                    fontSize: "15px",
                    marginBottom: "4px",
                }}
            >
                {icon}
            </div>

            <small
                style={{
                    display: "block",
                    fontSize: "9px",
                    letterSpacing: "1px",
                    fontWeight: "900",
                    color: "#94a3b8",
                    marginBottom: "4px",
                }}
            >
                {title}
            </small>

            <strong
                style={{
                    display: "block",
                    color: "#334155",
                    fontSize: "12px",
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                }}
            >
                {value}
            </strong>
        </div>
    );
}


// =====================================================
// WORKFLOW
// =====================================================

function Workflow({
    number,
    title,
    text,
}) {
    return (
        <div
            style={{
                padding: "18px",
                background:
                    "rgba(255,255,255,.08)",
                border:
                    "1px solid rgba(255,255,255,.12)",
                borderRadius: "13px",
            }}
        >
            <div
                style={{
                    fontSize: "11px",
                    fontWeight: "900",
                    opacity: 0.65,
                }}
            >
                {number}
            </div>

            <h3
                style={{
                    margin:
                        "7px 0",
                    fontSize: "16px",
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    margin: 0,
                    fontSize: "13px",
                    lineHeight: 1.6,
                    opacity: 0.78,
                }}
            >
                {text}
            </p>
        </div>
    );
}

export default AdminDashboard;