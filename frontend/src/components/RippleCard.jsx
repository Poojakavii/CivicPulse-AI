function RippleCard({ ripple }) {

    if (!ripple) {
        return null;
    }

    const items =
        Array.isArray(ripple)
            ? ripple
            : String(ripple)
                .split("→")
                .map(item => item.trim())
                .filter(Boolean);

    return (
        <div className="ripple-card">

            <div className="ripple-card-header">

                <div className="ripple-symbol">
                    🌊
                </div>

                <div>
                    <span>
                        AI IMPACT ANALYSIS
                    </span>

                    <h3>
                        Civic Ripple Effect
                    </h3>
                </div>

            </div>

            <div className="ripple-chain">

                {items.map((item, index) => (

                    <div
                        className="ripple-step"
                        key={index}
                    >

                        <div className="ripple-number">
                            {index + 1}
                        </div>

                        <div>
                            <strong>
                                {item}
                            </strong>
                        </div>

                    </div>

                ))}

            </div>

            <p className="ripple-footer">
                CivicPulse AI estimates how one local issue
                can create wider community impact.
            </p>

        </div>
    );
}

export default RippleCard;