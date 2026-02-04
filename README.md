# Smart Complaint Management System

## Overview
The Smart Complaint Management System is a web-based application designed to digitize and streamline the complaint handling process in institutions such as colleges, offices, and organizations. The system enables users to submit complaints, track their status, and interact through role-based dashboards, ensuring transparency and efficient resolution.

## Objectives
- To provide a centralized platform for complaint registration and tracking  
- To implement role-based access for users, staff, and administrators  
- To improve efficiency, accountability, and transparency in complaint management  

## System Architecture
The application follows a modular architecture with clear separation of concerns:

- **Frontend**: Handles user interaction and client-side logic  
- **Backend**: Manages server-side processing and business logic  
- **Database**: Stores user details, complaints, and status information  

This structure ensures scalability, maintainability, and ease of future enhancements.

## Features
- Complaint registration with category and detailed description  
- Lifecycle-based complaint status tracking  
  - New  
  - In Progress  
  - On Hold  
  - Resolved  
- Role-based dashboards for:
  - Users
  - Staff
  - Administrators
- Modular and responsive frontend design  
- Clean and organized project structure  

## Tech Stack
### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend
- PHP

### Database
- MySQL

## Project Structure
smart-complaint-system/
│
├── frontend/
│ ├── index.html
│ ├── login.html
│ ├── register.html
│ ├── user-dashboard.html
│ ├── admin-dashboard.html
│ ├── staff-dashboard.html
│ ├── styles.css
│ └── script.js
│
├── backend/
│ ├── config.php
│ ├── db.sql
│ ├── add-complaint.php
│ ├── get-complaints.php
│ ├── update-status.php
│ ├── login.php
│ └── register.php
│
├── docs/
│ ├── abstract.md
│ ├── modules.md
│ └── diagrams.md
│
├── README.md
└── LICENSE


## Installation and Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Dharshini-punniyamoorthi/smart-complaint-system.git
2.Move the project folder to the htdocs directory (XAMPP).
3.Start Apache and MySQL from the XAMPP Control Panel.
4.Open frontend files in a web browser.
5.Import the database using db.sql when backend integration is enabled.

## Use Cases
-Students or employees can submit complaints online
-Staff can view and update complaint statuses
-Administrators can monitor complaints and system activity

## Future Enhancements
-Secure authentication and authorization
-Automated complaint routing to departments
-Email/SMS notification system
-Admin analytics and reporting dashboard
-Feedback and rating system after resolution

License
This project is licensed under the MIT License.
