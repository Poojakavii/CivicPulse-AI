function ReportCard({ report, onClick }) {

    const icons = {
        Waste: "🗑️",
        Road: "🛣️",
        Drainage: "🚰",
        Streetlight: "💡",
        Pollution: "🌫️",
        Water: "💧",
        Other: "⚠️"
    };

    const risk =
        String(
            report?.risk_level ||
            report?.risk ||
            "LOW"
        ).toUpperCase();

    const status =
        report?.status || "Submitted";

    return (
        <div
            className="civic-report-card"
            onClick={onClick}
        >

            <div className="report-card-top">

                <div className="report-card-category">

                    <div className="report-card-icon">
                        {icons[report?.category] || "⚠️"}
                    </div>

                    <div>
                        <span>
                            {report?.category || "Civic Issue"}
                        </span>

                        <small>
                            {report?.id || "New Report"}
                        </small>
                    </div>

                </div>

                <span
                    className={`report-risk risk-${risk.toLowerCase()}`}
                >
                    {risk}
                </span>

            </div>

            <h3>
                {report?.problem ||
                    report?.description ||
                    "Civic problem reported"}
            </h3>

            <p className="report-card-description">
                {report?.description ||
                    "No description provided."}
            </p>

            <div className="report-card-location">
                📍 {report?.location || "Location unavailable"}
            </div>

            <div className="report-card-bottom">

                <span>
                    🚦 {status}
                </span>

                {report?.risk_score !== undefined && (
                    <span>
                        📊 Score: {report.risk_score}
                    </span>
                )}

            </div>

        </div>
    );
}

export default ReportCard;