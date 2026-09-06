from datetime import datetime


def create_report_table(connection):

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reports (

            id INT AUTO_INCREMENT PRIMARY KEY,

            citizen_id INT NOT NULL,

            category VARCHAR(100) NOT NULL,

            location VARCHAR(255) NOT NULL,

            description TEXT NOT NULL,

            latitude DECIMAL(10, 7),

            longitude DECIMAL(10, 7),

            problem VARCHAR(255),

            severity VARCHAR(50),

            risk_score INT DEFAULT 0,

            risk_level VARCHAR(50),

            ripple_chain TEXT,

            recommendation TEXT,

            status VARCHAR(50) DEFAULT 'Submitted',

            verification_status VARCHAR(50)
                DEFAULT 'Pending',

            verified BOOLEAN DEFAULT FALSE,

            created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP

        )
    """)

    connection.commit()

    cursor.close()


def create_report(
    connection,
    citizen_id,
    category,
    location,
    description,
    latitude=None,
    longitude=None,
    problem=None,
    severity=None,
    risk_score=0,
    risk_level=None,
    ripple_chain=None,
    recommendation=None
):

    cursor = connection.cursor()

    query = """
        INSERT INTO reports
        (
            citizen_id,
            category,
            location,
            description,
            latitude,
            longitude,
            problem,
            severity,
            risk_score,
            risk_level,
            ripple_chain,
            recommendation,
            status,
            verification_status,
            verified
        )
        VALUES
        (
            %s, %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s, %s,
            'Submitted',
            'Pending',
            FALSE
        )
    """

    cursor.execute(
        query,
        (
            citizen_id,
            category,
            location,
            description,
            latitude,
            longitude,
            problem,
            severity,
            risk_score,
            risk_level,
            ripple_chain,
            recommendation
        )
    )

    connection.commit()

    report_id = cursor.lastrowid

    cursor.close()

    return report_id


def get_all_reports(connection):

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM reports
        ORDER BY created_at DESC
    """)

    reports = cursor.fetchall()

    cursor.close()

    return reports


def get_report_by_id(connection, report_id):

    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM reports
        WHERE id = %s
        """,
        (report_id,)
    )

    report = cursor.fetchone()

    cursor.close()

    return report


def verify_report(connection, report_id):

    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE reports
        SET
            verified = TRUE,
            verification_status = 'Verified'
        WHERE id = %s
        """,
        (report_id,)
    )

    connection.commit()

    cursor.close()