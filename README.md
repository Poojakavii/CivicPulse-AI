# CivicPulse-AI
CIVICPULSE AI

A Smart Citizen-to-Officer Civic Issue Reporting and Resolution Platform

CivicPulse AI is a centralized civic issue management platform that connects citizens with responsible officers to make civic problem reporting, tracking, and resolution more transparent and efficient.

PROBLEM STATEMENT

Citizens frequently face civic issues such as damaged roads, drainage problems, water leakage, pollution, and broken streetlights. Traditional complaint systems often make it difficult for citizens to track their complaints and know whether action has actually been taken.

Officers also need a centralized system to receive complaints, manage multiple issues, update their progress, and monitor unresolved problems.

SOLUTION

CivicPulse AI provides a complete digital workflow between citizens and officers.

1. Citizens report a civic issue with its category, description, location, and GPS coordinates.
2. The complaint is stored in the system and displayed on the Officer Dashboard.
3. Officers can view the complaint details and its location.
4. After taking necessary action, the officer marks the complaint as "Action Taken" and provides an update.
5. The citizen can view the officer's action and verify the update.
6. The citizen can confirm whether the issue has been addressed.
7. After confirmation, the complaint is marked as "Resolved".
8. Citizens can track the status of their submitted complaints.
9. Officers can monitor and manage reported issues through a centralized dashboard.
10. A map-based interface helps visualize reported civic issues based on their locations.

KEY FEATURES

Citizen Module

* Citizen registration and login
* Report civic issues
* Select issue category
* Add problem description
* Provide location details
* GPS-based coordinates
* View submitted complaints
* Track complaint status
* View officer action updates
* Confirm completed action
* View resolved complaints

Officer Module

* Officer login
* Centralized complaint dashboard
* View citizen complaints
* View complaint location and details
* Monitor pending complaints
* Take action on reported issues
* Add action/update information
* Mark complaints as "Action Taken"
* Track resolution status
* Manage reported civic issues

Map & Monitoring

* Location-based complaint visualization
* Interactive civic issue map
* View reported issues based on geographical location
* Dashboard statistics for complaint monitoring

Complaint Workflow

Citizen Reports Issue
↓
Complaint Stored in Database
↓
Officer Receives Complaint
↓
Officer Reviews Issue
↓
Officer Takes Action
↓
Officer Marks "Action Taken"
↓
Citizen Views Action
↓
Citizen Confirms Resolution
↓
Complaint Marked "Resolved"

TECHNOLOGY STACK

Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3

Backend

* Python
* Flask
* Flask-CORS
* REST API

Database

* MySQL

Mapping

* Interactive map and GPS-based location support

PROJECT STRUCTURE

CivicPulse-AI/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── components/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── app.py
│   ├── database.py
│   └── requirements.txt
│
└── README.md

DATABASE

CivicPulse AI uses MySQL for persistent storage of application data.

The database stores information such as:

* Citizen accounts
* Officer accounts
* Civic complaints
* Complaint categories
* Descriptions
* Locations
* GPS coordinates
* Complaint status
* Officer action updates
* Resolution information

The system is designed so that civic complaint information is maintained centrally rather than relying on browser-only storage.

GETTING STARTED

Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Python 3
* MySQL
* Git

Frontend Setup

1. Open the frontend folder.

2. Install dependencies:

npm install

3. Start the development server:

npm run dev

Backend Setup

1. Open the backend folder.

2. Install the required Python packages:

pip install -r requirements.txt

3. Configure the MySQL database connection.

4. Start the Flask server:

python app.py

The backend runs on:

[http://127.0.0.1:5000](http://127.0.0.1:5000)

The frontend development server runs on the Vite-provided local URL.

API OVERVIEW

Authentication

POST /api/register

Register a new citizen.

POST /api/login

Authenticate a registered user.

Reports

POST /api/reports

Submit a new civic complaint.

GET /api/reports

Retrieve reported civic issues.

GET /api/reports/{id}

Retrieve a specific complaint.

PUT /api/reports/{id}/status

Update the status of a complaint.

PUT /api/reports/{id}/resolve

Process complaint resolution.

Dashboard

GET /api/dashboard

Retrieve dashboard information and complaint statistics.

IMPACT

CivicPulse AI aims to improve communication between citizens and authorities by providing a transparent complaint lifecycle.

Instead of simply submitting a complaint and waiting for a response, citizens can follow the complete process:

Report → Officer Action → Citizen Verification → Resolution

This creates greater visibility into complaint progress and provides a structured way for officers to manage civic issues.

FUTURE ENHANCEMENTS

* AI-based complaint categorization
* Automatic priority detection
* Duplicate complaint detection
* Smart assignment of complaints to responsible departments
* Notifications for citizens and officers
* Complaint analytics and trend detection
* Image-based civic issue classification
* Advanced geographic heatmaps
* Real-time status notifications

PROJECT GOAL

The goal of CivicPulse AI is to build a transparent, location-aware civic issue management platform where citizens can report problems, officers can take action, and citizens can verify the outcome before an issue is considered resolved.

GITHUB REPOSITORY

[https://github.com/Poojakavii/CivicPulse-AI](https://github.com/Poojakavii/CivicPulse-AI)

Built as a civic technology project focused on improving citizen participation, complaint transparency, and efficient issue resolution.
