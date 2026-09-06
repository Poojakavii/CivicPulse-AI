# =========================================
# CIVICPULSE AI - RISK PREDICTION ENGINE
# =========================================

SEVERITY_SCORE = {
    "Low": 20,
    "Medium": 50,
    "High": 80
}


def calculate_risk(problem, severity, report_count):
    """
    Calculate a simple civic risk score.

    Factors:
    1. Problem severity
    2. Number of repeated reports
    """

    base_score = SEVERITY_SCORE.get(severity, 40)

    # Repeated reports increase risk
    if report_count >= 5:
        frequency_score = 20

    elif report_count >= 3:
        frequency_score = 15

    elif report_count >= 2:
        frequency_score = 10

    else:
        frequency_score = 0


    # Final score
    risk_score = base_score + frequency_score

    # Maximum 100
    risk_score = min(risk_score, 100)


    # Risk level
    if risk_score >= 80:
        risk_level = "High"

    elif risk_score >= 50:
        risk_level = "Medium"

    else:
        risk_level = "Low"


    # Recommendation
    if risk_level == "High":

        recommendation = (
            "Immediate attention recommended. "
            "Multiple indicators suggest an emerging civic risk."
        )

    elif risk_level == "Medium":

        recommendation = (
            "Monitor the area and consider preventive action "
            "before the problem increases."
        )

    else:

        recommendation = (
            "Continue monitoring the area for repeated reports."
        )


    return {

        "problem": problem,

        "risk_score": risk_score,

        "risk_level": risk_level,

        "report_count": report_count,

        "recommendation": recommendation

    }