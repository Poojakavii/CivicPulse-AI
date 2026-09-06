const API_BASE_URL =
    "http://127.0.0.1:5000";


// =====================================================
// HELPER
// =====================================================

async function parseResponse(response) {

    let data;

    try {

        data =
            await response.json();

    } catch {

        throw new Error(
            `Server returned an invalid response (${response.status}).`
        );

    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            data.error ||
            `Request failed (${response.status}).`
        );

    }


    return data;
}


// =====================================================
// REGISTER
// =====================================================

export async function registerUser(userData) {

    const response =
        await fetch(
            `${API_BASE_URL}/api/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(userData)
            }
        );


    return await parseResponse(
        response
    );
}


// =====================================================
// LOGIN
// =====================================================

export async function loginUser(loginData) {

    const response =
        await fetch(
            `${API_BASE_URL}/api/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(loginData)
            }
        );


    return await parseResponse(
        response
    );
}


// =====================================================
// SUBMIT CIVIC REPORT
// =====================================================

export async function submitReport(
    reportData
) {

    const formData =
        new FormData();


    formData.append(
        "category",
        reportData.category
    );


    formData.append(
        "location",
        reportData.location
    );


    formData.append(
        "description",
        reportData.description
    );


    formData.append(
        "citizen_id",
        String(
            reportData.citizen_id
        )
    );


    // REAL GPS

    if (
        reportData.latitude !==
        undefined &&
        reportData.latitude !==
        null
    ) {

        formData.append(
            "latitude",
            String(
                reportData.latitude
            )
        );

    }


    if (
        reportData.longitude !==
        undefined &&
        reportData.longitude !==
        null
    ) {

        formData.append(
            "longitude",
            String(
                reportData.longitude
            )
        );

    }


    const response =
        await fetch(
            `${API_BASE_URL}/api/reports`,
            {
                method: "POST",

                body: formData
            }
        );


    return await parseResponse(
        response
    );
}


// =====================================================
// GET ALL REPORTS
// =====================================================

export async function getReports() {

    const response =
        await fetch(
            `${API_BASE_URL}/api/reports`
        );


    return await parseResponse(
        response
    );
}


// =====================================================
// GET SINGLE REPORT
// =====================================================

export async function getReport(
    reportId
) {

    const response =
        await fetch(
            `${API_BASE_URL}/api/reports/${reportId}`
        );


    return await parseResponse(
        response
    );
}


// =====================================================
// UPDATE REPORT STATUS
// =====================================================

export async function updateReportStatus(
    reportId,
    status
) {

    if (!reportId) {

        throw new Error(
            "Report ID is required."
        );

    }


    const response =
        await fetch(
            `${API_BASE_URL}/api/reports/${reportId}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        status: status
                    })
            }
        );


    return await parseResponse(
        response
    );
}


// =====================================================
// TEST API
// =====================================================

export async function testAPI() {

    const response =
        await fetch(
            `${API_BASE_URL}/api/test`
        );


    return await parseResponse(
        response
    );
}


// =====================================================
// DASHBOARD
// =====================================================

export async function getDashboard() {

    const response =
        await fetch(
            `${API_BASE_URL}/api/dashboard`
        );


    return await parseResponse(
        response
    );
}
// =====================================================
// MARK REPORT AS RESOLVED
// =====================================================

export async function resolveReport(
    reportId,
    citizenId
) {

    const response = await fetch(
        `http://127.0.0.1:5000/api/reports/${reportId}/resolve`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                citizen_id: citizenId
            })
        }
    );


    let data;

    try {

        data = await response.json();

    } catch {

        throw new Error(
            "Invalid response from server."
        );

    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Unable to resolve report."
        );

    }


    return data;
}