# =========================================
# CIVICPULSE AI - CIVIC RIPPLE ENGINE
# =========================================


RIPPLE_RULES = {

    "Waste": {
        "chain": [
            "Waste accumulation",
            "Drain blockage",
            "Water stagnation",
            "Waterlogging"
        ],

        "risk": "High",

        "recommendation":
            "Clear accumulated waste and inspect nearby drainage before rainfall."
    },


    "Drainage": {
        "chain": [
            "Blocked drainage",
            "Water stagnation",
            "Road waterlogging",
            "Flood risk"
        ],

        "risk": "High",

        "recommendation":
            "Prioritize drain cleaning and check nearby low-lying areas."
    },


    "Water": {
        "chain": [
            "Water leakage",
            "Water wastage",
            "Roadside water accumulation",
            "Infrastructure damage"
        ],

        "risk": "Medium",

        "recommendation":
            "Inspect the leaking pipeline and repair it before further water loss."
    },


    "Road": {
        "chain": [
            "Road damage",
            "Vehicle difficulty",
            "Traffic disruption",
            "Accident risk"
        ],

        "risk": "Medium",

        "recommendation":
            "Inspect the damaged road and prioritize repair based on traffic intensity."
    },


    "Streetlight": {
        "chain": [
            "Broken streetlight",
            "Poor visibility",
            "Reduced night-time safety",
            "Accident risk"
        ],

        "risk": "Medium",

        "recommendation":
            "Repair the streetlight and inspect nearby lights for similar failures."
    }

}


def generate_ripple(problem):

    """
    Generate possible consequences
    for a detected civic problem.
    """

    if problem in RIPPLE_RULES:

        data = RIPPLE_RULES[problem]

        return {

            "problem": problem,

            "chain": data["chain"],

            "risk": data["risk"],

            "recommendation": data["recommendation"]

        }


    # Unknown problem

    return {

        "problem": problem,

        "chain": [
            problem,
            "Possible secondary impact",
            "Possible community risk"
        ],

        "risk": "Medium",

        "recommendation":
            "Collect more reports from the area before taking preventive action."

    }