# =========================================
# CIVICPULSE AI - PATTERN DETECTION ENGINE
# =========================================

from collections import Counter
from datetime import datetime


def detect_patterns(reports):

    if not reports:
        return {
            "hotspots": [],
            "patterns": [],
            "message": "Not enough reports to detect patterns."
        }


    # -----------------------------------------
    # COUNT REPORTS BY LOCATION
    # -----------------------------------------

    location_counts = Counter()

    for report in reports:

        location = report.get(
            "location",
            "Unknown"
        )

        location_counts[location] += 1


    # -----------------------------------------
    # FIND HOTSPOTS
    # -----------------------------------------

    hotspots = []

    for location, count in location_counts.items():

        if count >= 3:

            if count >= 6:
                risk = "High"

            elif count >= 4:
                risk = "Medium"

            else:
                risk = "Low"


            hotspots.append({

                "location": location,

                "report_count": count,

                "risk": risk

            })


    # -----------------------------------------
    # COUNT PROBLEM TYPES
    # -----------------------------------------

    category_counts = Counter()

    for report in reports:

        category = report.get(
            "category",
            "Unknown"
        )

        category_counts[category] += 1


    # -----------------------------------------
    # FIND REPEATED PROBLEMS
    # -----------------------------------------

    repeated_problems = []

    for category, count in category_counts.items():

        if count >= 3:

            repeated_problems.append({

                "category": category,

                "count": count

            })


    # -----------------------------------------
    # GENERATE PATTERN MESSAGES
    # -----------------------------------------

    patterns = []


    for hotspot in hotspots:

        patterns.append({

            "type": "Location Hotspot",

            "message":
                f"{hotspot['location']} has "
                f"{hotspot['report_count']} reports.",

            "risk":
                hotspot["risk"]

        })


    for problem in repeated_problems:

        patterns.append({

            "type": "Repeated Problem",

            "message":
                f"{problem['category']} problems "
                f"are repeatedly reported "
                f"({problem['count']} reports).",

            "risk": "Attention Required"

        })


    # -----------------------------------------
    # FINAL MESSAGE
    # -----------------------------------------

    if patterns:

        message = (
            "CivicPulse detected repeated civic "
            "activity that may require preventive action."
        )

    else:

        message = (
            "No significant civic pattern detected yet."
        )


    return {

        "hotspots": hotspots,

        "patterns": patterns,

        "message": message

    }