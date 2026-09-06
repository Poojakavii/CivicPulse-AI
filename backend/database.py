from flask_mysqldb import MySQL

mysql = MySQL()


def init_db(app):

    app.config["MYSQL_HOST"] = "127.0.0.1"
    app.config["MYSQL_USER"] = "root"
    app.config["MYSQL_PASSWORD"] = ""
    app.config["MYSQL_DB"] = "civicpulse"
    app.config["MYSQL_CURSORCLASS"] = "DictCursor"

    mysql.init_app(app)