from flask import Blueprint, jsonify
import os
import json
from collections import Counter


dashboard_bp = Blueprint(
    "dashboard",
    __name__
)


BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

PROJECT_DIR = os.path.dirname(BASE_DIR)

DATA_DIR = os.path.join(
    PROJECT_DIR,
    "data"
)

REPORT_FILE = os.path.join(
    DATA_DIR,
    "reports.json"
)


def load_reports():

    if not os.path.exists(REPORT_FILE):
        return []

    try:

        with open(
            REPORT_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            return json.load(file)

    except:

        return []


@dashboard_bp.route(
    "/api/dashboard",
    methods=["GET"]
)
def dashboard():

    reports = load_reports()


    # =====================================
    # BASIC STATISTICS
    # =====================================

    total_reports = len(reports)


    resolved_reports = sum(

        1

        for report in reports

        if report.get("status") == "Resolved"

    )


    high_risk_reports = sum(

        1

        for report in reports

        if str(
            report.get("risk_level", "")
        ).lower() == "high"

    )


    # =====================================
    # CATEGORY COUNTS
    # =====================================

    category_counter = Counter(

        report.get(
            "category",
            "Unknown"
        )

        for report in reports

    )


    most_reported_problems = [

        {
            "category": category,
            "count": count
        }

        for category, count
        in category_counter.most_common()

    ]


    # =====================================
    # LOCATION COUNTS
    # =====================================

    location_counter = Counter(

        report.get(
            "location",
            "Unknown"
        )

        for report in reports

    )


    hotspots = []


    for location, count in location_counter.items():

        if count >= 2:

            hotspots.append({

                "location": location,

                "reports": count

            })


    hotspots.sort(

        key=lambda x: x["reports"],

        reverse=True

    )


    # =====================================
    # RECENT REPORTS
    # =====================================

    recent_reports = sorted(

        reports,

        key=lambda x:
            x.get("created_at", ""),

        reverse=True

    )[:10]


    # =====================================
    # DASHBOARD RESPONSE
    # =====================================

    return jsonify({

        "success": True,

        "statistics": {

            "total_reports":
                total_reports,

            "resolved_reports":
                resolved_reports,

            "high_risk_reports":
                high_risk_reports,

            "emerging_hotspots":
                len(hotspots)

        },

        "most_reported_problems":
            most_reported_problems,

        "hotspots":
            hotspots,

        "recent_reports":
            recent_reports

    })