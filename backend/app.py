from flask import Flask, jsonify, request
from flask_cors import CORS

from database import init_db
from routes.reports import reports_bp
from routes.dashboard import dashboard_bp
from routes.auth import auth_bp

app = Flask(__name__)


# =====================================================
# CORS
# =====================================================

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)


# =====================================================
# DATABASE
# =====================================================

init_db(app)


# =====================================================
# BLUEPRINTS
# =====================================================

app.register_blueprint(reports_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(auth_bp)


# =====================================================
# HOME
# =====================================================

@app.route("/")
def home():

    return jsonify({
        "success": True,
        "message": "CivicPulse AI Backend is running!"
    })


# =====================================================
# API TEST
# =====================================================

@app.route("/api/test")
def test():

    return jsonify({
        "success": True,
        "status": "success",
        "message": "CivicPulse API is working!"
    })


# =====================================================
# DATABASE TEST
# =====================================================

@app.route("/api/database-test")
def database_test():

    try:

        from database import mysql

        cursor = mysql.connection.cursor()

        cursor.execute(
            "SELECT DATABASE() AS database_name"
        )

        result = cursor.fetchone()

        cursor.close()

        return jsonify({
            "success": True,
            "message": "MySQL connection successful!",
            "database": result["database_name"]
        })

    except Exception as error:

        return jsonify({
            "success": False,
            "message": "Database connection failed.",
            "error": str(error)
        }), 500


# =====================================================
# CITIZEN MARK REPORT AS RESOLVED
# =====================================================

@app.route(
    "/api/reports/<int:report_id>/resolve",
    methods=["PUT"]
)
def resolve_report(report_id):

    try:

        data = request.get_json() or {}

        citizen_id = data.get("citizen_id")

        if not citizen_id:

            return jsonify({
                "success": False,
                "message": "Citizen ID is required."
            }), 400


        from database import mysql

        cursor = mysql.connection.cursor()


        # -------------------------------------------------
        # CHECK WHETHER REPORT EXISTS AND BELONGS TO CITIZEN
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                id,
                citizen_id,
                status
            FROM reports
            WHERE id = %s
            """,
            (report_id,)
        )

        report = cursor.fetchone()


        if not report:

            cursor.close()

            return jsonify({
                "success": False,
                "message": "Report not found."
            }), 404


        # -------------------------------------------------
        # SECURITY CHECK
        # -------------------------------------------------

        if str(report["citizen_id"]) != str(citizen_id):

            cursor.close()

            return jsonify({
                "success": False,
                "message": "You can only resolve your own reports."
            }), 403


        # -------------------------------------------------
        # ALREADY RESOLVED
        # -------------------------------------------------

        if str(report["status"]).lower() == "resolved":

            cursor.close()

            return jsonify({
                "success": True,
                "message": "This report is already marked as resolved.",
                "status": "Resolved"
            })


        # -------------------------------------------------
        # UPDATE STATUS
        # -------------------------------------------------

        cursor.execute(
            """
            UPDATE reports
            SET status = %s
            WHERE id = %s
            """,
            ("Resolved", report_id)
        )

        mysql.connection.commit()


        # -------------------------------------------------
        # GET UPDATED REPORT
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT *
            FROM reports
            WHERE id = %s
            """,
            (report_id,)
        )

        updated_report = cursor.fetchone()

        cursor.close()


        return jsonify({
            "success": True,
            "message": "Report marked as resolved.",
            "report": updated_report
        })


    except Exception as error:

        print(
            "Resolve report error:",
            error
        )

        return jsonify({
            "success": False,
            "message": "Unable to mark report as resolved.",
            "error": str(error)
        }), 500


# =====================================================
# RUN
# =====================================================

if __name__ == "__main__":

    print("-----------------------------------")
    print("CivicPulse AI Backend")
    print("-----------------------------------")
    print("Server: http://127.0.0.1:5000")
    print("API Test: http://127.0.0.1:5000/api/test")
    print("Database Test:")
    print("http://127.0.0.1:5000/api/database-test")
    print("-----------------------------------")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )