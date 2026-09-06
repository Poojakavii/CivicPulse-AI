from flask import Blueprint, request, jsonify
import os
import json
from datetime import datetime

from ai.detector import detect_problem
from ai.ripple import generate_ripple
from ai.prediction import calculate_risk
from ai.patterns import detect_patterns


reports_bp = Blueprint("reports", __name__)


# =========================================
# PATHS
# =========================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

PROJECT_DIR = os.path.dirname(BASE_DIR)

DATA_DIR = os.path.join(
    PROJECT_DIR,
    "data"
)

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads"
)

REPORT_FILE = os.path.join(
    DATA_DIR,
    "reports.json"
)


os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# =========================================
# LOAD REPORTS
# =========================================

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


# =========================================
# SAVE REPORTS
# =========================================

def save_reports(reports):

    with open(
        REPORT_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            reports,
            file,
            indent=4
        )


# =========================================
# CREATE REPORT
# =========================================

@reports_bp.route(
    "/api/reports",
    methods=["POST"]
)
def create_report():

    # --------------------------------------
    # GET FORM DATA
    # --------------------------------------

    category = request.form.get("category")

    description = request.form.get("description")

    location = request.form.get("location")

    citizen_id = request.form.get("citizen_id")
    # --------------------------------------
    # VALIDATION
    # --------------------------------------

    if not category or not description or not location or not citizen_id:

        return jsonify({

            "success": False,

            "message":
                "Please fill all required fields."

        }), 400


    # --------------------------------------
    # IMAGE
    # --------------------------------------

    image = request.files.get("image")

    image_name = None


    if image and image.filename:

        image_name = image.filename

        image_path = os.path.join(
            UPLOAD_FOLDER,
            image_name
        )

        image.save(image_path)


    # ======================================
    # 🧠 AI 1 — PROBLEM DETECTION
    # ======================================

    ai_result = detect_problem(
        category,
        description
    )


    problem = ai_result["problem"]

    severity = ai_result["severity"]


    # ======================================
    # 🌊 AI 2 — CIVIC RIPPLE
    # ======================================

    ripple_result = generate_ripple(
        problem
    )


    # ======================================
    # 📊 EXISTING REPORTS
    # ======================================

    reports = load_reports()


    # Count reports from same location

    same_location_count = sum(

        1

        for report in reports

        if report.get("location", "").lower()
        == location.lower()

    )


    # New report included in count

    report_count = same_location_count + 1


    # ======================================
    # 🔮 AI 3 — RISK PREDICTION
    # ======================================

    risk_result = calculate_risk(

        problem,

        severity,

        report_count

    )


    # ======================================
    # 📈 ADD TEMPORARY REPORT
    # ======================================

    new_id = len(reports) + 1


    new_report = {

        "id": new_id,

        "category": category,

        "description": description,

        "location": location,

        "image": image_name,

        "status": "Reported",


        # AI Detection
        "problem": problem,

        "severity": severity,

        "confidence":
            ai_result["confidence"],

        "impact":
            ai_result["impact"],

        "keywords_found":
            ai_result["keywords_found"],


        # Civic Ripple
        "ripple_chain":
            ripple_result["chain"],

        "ripple_risk":
            ripple_result["risk"],

        "recommendation":
            ripple_result["recommendation"],


        # Risk Prediction
        "risk_score":
            risk_result["risk_score"],

        "risk_level":
            risk_result["risk_level"],

        "report_count":
            report_count,


        "created_at":
            datetime.now().isoformat()

    }


    # ======================================
    # SAVE REPORT
    # ======================================

    reports.append(new_report)

    save_reports(reports)


    # ======================================
    # 📈 PATTERN DETECTION
    # ======================================

    pattern_result = detect_patterns(
        reports
    )


    # ======================================
    # FINAL RESPONSE
    # ======================================

    return jsonify({

        "success": True,

        "message":
            "Report submitted and analyzed successfully!",

        "report":
            new_report,

        "pattern_analysis":
            pattern_result

    }), 201


# =========================================
# GET ALL REPORTS
# =========================================

@reports_bp.route(
    "/api/reports",
    methods=["GET"]
)
def get_reports():

    reports = load_reports()

    return jsonify({

        "success": True,

        "reports": reports

    })


# =========================================
# GET SINGLE REPORT
# =========================================

@reports_bp.route(
    "/api/reports/<int:report_id>",
    methods=["GET"]
)
def get_report(report_id):

    reports = load_reports()


    for report in reports:

        if report.get("id") == report_id:

            return jsonify({

                "success": True,

                "report": report

            })


    return jsonify({

        "success": False,

        "message": "Report not found."

    }), 404
# =========================================
# CONNECTION TEST
# =========================================

@reports_bp.route("/api/reports/test", methods=["GET"])
def report_test():

    return jsonify({
        "success": True,
        "message": "Report API is working!"
    })