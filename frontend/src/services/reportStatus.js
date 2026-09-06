// =====================================================
// CivicPulse Report Status Storage
// =====================================================

const STORAGE_KEY = "civicPulseReportStatuses";

// =====================================================
// GET ALL STORED STATUSES
// =====================================================

function getStoredStatuses() {
    try {
        return JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "{}"
        );
    } catch (error) {
        console.error(
            "Unable to read report statuses:",
            error
        );

        return {};
    }
}

// =====================================================
// SAVE ALL STATUSES
// =====================================================

function saveStoredStatuses(statuses) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(statuses)
    );
}

// =====================================================
// GET REPORT STATUS
// =====================================================

export function getReportStatus(report) {

    const statuses =
        getStoredStatuses();

    const reportId =
        String(report?.id);

    if (
        statuses[reportId]
    ) {
        return statuses[reportId];
    }

    if (
        report?.status
    ) {
        return report.status;
    }

    return "Reported";
}

// =====================================================
// MARK ACTION TAKEN
// =====================================================

export function markActionTaken(reportId) {

    const statuses =
        getStoredStatuses();

    statuses[String(reportId)] =
        "Action Taken";

    saveStoredStatuses(
        statuses
    );

    return true;
}

// =====================================================
// MARK RESOLVED
// =====================================================

export function markResolved(reportId) {

    const statuses =
        getStoredStatuses();

    statuses[String(reportId)] =
        "Resolved";

    saveStoredStatuses(
        statuses
    );

    return true;
}

// =====================================================
// CLEAR STATUS
// =====================================================

export function clearReportStatus(reportId) {

    const statuses =
        getStoredStatuses();

    delete statuses[String(reportId)];

    saveStoredStatuses(
        statuses
    );
}

// =====================================================
// GET RAW STATUS
// =====================================================

export function getStatusById(reportId) {

    const statuses =
        getStoredStatuses();

    return (
        statuses[String(reportId)] ||
        null
    );
}