from flask import Blueprint, request, jsonify
from database import mysql

auth_bp = Blueprint("auth", __name__)


# =====================================================
# CITIZEN REGISTER
# =====================================================

@auth_bp.route("/api/register", methods=["POST"])
def register():

    try:

        data = request.get_json() or {}

        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        phone = data.get("phone", "").strip()


        if not name or not email or not password:

            return jsonify({
                "success": False,
                "message": "Please fill all required fields."
            }), 400


        cursor = mysql.connection.cursor()


        cursor.execute(
            "SELECT id FROM citizens WHERE email = %s",
            (email,)
        )

        existing = cursor.fetchone()


        if existing:

            cursor.close()

            return jsonify({
                "success": False,
                "message": "Email is already registered."
            }), 409


        cursor.execute(
            """
            INSERT INTO citizens
            (name, email, password, phone)
            VALUES (%s, %s, %s, %s)
            """,
            (
                name,
                email,
                password,
                phone
            )
        )


        mysql.connection.commit()


        new_id = cursor.lastrowid

        cursor.close()


        return jsonify({

            "success": True,

            "message":
                "Registration successful!",

            "user": {

                "id": new_id,

                "name": name,

                "email": email,

                "phone": phone,

                "role": "citizen"

            }

        }), 201


    except Exception as error:

        print("REGISTRATION ERROR:", error)

        return jsonify({

            "success": False,

            "message":
                "Registration failed.",

            "error":
                str(error)

        }), 500


# =====================================================
# CITIZEN LOGIN
# =====================================================

@auth_bp.route("/api/login", methods=["POST"])
def login():

    try:

        data = request.get_json() or {}

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")


        if not email or not password:

            return jsonify({
                "success": False,
                "message": "Please enter email and password."
            }), 400


        cursor = mysql.connection.cursor()


        cursor.execute(
            """
            SELECT id, name, email
            FROM citizens
            WHERE email = %s AND password = %s
            """,
            (email, password)
        )

        user = cursor.fetchone()

        cursor.close()


        if not user:

            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401


        return jsonify({
            "success": True,
            "message": "Login successful!",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": "citizen"
            }
        }), 200


    except Exception as error:

        return jsonify({
            "success": False,
            "message": "Login failed.",
            "error": str(error)
        }), 500


# =====================================================
# ADMIN / OFFICER LOGIN
# =====================================================

@auth_bp.route("/api/admin-login", methods=["POST"])
def admin_login():

    try:

        data = request.get_json() or {}

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")


        if not email or not password:

            return jsonify({
                "success": False,
                "message": "Please enter email and password."
            }), 400


        cursor = mysql.connection.cursor()


        cursor.execute(
            """
            SELECT id, name, email, department
            FROM officers
            WHERE email = %s AND password = %s
            """,
            (email, password)
        )

        officer = cursor.fetchone()

        cursor.close()


        if not officer:

            return jsonify({
                "success": False,
                "message": "Invalid officer credentials."
            }), 401


        return jsonify({
            "success": True,
            "message": "Officer login successful!",
            "officer": {
                "id": officer["id"],
                "name": officer["name"],
                "email": officer["email"],
                "department": officer["department"],
                "role": "officer"
            }
        }), 200


    except Exception as error:

        return jsonify({
            "success": False,
            "message": "Admin login failed.",
            "error": str(error)
        }), 500