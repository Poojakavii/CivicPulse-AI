function VerificationCard({ report, onVerify }) {

    const verified =
        report?.verified === true ||
        report?.verification_status === "Verified";

    return (
        <div className="verification-card">

            <div className="verification-icon">
                {verified ? "✅" : "🔎"}
            </div>

            <div className="verification-content">

                <span>
                    REPORT VERIFICATION
                </span>

                <h3>
                    {verified
                        ? "Verified Civic Report"
                        : "Awaiting Verification"}
                </h3>

                <p>
                    {verified
                        ? "This report has been verified by the CivicPulse system."
                        : "This civic report is currently waiting for verification."}
                </p>

            </div>

            {!verified && onVerify && (
                <button
                    onClick={() => onVerify(report)}
                    className="verify-button"
                >
                    Verify
                </button>
            )}

        </div>
    );
}

export default VerificationCard;