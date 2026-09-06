# -----------------------------------------
# CIVICPULSE AI - PROBLEM DETECTOR
# -----------------------------------------

PROBLEM_RULES = {

    "Waste": {
        "keywords": [
            "garbage",
            "waste",
            "trash",
            "dump",
            "litter",
            "rubbish",
            "plastic"
        ],
        "severity": "High",
        "confidence": 92,
        "impact": "Can cause drain blockage, bad smell and pest problems."
    },

    "Drainage": {
        "keywords": [
            "drain",
            "drainage",
            "blocked drain",
            "sewage",
            "overflow",
            "stagnant water"
        ],
        "severity": "High",
        "confidence": 94,
        "impact": "Can cause water stagnation and waterlogging."
    },

    "Water": {
        "keywords": [
            "water leak",
            "leakage",
            "pipe leak",
            "leaking pipe",
            "water wastage"
        ],
        "severity": "Medium",
        "confidence": 90,
        "impact": "Can cause water wastage and infrastructure damage."
    },

    "Road": {
        "keywords": [
            "pothole",
            "road damage",
            "broken road",
            "damaged road",
            "crack",
            "road"
        ],
        "severity": "Medium",
        "confidence": 88,
        "impact": "Can increase accident and traffic risks."
    },

    "Streetlight": {
        "keywords": [
            "streetlight",
            "street light",
            "lamp",
            "dark road",
            "broken light"
        ],
        "severity": "Medium",
        "confidence": 91,
        "impact": "Can reduce visibility and increase safety risks."
    }
}


def detect_problem(category, description):

    category = category or ""
    description = description or ""

    text = (
        category + " " + description
    ).lower()


    # -----------------------------------------
    # FIND MATCH
    # -----------------------------------------

    best_match = None
    best_score = 0


    for problem, details in PROBLEM_RULES.items():

        score = 0

        for keyword in details["keywords"]:

            if keyword in text:
                score += 1


        if score > best_score:

            best_score = score
            best_match = problem


    # -----------------------------------------
    # CATEGORY FALLBACK
    # -----------------------------------------

    if not best_match and category in PROBLEM_RULES:

        best_match = category


    # -----------------------------------------
    # UNKNOWN PROBLEM
    # -----------------------------------------

    if not best_match:

        return {
            "problem": "Unknown Civic Issue",
            "severity": "Medium",
            "confidence": 60,
            "impact": "Further analysis is required.",
            "keywords_found": []
        }


    details = PROBLEM_RULES[best_match]


    # Find matched keywords
    keywords_found = [
        keyword
        for keyword in details["keywords"]
        if keyword in text
    ]


    return {

        "problem": best_match,

        "severity": details["severity"],

        "confidence": details["confidence"],

        "impact": details["impact"],

        "keywords_found": keywords_found

    }