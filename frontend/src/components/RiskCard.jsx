function RiskCrad({
    severity,
    riskLevel,
    riskScore
}) {

    const level =
        String(
            riskLevel || severity || "LOW"
        ).toUpperCase();

    let icon = "🟢";

    if (level.includes("HIGH")) {
        icon = "🔴";
    } else if (level.includes("MEDIUM")) {
        icon = "🟠";
    }

    return (
        <div
            className={`risk-card risk-card-${level.toLowerCase()}`}
        >

            <div className="risk-card-header">

                <div className="risk-icon">
                    {icon}
                </div>

                <div>
                    <span>
                        AI RISK ASSESSMENT
                    </span>

                    <h3>
                        {level} Risk
                    </h3>
                </div>

            </div>

            <div className="risk-score">

                <strong>
                    {riskScore ?? "—"}
                </strong>

                <span>
                    / 100
                </span>

            </div>

            <div className="risk-meter">

                <div
                    style={{
                        width: `${Math.min(
                            100,
                            Math.max(
                                0,
                                Number(riskScore) || 0
                            )
                        )}%`
                    }}
                />

            </div>

            <p>
                {level.includes("HIGH")
                    ? "Immediate civic attention may be required."
                    : level.includes("MEDIUM")
                    ? "This issue may require timely attention."
                    : "Currently assessed as a lower civic risk."}
            </p>

        </div>
    );
}

export default RiskCrad;