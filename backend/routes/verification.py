def calculate_verification_score(report):

    score = 0

    if report.get("location"):
        score += 25

    if report.get("description"):
        score += 25

    if report.get("latitude") is not None:
        score += 20

    if report.get("longitude") is not None:
        score += 20

    if report.get("category"):
        score += 10

    score = min(score, 100)

    if score >= 80:
        status = "High Confidence"

    elif score >= 50:
        status = "Medium Confidence"

    else:
        status = "Low Confidence"

    return {
        "score": score,
        "status": status
    }


def verify_report_data(report):

    result = calculate_verification_score(report)

    return {
        "verified": result["score"] >= 80,
        "verification_score": result["score"],
        "verification_status": result["status"]
    }