import os


class Config:

    SECRET_KEY = os.environ.get(
        "SECRET_KEY",
        "civicpulse-development-key"
    )

    DB_HOST = os.environ.get(
        "DB_HOST",
        "127.0.0.1"
    )

    DB_USER = os.environ.get(
        "DB_USER",
        "root"
    )

    DB_PASSWORD = os.environ.get(
        "DB_PASSWORD",
        ""
    )

    DB_NAME = os.environ.get(
        "DB_NAME",
        "civicpulse"
    )

    DB_PORT = int(
        os.environ.get(
            "DB_PORT",
            3306
        )
    )


def get_database_config():

    return {

        "host": Config.DB_HOST,

        "user": Config.DB_USER,

        "password": Config.DB_PASSWORD,

        "database": Config.DB_NAME,

        "port": Config.DB_PORT

    }