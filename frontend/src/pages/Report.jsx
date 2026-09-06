import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    submitReport
} from "../services/api";

import {
    MapContainer,
    TileLayer,
    Marker,
    Circle,
    useMap
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// =====================================================
// USER LOCATION ICON
// =====================================================

const locationIcon = L.divIcon({

    className: "report-location-marker",

    html: `
        <div style="
            width:26px;
            height:26px;
            background:#2563eb;
            border:4px solid white;
            border-radius:50%;
            box-shadow:
                0 0 0 8px rgba(37,99,235,.18),
                0 5px 15px rgba(0,0,0,.3);
        "></div>
    `,

    iconSize: [26, 26],

    iconAnchor: [13, 13]

});


// =====================================================
// MAP CENTER COMPONENT
// =====================================================

function ReportMapCenter({ location }) {

    const map = useMap();

    useEffect(() => {

        if (!location) {
            return;
        }

        map.flyTo(
            [
                location.lat,
                location.lng
            ],
            16,
            {
                duration: 1
            }
        );

    }, [location, map]);

    return null;
}


// =====================================================
// COMPONENT
// =====================================================

function Report() {

    const navigate = useNavigate();


    const [form, setForm] = useState({

        category: "Waste",

        location: "",

        description: ""

    });


    const [userLocation, setUserLocation] =
        useState(null);


    const [locationLoading, setLocationLoading] =
        useState(true);


    const [locationError, setLocationError] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    const [result, setResult] =
        useState(null);


    const [error, setError] =
        useState("");



    // =====================================================
    // GET LOGGED IN USER
    // =====================================================

    function getLoggedInUser() {

        try {

            const savedUser =
                localStorage.getItem(
                    "civicpulse_user"
                );

            if (!savedUser) {
                return null;
            }

            return JSON.parse(savedUser);

        } catch (error) {

            console.error(
                "Invalid saved user:",
                error
            );

            localStorage.removeItem(
                "civicpulse_user"
            );

            return null;

        }

    }



    // =====================================================
    // GET GPS LOCATION
    // =====================================================

    function getCurrentLocation() {

        if (!navigator.geolocation) {

            setLocationLoading(false);

            setLocationError(
                "Your browser does not support GPS."
            );

            return;

        }


        setLocationLoading(true);

        setLocationError("");


        navigator.geolocation.getCurrentPosition(

            async position => {

                const lat =
                    position.coords.latitude;

                const lng =
                    position.coords.longitude;


                setUserLocation({

                    lat,

                    lng

                });


                /*
                 * Reverse geocode the GPS location
                 * so the citizen sees a readable address.
                 */

                try {

                    const response =
                        await fetch(

                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`

                        );


                    const data =
                        await response.json();


                    if (data.display_name) {

                        setForm(prev => ({

                            ...prev,

                            location:
                                data.display_name

                        }));

                    }

                } catch (error) {

                    console.warn(
                        "Address lookup failed:",
                        error
                    );

                    setForm(prev => ({

                        ...prev,

                        location:
                            `${lat.toFixed(6)}, ${lng.toFixed(6)}`

                    }));

                }


                setLocationLoading(false);

            },


            error => {

                console.error(
                    "GPS ERROR:",
                    error
                );


                setLocationLoading(false);


                setLocationError(
                    "GPS permission was denied. Please allow location access to place your report accurately on the CivicPulse map."
                );

            },


            {

                enableHighAccuracy: true,

                timeout: 15000,

                maximumAge: 0

            }

        );

    }



    // =====================================================
    // GET LOCATION WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        getCurrentLocation();

    }, []);



    // =====================================================
    // FORM CHANGE
    // =====================================================

    function handleChange(event) {

        const {
            name,
            value
        } = event.target;


        setForm(prev => ({

            ...prev,

            [name]: value

        }));


        setError("");

    }



    // =====================================================
    // SUBMIT
    // =====================================================

    async function handleSubmit(event) {

        event.preventDefault();


        setError("");

        setResult(null);


        const user =
            getLoggedInUser();


        // -------------------------------------------------
        // LOGIN
        // -------------------------------------------------

        if (!user || !user.id) {

            setError(
                "Your login session was not found. Please login again."
            );


            setTimeout(() => {

                navigate("/login");

            }, 1200);


            return;

        }


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!form.category.trim()) {

            setError(
                "Please select a problem category."
            );

            return;

        }


        if (!form.location.trim()) {

            setError(
                "Problem location is required."
            );

            return;

        }


        if (!form.description.trim()) {

            setError(
                "Please describe the problem."
            );

            return;

        }


        /*
         * IMPORTANT
         *
         * We now REQUIRE GPS coordinates.
         */

        if (!userLocation) {

            setError(
                "Your exact location has not been captured. Click 'Detect My Location' and try again."
            );

            return;

        }


        setLoading(true);


        try {

            console.log(
                "Submitting CivicPulse report:",
                {

                    category:
                        form.category,

                    location:
                        form.location,

                    latitude:
                        userLocation.lat,

                    longitude:
                        userLocation.lng,

                    citizen_id:
                        user.id

                }
            );


            // -------------------------------------------------
            // SEND REPORT
            // -------------------------------------------------

            const response =
                await submitReport({

                    category:
                        form.category,

                    location:
                        form.location.trim(),

                    description:
                        form.description.trim(),

                    citizen_id:
                        user.id,

                    latitude:
                        userLocation.lat,

                    longitude:
                        userLocation.lng

                });


            console.log(
                "CivicPulse response:",
                response
            );


            if (
                !response ||
                !response.success
            ) {

                throw new Error(

                    response?.message ||

                    "Report submission failed."

                );

            }


            const report =
                response.report ||
                response;


            // -------------------------------------------------
            // CREATE MAP-READY REPORT
            // -------------------------------------------------

            const newReport = {

                ...report,

                id:
                    report.id ||
                    `CP-${Date.now()}`,

                citizen_id:
                    user.id,

                citizen_name:
                    user.name,

                citizen_email:
                    user.email,

                category:
                    report.category ||
                    form.category,

                location:
                    report.location ||
                    form.location,

                description:
                    report.description ||
                    form.description,

                latitude:
                    Number(
                        report.latitude ??
                        userLocation.lat
                    ),

                longitude:
                    Number(
                        report.longitude ??
                        userLocation.lng
                    ),

                lat:
                    Number(
                        report.latitude ??
                        userLocation.lat
                    ),

                lng:
                    Number(
                        report.longitude ??
                        userLocation.lng
                    ),

                status:
                    report.status ||
                    "Submitted",

                date:
                    new Date().toLocaleDateString()

            };


            // -------------------------------------------------
            // SAVE LOCAL COPY
            // -------------------------------------------------

            let existingReports = [];


            try {

                existingReports =
                    JSON.parse(

                        localStorage.getItem(
                            "civicpulse_reports"
                        ) ||
                        "[]"

                    );

            } catch {

                existingReports = [];

            }


            existingReports.push(
                newReport
            );


            localStorage.setItem(

                "civicpulse_reports",

                JSON.stringify(
                    existingReports
                )

            );


            // -------------------------------------------------
            // RESULT
            // -------------------------------------------------

            setResult(
                newReport
            );


            // -------------------------------------------------
            // CLEAR DESCRIPTION ONLY
            // -------------------------------------------------

            setForm(prev => ({

                ...prev,

                description: ""

            }));


        } catch (err) {

            console.error(
                "REPORT ERROR:",
                err
            );


            setError(

                err.message ||

                "Unable to submit report."

            );

        } finally {

            setLoading(false);

        }

    }



    // =====================================================
    // DEFAULT MAP
    // =====================================================

    const defaultPosition = [

        11.0168,

        76.9558

    ];



    // =====================================================
    // RENDER
    // =====================================================

    return (

        <main className="report-page">

            <div className="report-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="report-heading">

                    <div className="badge">

                        CIVICPULSE CIVIC REPORT

                    </div>


                    <h1>

                        Report a Problem

                    </h1>


                    <p>

                        Report a real civic problem with
                        your exact location. CivicPulse will
                        place it on the community map so
                        nearby citizens and authorities can
                        see it.

                    </p>

                </div>



                {/* =================================================
                    LOCATION CARD
                ================================================= */}

                <div
                    className="report-location-card"
                    style={{
                        marginBottom: "25px",
                        borderRadius: "18px",
                        overflow: "hidden",
                        border: "1px solid #dbe3ef",
                        background: "#ffffff",
                        boxShadow:
                            "0 12px 35px rgba(15,23,42,.08)"
                    }}
                >

                    <div
                        style={{
                            padding: "18px 20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "15px"
                        }}
                    >

                        <div>

                            <strong
                                style={{
                                    fontSize: "17px"
                                }}
                            >

                                📍 Report Location

                            </strong>


                            <p
                                style={{
                                    margin:
                                        "5px 0 0",
                                    color:
                                        "#64748b"
                                }}
                            >

                                {locationLoading

                                    ? "Detecting your exact location..."

                                    : userLocation

                                    ? "Exact GPS location captured"

                                    : "Location not detected"

                                }

                            </p>

                        </div>


                        <button

                            type="button"

                            onClick={
                                getCurrentLocation
                            }

                            style={{
                                border: "none",
                                borderRadius: "10px",
                                padding:
                                    "10px 15px",
                                background:
                                    "#2563eb",
                                color: "white",
                                fontWeight: "700",
                                cursor: "pointer"
                            }}

                        >

                            📍

                            {locationLoading

                                ? " Detecting..."

                                : " Detect My Location"

                            }

                        </button>

                    </div>


                    <div
                        style={{
                            height: "280px"
                        }}
                    >

                        <MapContainer

                            center={
                                userLocation
                                    ? [
                                        userLocation.lat,
                                        userLocation.lng
                                    ]
                                    : defaultPosition
                            }

                            zoom={
                                userLocation
                                    ? 16
                                    : 13
                            }

                            scrollWheelZoom={true}

                            style={{
                                height: "100%",
                                width: "100%"
                            }}

                        >

                            <TileLayer

                                attribution='&copy; OpenStreetMap contributors'

                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                            />


                            <ReportMapCenter
                                location={
                                    userLocation
                                }
                            />


                            {userLocation && (

                                <>

                                    <Marker

                                        position={[
                                            userLocation.lat,
                                            userLocation.lng
                                        ]}

                                        icon={
                                            locationIcon
                                        }

                                    />


                                    <Circle

                                        center={[
                                            userLocation.lat,
                                            userLocation.lng
                                        ]}

                                        radius={100}

                                        pathOptions={{
                                            fillOpacity:
                                                0.10
                                        }}

                                    />

                                </>

                            )}

                        </MapContainer>

                    </div>

                </div>



                {/* =================================================
                    FORM
                ================================================= */}

                <form

                    className="report-form"

                    onSubmit={
                        handleSubmit
                    }

                    autoComplete="off"

                    noValidate

                >


                    {/* CATEGORY */}

                    <div className="form-group">

                        <label>
                            Problem Category
                        </label>


                        <select

                            name="category"

                            value={
                                form.category
                            }

                            onChange={
                                handleChange
                            }

                        >

                            <option value="Waste">
                                🗑️ Waste / Garbage
                            </option>

                            <option value="Road">
                                🚧 Damaged Road / Pothole
                            </option>

                            <option value="Water">
                                💧 Water Problem
                            </option>

                            <option value="Drainage">
                                🚰 Drainage / Flooding
                            </option>

                            <option value="Streetlight">
                                💡 Broken Streetlight
                            </option>

                            <option value="Pollution">
                                🌫️ Pollution
                            </option>

                            <option value="Other">
                                ⚠️ Other Civic Problem
                            </option>

                        </select>

                    </div>



                    {/* LOCATION */}

                    <div className="form-group">

                        <label>
                            Problem Location
                        </label>


                        <input

                            type="text"

                            name="location"

                            placeholder="Your detected location"

                            value={
                                form.location
                            }

                            onChange={
                                handleChange
                            }

                        />


                        <small>

                            📍 GPS:

                            {" "}

                            {userLocation

                                ? `${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}`

                                : "Not captured"

                            }

                        </small>

                    </div>



                    {/* DESCRIPTION */}

                    <div className="form-group">

                        <label>
                            Describe the Problem
                        </label>


                        <textarea

                            name="description"

                            placeholder="Example: Large amount of garbage has been dumped beside the road for several days..."

                            value={
                                form.description
                            }

                            onChange={
                                handleChange
                            }

                            rows={6}

                        />

                    </div>



                    {/* LOCATION ERROR */}

                    {locationError && (

                        <div
                            className="error-box"
                        >

                            📍 {locationError}

                        </div>

                    )}



                    {/* ERROR */}

                    {error && (

                        <div
                            className="error-box"
                        >

                            ❌ {error}

                        </div>

                    )}



                    {/* SUBMIT */}

                    <button

                        type="submit"

                        disabled={
                            loading ||
                            locationLoading
                        }

                        className="submit-button"

                    >

                        {loading

                            ? "⏳ Analysing & Mapping..."

                            : "📍 Submit Civic Report"

                        }

                    </button>

                </form>



                {/* =================================================
                    AI RESULT
                ================================================= */}

                {result && (

                    <section
                        className="ai-result"
                    >

                        <div className="badge">
                            REPORT MAPPED SUCCESSFULLY
                        </div>


                        <h2>
                            CivicPulse AI Result
                        </h2>


                        <div className="result-grid">


                            <div className="result-card">

                                <small>
                                    DETECTED PROBLEM
                                </small>

                                <strong>
                                    {
                                        result.problem ||
                                        result.category ||
                                        "Civic Issue"
                                    }
                                </strong>

                            </div>


                            <div className="result-card">

                                <small>
                                    SEVERITY
                                </small>

                                <strong>
                                    {
                                        result.severity ||
                                        "Analysed"
                                    }
                                </strong>

                            </div>


                            <div className="result-card">

                                <small>
                                    RISK SCORE
                                </small>

                                <strong>
                                    {
                                        result.risk_score ??
                                        "—"
                                    }
                                </strong>

                            </div>


                            <div className="result-card">

                                <small>
                                    RISK LEVEL
                                </small>

                                <strong>
                                    {
                                        result.risk_level ||
                                        result.risk ||
                                        "Under Review"
                                    }
                                </strong>

                            </div>

                        </div>


                        <div
                            className="success-box"
                        >

                            ✅ Your civic problem has been
                            submitted with its exact GPS
                            coordinates.

                            <br />

                            📍 It can now be displayed on
                            the CivicPulse community map.

                        </div>

                    </section>

                )}

            </div>

        </main>

    );

}


export default Report;