import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle,
    useMap
} from "react-leaflet";

import L from "leaflet";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import "leaflet/dist/leaflet.css";

import { getReports } from "../services/api";


// =====================================================
// CIVIC ICONS
// =====================================================

const icons = {
    Road: "🚧",
    Drainage: "🚰",
    Streetlight: "💡",
    Waste: "🗑️",
    Pollution: "🌫️",
    Water: "💧",
    Other: "⚠️"
};


// =====================================================
// COLORS
// =====================================================

const markerColors = {
    Road: "#f97316",
    Drainage: "#0ea5e9",
    Streetlight: "#eab308",
    Waste: "#16a34a",
    Pollution: "#9333ea",
    Water: "#2563eb",
    Other: "#64748b"
};


// =====================================================
// CIVIC MARKER
// =====================================================

function createIcon(category, risk) {

    let color =
        markerColors[category] ||
        "#64748b";

    if (risk === "HIGH") {
        color = "#dc2626";
    }

    if (risk === "MEDIUM") {
        color = "#f59e0b";
    }

    return L.divIcon({

        className: "civic-map-marker",

        html: `
            <div style="
                width:48px;
                height:48px;
                border-radius:50%;
                background:${color};
                border:4px solid white;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:22px;
                box-shadow:0 6px 22px rgba(0,0,0,.30);
                position:relative;
                cursor:pointer;
            ">

                ${icons[category] || "⚠️"}

                ${
                    risk === "HIGH"
                        ? `
                            <span style="
                                position:absolute;
                                right:-4px;
                                top:-4px;
                                width:16px;
                                height:16px;
                                background:#7f1d1d;
                                border:2px solid white;
                                border-radius:50%;
                            "></span>
                        `
                        : ""
                }

            </div>
        `,

        iconSize: [48, 48],

        iconAnchor: [24, 24],

        popupAnchor: [0, -24]

    });
}


// =====================================================
// USER LOCATION ICON
// =====================================================

const userIcon = L.divIcon({

    className: "civic-user-marker",

    html: `
        <div style="
            width:28px;
            height:28px;
            border-radius:50%;
            background:#2563eb;
            border:5px solid white;
            box-shadow:
                0 0 0 10px rgba(37,99,235,.18),
                0 5px 20px rgba(0,0,0,.35);
        "></div>
    `,

    iconSize: [28, 28],

    iconAnchor: [14, 14]

});


// =====================================================
// MAP CONTROLLER
// =====================================================

function MapController({ target }) {

    const map = useMap();

    useEffect(() => {

        if (!target) {
            return;
        }

        if (
            !Number.isFinite(target.lat) ||
            !Number.isFinite(target.lng)
        ) {
            return;
        }

        map.flyTo(
            [
                target.lat,
                target.lng
            ],
            16,
            {
                duration: 1.2
            }
        );

    }, [target, map]);

    return null;
}


// =====================================================
// DISTANCE
// =====================================================

function distance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;

    const dLat =
        (lat2 - lat1) *
        Math.PI /
        180;

    const dLon =
        (lon2 - lon1) *
        Math.PI /
        180;

    const a =
        Math.sin(dLat / 2) ** 2 +

        Math.cos(
            lat1 *
            Math.PI /
            180
        ) *

        Math.cos(
            lat2 *
            Math.PI /
            180
        ) *

        Math.sin(dLon / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}


// =====================================================
// SAFE COORDINATE CONVERTER
// =====================================================

function validCoordinate(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const number =
        Number(value);

    if (
        !Number.isFinite(number)
    ) {
        return null;
    }

    return number;
}


// =====================================================
// GET COORDINATES FROM REPORT
// =====================================================

function getReportCoordinates(report) {

    /*
     * Supports many possible backend field names.
     */

    const latitude =
        validCoordinate(
            report.latitude ??
            report.lat ??
            report.latitud ??
            report.location_latitude ??
            report.locationLatitude ??
            report.gps_latitude ??
            report.gpsLatitude
        );

    const longitude =
        validCoordinate(
            report.longitude ??
            report.lng ??
            report.lon ??
            report.longitud ??
            report.location_longitude ??
            report.locationLongitude ??
            report.gps_longitude ??
            report.gpsLongitude
        );


    if (
        latitude !== null &&
        longitude !== null &&
        latitude !== 0 &&
        longitude !== 0
    ) {

        return {
            lat: latitude,
            lng: longitude
        };

    }

    return null;
}


// =====================================================
// GEOCODE TEXT LOCATION
// =====================================================

async function geocodeLocation(location) {

    if (
        !location ||
        typeof location !== "string"
    ) {
        return null;
    }

    const cleanLocation =
        location.trim();

    if (!cleanLocation) {
        return null;
    }


    try {

        const response =
            await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(cleanLocation)}`,
                {
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {
            return null;
        }


        const data =
            await response.json();


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {
            return null;
        }


        const lat =
            Number(data[0].lat);

        const lng =
            Number(data[0].lon);


        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
        ) {
            return null;
        }


        return {
            lat,
            lng
        };

    } catch (error) {

        console.error(
            "Geocoding failed:",
            error
        );

        return null;

    }

}


// =====================================================
// PREPARE REPORT
// =====================================================

async function prepareReport(report) {

    if (!report) {
        return null;
    }


    /*
     * =================================================
     * PRIORITY 1
     * REAL GPS COORDINATES
     * =================================================
     */

    const gpsCoordinates =
        getReportCoordinates(
            report
        );


    if (gpsCoordinates) {

        return {

            ...report,

            lat:
                gpsCoordinates.lat,

            lng:
                gpsCoordinates.lng,

            coordinatesSource:
                "GPS"

        };

    }


    /*
     * =================================================
     * PRIORITY 2
     * TEXT LOCATION
     * =================================================
     */

    const location =
        report.location ||
        report.address ||
        report.area ||
        report.place ||
        "";


    if (!location) {

        return {

            ...report,

            lat: null,

            lng: null,

            coordinatesSource:
                "NONE"

        };

    }


    const coordinates =
        await geocodeLocation(
            location
        );


    if (!coordinates) {

        return {

            ...report,

            lat: null,

            lng: null,

            coordinatesSource:
                "NONE"

        };

    }


    return {

        ...report,

        lat:
            coordinates.lat,

        lng:
            coordinates.lng,

        coordinatesSource:
            "GEOCODED"

    };

}


// =====================================================
// NORMALIZE REPORT
// =====================================================

function normalizeReport(report) {

    return {

        ...report,

        category:
            report.category ||
            report.type ||
            "Other",

        problem:
            report.problem ||
            report.title ||
            report.issue ||
            report.category ||
            "Civic Issue",

        description:
            report.description ||
            report.details ||
            "No description available.",

        location:
            report.location ||
            report.address ||
            report.area ||
            report.place ||
            "Location not specified",

        status:
            report.status ||
            "Submitted",

        risk_level:
            report.risk_level ||
            report.risk ||
            "Under Review"

    };

}


// =====================================================
// MAIN COMPONENT
// =====================================================

function PulseMap() {

    const [
        userLocation,
        setUserLocation
    ] = useState(null);


    const [
        locationLoading,
        setLocationLoading
    ] = useState(false);


    const [
        locationError,
        setLocationError
    ] = useState("");


    const [
        locationSuccess,
        setLocationSuccess
    ] = useState(false);


    const [
        reports,
        setReports
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        selectedCategory,
        setSelectedCategory
    ] = useState("All");


    const [
        selectedReport,
        setSelectedReport
    ] = useState(null);


    const [
        mapReady,
        setMapReady
    ] = useState(false);


    // =====================================================
    // LOAD REPORTS
    // =====================================================

    async function loadReports() {

        try {

            setLoading(true);

            setError("");


            /*
             * =================================================
             * BACKEND REPORTS
             * =================================================
             */

            let backendReports = [];

            try {

                const response =
                    await getReports();


                if (
                    Array.isArray(response)
                ) {

                    backendReports =
                        response;

                } else if (
                    Array.isArray(
                        response?.reports
                    )
                ) {

                    backendReports =
                        response.reports;

                } else if (
                    Array.isArray(
                        response?.data
                    )
                ) {

                    backendReports =
                        response.data;

                }

            } catch (backendError) {

                console.error(
                    "Backend report loading failed:",
                    backendError
                );

            }


            /*
             * =================================================
             * LOCAL REPORTS
             * =================================================
             */

            let localReports = [];


            try {

                const saved =
                    localStorage.getItem(
                        "civicpulse_reports"
                    );


                if (saved) {

                    const parsed =
                        JSON.parse(saved);


                    if (
                        Array.isArray(parsed)
                    ) {

                        localReports =
                            parsed;

                    }

                }

            } catch (localError) {

                console.error(
                    "Local reports error:",
                    localError
                );

            }


            /*
             * =================================================
             * MERGE
             * =================================================
             */

            const combined = [

                ...backendReports,

                ...localReports

            ];


            /*
             * =================================================
             * NORMALIZE
             * =================================================
             */

            const normalized =
                combined
                    .filter(
                        report =>
                            report
                    )
                    .map(
                        normalizeReport
                    );


            /*
             * =================================================
             * REMOVE DUPLICATES
             * =================================================
             */

            const unique =
                Array.from(

                    new Map(

                        normalized.map(
                            report => {

                                const key =
                                    String(

                                        report.id ??

                                        report.report_id ??

                                        `${report.category}-${report.location}-${report.description}`

                                    );

                                return [
                                    key,
                                    report
                                ];

                            }
                        )

                    ).values()

                );


            /*
             * =================================================
             * PREPARE COORDINATES
             * =================================================
             */

            const prepared =
                await Promise.all(

                    unique.map(
                        prepareReport
                    )

                );


            const validReports =
                prepared.filter(
                    report =>
                        report !== null
                );


            setReports(
                validReports
            );


            console.log(
                "CivicPulse reports:",
                validReports
            );


            if (
                validReports.length === 0 &&
                backendReports.length === 0 &&
                localReports.length === 0
            ) {

                setError(
                    "No civic reports have been submitted yet."
                );

            }

        } catch (err) {

            console.error(
                "PulseMap error:",
                err
            );

            setError(
                "Unable to load civic reports."
            );

        } finally {

            setLoading(false);

        }

    }


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadReports();


        const interval =
            setInterval(
                loadReports,
                15000
            );


        return () =>
            clearInterval(
                interval
            );

    }, []);


    // =====================================================
    // GPS
    // =====================================================

    function enableGPS() {

        console.log(
            "CivicPulse: GPS requested"
        );


        setLocationError("");

        setLocationSuccess(false);


        if (
            !navigator.geolocation
        ) {

            setLocationError(
                "GPS is not supported by this browser."
            );

            return;

        }


        setLocationLoading(true);


        navigator.geolocation.getCurrentPosition(

            position => {

                const latitude =
                    Number(
                        position.coords.latitude
                    );


                const longitude =
                    Number(
                        position.coords.longitude
                    );


                if (
                    !Number.isFinite(
                        latitude
                    ) ||
                    !Number.isFinite(
                        longitude
                    )
                ) {

                    setLocationLoading(
                        false
                    );

                    setLocationError(
                        "Browser returned an invalid location."
                    );

                    return;

                }


                const location = {

                    lat:
                        latitude,

                    lng:
                        longitude

                };


                setUserLocation(
                    location
                );


                setSelectedReport(
                    location
                );


                setLocationLoading(
                    false
                );


                setLocationSuccess(
                    true
                );


                setTimeout(
                    () => {

                        setLocationSuccess(
                            false
                        );

                    },
                    4000
                );

            },


            locationError => {

                console.error(
                    "GPS error:",
                    locationError
                );


                setLocationLoading(
                    false
                );


                if (
                    locationError.code === 1
                ) {

                    setLocationError(
                        "Location permission was denied. Click the 🔒 icon beside the browser address bar, allow Location, and try again."
                    );

                } else if (
                    locationError.code === 2
                ) {

                    setLocationError(
                        "Your location could not be determined. Turn on Windows Location Services and try again."
                    );

                } else if (
                    locationError.code === 3
                ) {

                    setLocationError(
                        "Location detection timed out. Please try again."
                    );

                } else {

                    setLocationError(
                        "Unable to detect your location."
                    );

                }

            },


            {

                enableHighAccuracy:
                    true,

                timeout:
                    30000,

                maximumAge:
                    0

            }

        );

    }


    // =====================================================
    // CATEGORIES
    // =====================================================

    const categories = [

        "All",

        "Road",

        "Drainage",

        "Streetlight",

        "Waste",

        "Pollution",

        "Water",

        "Other"

    ];


    // =====================================================
    // FILTER
    // =====================================================

    const filteredReports =
        useMemo(() => {

            if (
                selectedCategory ===
                "All"
            ) {

                return reports;

            }


            return reports.filter(

                report =>

                    String(
                        report.category ||
                        "Other"
                    )
                        .toLowerCase()
                        ===
                    selectedCategory.toLowerCase()

            );

        }, [

            reports,

            selectedCategory

        ]);


    // =====================================================
    // MAPPED REPORTS
    // =====================================================

    const mappedReports =
        useMemo(

            () =>
                reports.filter(

                    report =>

                        Number.isFinite(
                            report.lat
                        ) &&

                        Number.isFinite(
                            report.lng
                        )

                ),

            [
                reports
            ]

        );


    // =====================================================
    // UNMAPPED REPORTS
    // =====================================================

    const unmappedReports =
        useMemo(

            () =>
                reports.filter(

                    report =>

                        !Number.isFinite(
                            report.lat
                        ) ||

                        !Number.isFinite(
                            report.lng
                        )

                ),

            [
                reports
            ]

        );


    // =====================================================
    // NEARBY
    // =====================================================

    const nearbyReports =
        useMemo(() => {

            if (!userLocation) {
                return [];
            }


            return mappedReports

                .map(report => {

                    const km =
                        distance(

                            userLocation.lat,

                            userLocation.lng,

                            report.lat,

                            report.lng

                        );


                    return {

                        ...report,

                        distance:
                            km

                    };

                })

                .filter(

                    report =>
                        report.distance <= 5

                )

                .sort(

                    (a, b) =>
                        a.distance -
                        b.distance

                );

        }, [

            mappedReports,

            userLocation

        ]);


    // =====================================================
    // STATS
    // =====================================================

    const stats =
        useMemo(() => {

            const total =
                reports.length;


            const high =
                reports.filter(

                    report =>

                        String(

                            report.risk_level ||
                            report.risk ||
                            ""

                        )
                            .toUpperCase()
                            .includes("HIGH")

                ).length;


            const resolved =
                reports.filter(

                    report =>

                        String(
                            report.status ||
                            ""
                        )
                            .toLowerCase()
                            ===
                        "resolved"

                ).length;


            return {

                total,

                mapped:
                    mappedReports.length,

                unmapped:
                    unmappedReports.length,

                high,

                resolved,

                active:
                    total -
                    resolved

            };

        }, [

            reports,

            mappedReports,

            unmappedReports

        ]);


    // =====================================================
    // DEFAULT POSITION
    // =====================================================

    const defaultPosition = [

        11.0168,

        76.9558

    ];


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            className="pulse-map-page"
            style={{
                background:
                    "#f5f7fb",
                minHeight:
                    "100vh",
                paddingBottom:
                    "60px"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="pulse-map-header"
                style={{
                    display:
                        "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                    gap:
                        "25px",
                    padding:
                        "30px 0"
                }}
            >

                <div>

                    <div className="badge">
                        LIVE CIVIC INTELLIGENCE
                    </div>

                    <h1>
                        CivicPulse Map
                    </h1>

                    <p>
                        Real civic problems reported
                        by citizens — mapped by location.
                    </p>

                </div>


                <button

                    className="location-button"

                    onClick={
                        enableGPS
                    }

                    disabled={
                        locationLoading
                    }

                    style={{
                        minWidth:
                            "210px",
                        padding:
                            "15px 22px",
                        borderRadius:
                            "14px",
                        border:
                            "none",
                        background:
                            userLocation
                                ? "#16a34a"
                                : "#2563eb",
                        color:
                            "white",
                        fontWeight:
                            "700",
                        fontSize:
                            "15px",
                        cursor:
                            locationLoading
                                ? "wait"
                                : "pointer",
                        boxShadow:
                            "0 8px 20px rgba(37,99,235,.20)"
                    }}

                >

                    📍{" "}

                    {locationLoading

                        ? "Detecting location..."

                        : userLocation

                        ? "Location detected ✓"

                        : "Use My Location"

                    }

                </button>

            </div>


            {/* =================================================
                LOCATION SUCCESS
            ================================================= */}

            {locationSuccess && (

                <div
                    style={{
                        marginBottom:
                            "15px",
                        padding:
                            "14px 18px",
                        borderRadius:
                            "12px",
                        background:
                            "#dcfce7",
                        color:
                            "#166534",
                        border:
                            "1px solid #86efac",
                        fontWeight:
                            "600"
                    }}
                >

                    📍 Your location was detected successfully.
                    The map moved to your current position.

                </div>

            )}


            {/* =================================================
                LOCATION ERROR
            ================================================= */}

            {locationError && (

                <div
                    style={{
                        marginBottom:
                            "15px",
                        padding:
                            "16px 20px",
                        borderRadius:
                            "12px",
                        background:
                            "#fff1f2",
                        border:
                            "1px solid #fecdd3",
                        color:
                            "#9f1239",
                        lineHeight:
                            "1.6"
                    }}
                >

                    ⚠️{" "}
                    {locationError}

                </div>

            )}


            {/* =================================================
                SERVER ERROR
            ================================================= */}

            {error && (

                <div
                    style={{
                        marginBottom:
                            "15px",
                        padding:
                            "14px 18px",
                        borderRadius:
                            "12px",
                        background:
                            "#fff7ed",
                        border:
                            "1px solid #fed7aa",
                        color:
                            "#9a3412"
                    }}
                >

                    ℹ️ {error}

                </div>

            )}


            {/* =================================================
                LOCATION STATUS
            ================================================= */}

            <div
                style={{
                    display:
                        "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "space-between",
                    gap:
                        "20px",
                    marginBottom:
                        "20px",
                    padding:
                        "18px 22px",
                    background:
                        "white",
                    borderRadius:
                        "16px",
                    border:
                        "1px solid #e5e7eb",
                    boxShadow:
                        "0 5px 18px rgba(15,23,42,.06)"
                }}
            >

                <div>

                    <strong
                        style={{
                            display:
                                "block",
                            fontSize:
                                "16px",
                            color:
                                "#111827",
                            marginBottom:
                                "5px"
                        }}
                    >

                        {userLocation

                            ? "📍 Your live location is active"

                            : "📍 Location not detected yet"

                        }

                    </strong>


                    <span
                        style={{
                            color:
                                "#64748b",
                            fontSize:
                                "14px"
                        }}
                    >

                        {userLocation

                            ? `Latitude: ${userLocation.lat.toFixed(6)} • Longitude: ${userLocation.lng.toFixed(6)}`

                            : "Click “Use My Location” and allow browser location access."

                        }

                    </span>

                </div>


                {userLocation && (

                    <div
                        style={{
                            padding:
                                "8px 14px",
                            borderRadius:
                                "999px",
                            background:
                                "#dcfce7",
                            color:
                                "#166534",
                            fontWeight:
                                "700",
                            fontSize:
                                "13px"
                        }}
                    >

                        ● GPS ACTIVE

                    </div>

                )}

            </div>


            {/* =================================================
                REPORT MAP STATISTICS
            ================================================= */}

            <div
                style={{
                    display:
                        "grid",
                    gridTemplateColumns:
                        "repeat(4, 1fr)",
                    gap:
                        "15px",
                    marginBottom:
                        "20px"
                }}
            >

                <div
                    style={{
                        background:
                            "white",
                        padding:
                            "18px",
                        borderRadius:
                            "16px",
                        border:
                            "1px solid #e5e7eb"
                    }}
                >

                    <small>
                        TOTAL REPORTS
                    </small>

                    <strong
                        style={{
                            display:
                                "block",
                            fontSize:
                                "30px",
                            marginTop:
                                "5px"
                        }}
                    >
                        {stats.total}
                    </strong>

                </div>


                <div
                    style={{
                        background:
                            "#eff6ff",
                        padding:
                            "18px",
                        borderRadius:
                            "16px",
                        border:
                            "1px solid #bfdbfe"
                    }}
                >

                    <small>
                        📍 MAPPED
                    </small>

                    <strong
                        style={{
                            display:
                                "block",
                            fontSize:
                                "30px",
                            color:
                                "#2563eb",
                            marginTop:
                                "5px"
                        }}
                    >
                        {stats.mapped}
                    </strong>

                </div>


                <div
                    style={{
                        background:
                            "#fff7ed",
                        padding:
                            "18px",
                        borderRadius:
                            "16px",
                        border:
                            "1px solid #fed7aa"
                    }}
                >

                    <small>
                        🗺️ NEED LOCATION
                    </small>

                    <strong
                        style={{
                            display:
                                "block",
                            fontSize:
                                "30px",
                            color:
                                "#ea580c",
                            marginTop:
                                "5px"
                        }}
                    >
                        {stats.unmapped}
                    </strong>

                </div>


                <div
                    style={{
                        background:
                            "#fef2f2",
                        padding:
                            "18px",
                        borderRadius:
                            "16px",
                        border:
                            "1px solid #fecaca"
                    }}
                >

                    <small>
                        🚨 HIGH RISK
                    </small>

                    <strong
                        style={{
                            display:
                                "block",
                            fontSize:
                                "30px",
                            color:
                                "#dc2626",
                            marginTop:
                                "5px"
                        }}
                    >
                        {stats.high}
                    </strong>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div
                className="map-toolbar"
                style={{
                    marginBottom:
                        "15px"
                }}
            >

                <div
                    className="map-filters"
                >

                    {categories.map(
                        category => (

                            <button

                                key={
                                    category
                                }

                                className={

                                    selectedCategory ===
                                    category

                                        ? "active-filter"

                                        : ""

                                }

                                onClick={() =>
                                    setSelectedCategory(
                                        category
                                    )
                                }

                            >

                                {

                                    category ===
                                    "All"

                                        ? "🌐"

                                        : icons[
                                            category
                                        ]

                                }

                                {" "}

                                {category}

                            </button>

                        )
                    )}

                </div>

            </div>


            {/* =================================================
                MAP
            ================================================= */}

            <div
                className="real-map"
                style={{
                    height:
                        "650px",
                    borderRadius:
                        "20px",
                    overflow:
                        "hidden",
                    border:
                        "1px solid #dbe1ea",
                    boxShadow:
                        "0 12px 35px rgba(15,23,42,.12)"
                }}
            >

                <MapContainer

                    center={
                        defaultPosition
                    }

                    zoom={
                        13
                    }

                    scrollWheelZoom={
                        true
                    }

                    whenReady={() =>
                        setMapReady(true)
                    }

                    style={{
                        height:
                            "100%",
                        width:
                            "100%"
                    }}

                >

                    <TileLayer

                        attribution='&copy; OpenStreetMap contributors'

                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                    />


                    {/* MAP CONTROLLER */}

                    <MapController
                        target={
                            selectedReport
                        }
                    />


                    {/* =================================================
                        USER LOCATION
                    ================================================= */}

                    {userLocation && (

                        <>

                            <Marker

                                position={[

                                    userLocation.lat,

                                    userLocation.lng

                                ]}

                                icon={
                                    userIcon
                                }

                            >

                                <Popup>

                                    <div
                                        style={{
                                            minWidth:
                                                "220px"
                                        }}
                                    >

                                        <h3>
                                            📍 You are here
                                        </h3>

                                        <p>
                                            CivicPulse is
                                            using your current
                                            location.
                                        </p>

                                        <p>
                                            <strong>
                                                Latitude:
                                            </strong>{" "}
                                            {userLocation.lat.toFixed(6)}
                                        </p>

                                        <p>
                                            <strong>
                                                Longitude:
                                            </strong>{" "}
                                            {userLocation.lng.toFixed(6)}
                                        </p>

                                    </div>

                                </Popup>

                            </Marker>


                            <Circle

                                center={[

                                    userLocation.lat,

                                    userLocation.lng

                                ]}

                                radius={
                                    5000
                                }

                                pathOptions={{
                                    fillOpacity:
                                        0.05,
                                    weight:
                                        2
                                }}

                            />

                        </>

                    )}


                    {/* =================================================
                        CIVIC REPORT MARKERS
                    ================================================= */}

                    {filteredReports

                        .filter(

                            report =>

                                Number.isFinite(
                                    report.lat
                                ) &&

                                Number.isFinite(
                                    report.lng
                                )

                        )

                        .map(

                            report => {

                                const risk =
                                    String(

                                        report.risk_level ||
                                        report.risk ||
                                        ""

                                    )
                                        .toUpperCase();


                                const reportId =
                                    report.id ??
                                    report.report_id ??
                                    `${report.category}-${report.location}-${report.description}`;


                                return (

                                    <Marker

                                        key={
                                            String(
                                                reportId
                                            )
                                        }

                                        position={[

                                            report.lat,

                                            report.lng

                                        ]}

                                        icon={

                                            createIcon(

                                                report.category,

                                                risk

                                            )

                                        }

                                        eventHandlers={{

                                            click: () => {

                                                setSelectedReport(
                                                    report
                                                );

                                            }

                                        }}

                                    >

                                        <Popup>

                                            <div
                                                style={{
                                                    minWidth:
                                                        "280px",
                                                    maxWidth:
                                                        "340px"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap:
                                                            "10px"
                                                    }}
                                                >

                                                    <span
                                                        style={{
                                                            fontSize:
                                                                "32px"
                                                        }}
                                                    >

                                                        {
                                                            icons[
                                                                report.category
                                                            ] ||
                                                            "⚠️"
                                                        }

                                                    </span>


                                                    <div>

                                                        <h3
                                                            style={{
                                                                margin:
                                                                    "0"
                                                            }}
                                                        >

                                                            {
                                                                report.problem ||
                                                                "Civic Issue"
                                                            }

                                                        </h3>

                                                        <small>
                                                            Report #{reportId}
                                                        </small>

                                                    </div>

                                                </div>


                                                <hr />


                                                <p>

                                                    <strong>
                                                        Description
                                                    </strong>

                                                    <br />

                                                    {
                                                        report.description
                                                    }

                                                </p>


                                                <p>

                                                    📍{" "}

                                                    <strong>
                                                        Location
                                                    </strong>

                                                    <br />

                                                    {
                                                        report.location
                                                    }

                                                </p>


                                                <p>

                                                    🚦{" "}

                                                    <strong>
                                                        Status:
                                                    </strong>{" "}

                                                    {
                                                        report.status
                                                    }

                                                </p>


                                                <p>

                                                    ⚠️{" "}

                                                    <strong>
                                                        Risk:
                                                    </strong>{" "}

                                                    {
                                                        report.risk_level
                                                    }

                                                </p>


                                                <p>

                                                    🗺️{" "}

                                                    <strong>
                                                        Coordinates:
                                                    </strong>

                                                    <br />

                                                    {
                                                        report.lat.toFixed(
                                                            6
                                                        )
                                                    }

                                                    {" , "}

                                                    {
                                                        report.lng.toFixed(
                                                            6
                                                        )
                                                    }

                                                </p>


                                                {userLocation && (

                                                    <p>

                                                        📏{" "}

                                                        <strong>
                                                            Distance:
                                                        </strong>{" "}

                                                        {

                                                            distance(

                                                                userLocation.lat,

                                                                userLocation.lng,

                                                                report.lat,

                                                                report.lng

                                                            ).toFixed(
                                                                2
                                                            )

                                                        }

                                                        {" km from you"}

                                                    </p>

                                                )}


                                                <div
                                                    style={{
                                                        marginTop:
                                                            "12px",
                                                        padding:
                                                            "12px",
                                                        borderRadius:
                                                            "10px",
                                                        background:
                                                            risk ===
                                                            "HIGH"

                                                                ? "#fee2e2"

                                                                : risk ===
                                                                  "MEDIUM"

                                                                ? "#fef3c7"

                                                                : "#eff6ff"
                                                    }}
                                                >

                                                    {

                                                        risk ===
                                                        "HIGH"

                                                            ? "🚨 High-risk civic issue"

                                                            : risk ===
                                                              "MEDIUM"

                                                            ? "⚠️ Moderate civic concern"

                                                            : "ℹ️ Reported civic issue"

                                                    }

                                                </div>

                                            </div>

                                        </Popup>

                                    </Marker>

                                );

                            }

                        )}

                </MapContainer>

            </div>


            {/* =================================================
                MAP STATUS
            ================================================= */}

            <div
                style={{
                    marginTop:
                        "15px",
                    padding:
                        "16px 20px",
                    background:
                        "white",
                    border:
                        "1px solid #e5e7eb",
                    borderRadius:
                        "14px",
                    display:
                        "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                    gap:
                        "15px"
                }}
            >

                <div>

                    <strong>
                        📍 {filteredReports.length} reports in this view
                    </strong>

                    <p
                        style={{
                            margin:
                                "5px 0 0",
                            color:
                                "#64748b",
                            fontSize:
                                "14px"
                        }}
                    >

                        {stats.mapped} report(s) currently have
                        coordinates and can be shown on the map.

                    </p>

                </div>


                {loading && (

                    <span>
                        🔄 Updating...
                    </span>

                )}

            </div>


            {/* =================================================
                CIVIC RADAR
            ================================================= */}

            {userLocation && (

                <div
                    className="nearby-panel"
                    style={{
                        marginTop:
                            "25px"
                    }}
                >

                    <div>

                        <div className="badge">
                            YOUR CIVIC RADAR
                        </div>


                        <h2>
                            Problems Around You
                        </h2>


                        <p>
                            Showing citizen reports
                            within a 5 km radius.
                        </p>

                    </div>


                    <div
                        className="nearby-count"
                    >

                        <strong>
                            {
                                nearbyReports.length
                            }
                        </strong>

                        <span>
                            issues nearby
                        </span>

                    </div>

                </div>

            )}


            {/* =================================================
                NEARBY REPORTS
            ================================================= */}

            {userLocation &&
                nearbyReports.length > 0 && (

                    <div
                        className="nearby-list"
                    >

                        {nearbyReports
                            .slice(0, 10)
                            .map(report => (

                                <button

                                    key={String(
                                        report.id ??
                                        report.report_id ??
                                        report.location
                                    )}

                                    type="button"

                                    className="nearby-item"

                                    onClick={() => {

                                        setSelectedReport(
                                            report
                                        );

                                    }}

                                    style={{
                                        width:
                                            "100%",
                                        border:
                                            "none",
                                        textAlign:
                                            "left",
                                        cursor:
                                            "pointer"
                                    }}

                                >

                                    <div
                                        className="nearby-icon"
                                    >

                                        {
                                            icons[
                                                report.category
                                            ] ||
                                            "⚠️"
                                        }

                                    </div>


                                    <div>

                                        <strong>

                                            {
                                                report.problem ||
                                                report.category ||
                                                "Civic Issue"
                                            }

                                        </strong>


                                        <p>

                                            {
                                                report.location
                                            }

                                            {" • "}

                                            {
                                                report.distance.toFixed(
                                                    2
                                                )
                                            }

                                            {" km away"}

                                        </p>

                                    </div>


                                    <span>

                                        {
                                            report.risk_level ||
                                            report.risk ||
                                            "Reported"
                                        }

                                    </span>

                                </button>

                            ))}

                    </div>

                )}


            {/* =================================================
                NO NEARBY
            ================================================= */}

            {userLocation &&
                !loading &&
                nearbyReports.length === 0 && (

                    <div
                        className="no-nearby"
                    >

                        <div>
                            🟢
                        </div>

                        <h2>
                            No reported problems within 5 km
                        </h2>

                        <p>
                            Your location is working correctly.
                            There are simply no mapped reports
                            within 5 km of your current position.
                        </p>

                    </div>

                )}


            {/* =================================================
                REPORTS WITHOUT LOCATION
            ================================================= */}

            {!loading &&
                unmappedReports.length > 0 && (

                    <div
                        style={{
                            marginTop:
                                "20px",
                            padding:
                                "18px 20px",
                            borderRadius:
                                "14px",
                            background:
                                "#fff7ed",
                            border:
                                "1px solid #fed7aa",
                            color:
                                "#9a3412"
                        }}
                    >

                        <strong>
                            📍 {unmappedReports.length} report(s)
                            could not be placed on the map.
                        </strong>


                        <p
                            style={{
                                marginBottom:
                                    "10px"
                            }}
                        >

                            These reports do not contain usable
                            GPS coordinates and their location text
                            could not be converted into coordinates.

                        </p>


                        {unmappedReports
                            .slice(0, 5)
                            .map(
                                (report, index) => (

                                    <div
                                        key={index}
                                        style={{
                                            padding:
                                                "8px 0",
                                            borderTop:
                                                "1px solid #fed7aa"
                                        }}
                                    >

                                        <strong>
                                            {
                                                report.problem ||
                                                report.category ||
                                                "Civic Issue"
                                            }
                                        </strong>

                                        {" — "}

                                        {
                                            report.location
                                        }

                                    </div>

                                )
                            )}

                    </div>

                )}


            {/* =================================================
                NO REPORTS
            ================================================= */}

            {!loading &&
                reports.length === 0 && (

                    <div
                        className="no-nearby"
                        style={{
                            marginTop:
                                "20px"
                        }}
                    >

                        <div>
                            📭
                        </div>


                        <h2>
                            No CivicPulse reports yet
                        </h2>


                        <p>
                            Submit a civic problem from
                            the Report Problem page.
                            Once it is saved, it will
                            appear here.
                        </p>

                    </div>

                )}


            {/* =================================================
                LEGEND
            ================================================= */}

            <div
                className="map-legend"
                style={{
                    marginTop:
                        "20px"
                }}
            >

                <strong>
                    Civic Issue Map
                </strong>


                <div>
                    🚧 Road / Pothole
                </div>

                <div>
                    🗑️ Waste / Garbage
                </div>

                <div>
                    💡 Broken Streetlight
                </div>

                <div>
                    🚰 Drainage
                </div>

                <div>
                    💧 Water Problem
                </div>

                <div>
                    🌫️ Pollution
                </div>

                <div>
                    🔴 High Risk
                </div>

            </div>

        </div>

    );

}


export default PulseMap;