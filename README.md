# Online Examination System

A full-stack web application for conducting online exams.
Built with **Spring Boot** (Backend) and **React.js** (Frontend).

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Java 17, Spring Boot 3.2, Spring Data JPA, Hibernate |
| Database  | MySQL 8.x                           |
| Frontend  | React.js 18, Bootstrap 5, Axios     |

---

## Project Structure

```
online-exam-system/
├── backend/                        ← Spring Boot project
│   └── src/main/java/com/exam/
│       ├── OnlineExamApplication.java   ← App entry point
│       ├── CorsConfig.java              ← Allow React to call APIs
│       ├── DataInitializer.java         ← Creates default admin
│       ├── controller/
│       │   ├── UserController.java      ← Login, Register APIs
│       │   ├── SubjectController.java   ← Subject CRUD APIs
│       │   ├── ExamController.java      ← Exam CRUD APIs
│       │   ├── QuestionController.java  ← Question CRUD + Word upload
│       │   └── ResultController.java    ← Submit exam, view results
│       ├── service/
│       │   ├── UserService.java
│       │   ├── SubjectService.java
│       │   ├── ExamService.java
│       │   ├── QuestionService.java     ← Word doc parsing logic
│       │   └── ResultService.java       ← Score calculation logic
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── SubjectRepository.java
│       │   ├── ExamRepository.java
│       │   ├── QuestionRepository.java
│       │   └── ResultRepository.java
│       ├── entity/
│       │   ├── User.java
│       │   ├── Subject.java
│       │   ├── Exam.java
│       │   ├── Question.java
│       │   └── Result.java
│       └── dto/
│           ├── LoginRequest.java
│           └── SubmitExamRequest.java
│
└── frontend/                       ← React project
    └── src/
        ├── App.jsx                  ← All routes defined here
        ├── index.js                 ← React entry point
        ├── components/
        │   ├── Navbar.jsx           ← Top navigation bar
        │   └── PrivateRoute.jsx     ← Route protection
        ├── pages/
        │   ├── Login.jsx            ← Login page
        │   ├── Register.jsx         ← Student registration
        │   ├── AdminDashboard.jsx   ← Admin home with stats
        │   ├── StudentDashboard.jsx ← Student home with exams
        │   ├── Subjects.jsx         ← Subject management
        │   ├── Exams.jsx            ← Exam management
        │   ├── Questions.jsx        ← Question management + upload
        │   ├── TakeExam.jsx         ← Exam taking with timer
        │   └── Result.jsx           ← View results
        ├── services/
        │   └── api.js               ← All Axios API calls
        └── css/
            └── style.css            ← Global styles
```

---

## Setup Instructions

### Step 1: Database Setup

1. Open MySQL Workbench or MySQL CLI
2. The database will be created automatically when you run the backend
   (because of `createDatabaseIfNotExist=true` in application.properties)

### Step 2: Backend Setup

1. Open the `backend` folder in IntelliJ IDEA or Eclipse
2. Update `src/main/resources/application.properties` if your MySQL credentials differ:
   ```
   spring.datasource.username=root
   spring.datasource.password=root
   ```
3. Run the project:
   ```
   mvn spring-boot:run
   ```
   OR right-click `OnlineExamApplication.java` → Run As → Spring Boot App

4. Backend runs on: **http://localhost:8080**

### Step 3: Frontend Setup

1. Open terminal in the `frontend` folder
2. Install dependencies:
   ```
   npm install
   ```
3. Start the React app:
   ```
   npm start
   ```
4. Frontend runs on: **http://localhost:3000**

---

## Default Login Credentials

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@exam.com  | admin123  |

> Admin account is auto-created on first startup.
> Students can register themselves from the Register page.

---

## API Endpoints

| Method | URL                              | Description              |
|--------|----------------------------------|--------------------------|
| POST   | /api/auth/login                  | Login                    |
| POST   | /api/auth/register               | Student registration     |
| GET    | /api/subjects                    | Get all subjects         |
| POST   | /api/subjects                    | Add subject              |
| PUT    | /api/subjects/{id}               | Update subject           |
| DELETE | /api/subjects/{id}               | Delete subject           |
| GET    | /api/exams                       | Get all exams            |
| POST   | /api/exams                       | Create exam              |
| PUT    | /api/exams/{id}                  | Update exam              |
| DELETE | /api/exams/{id}                  | Delete exam              |
| GET    | /api/questions/exam/{examId}     | Get questions by exam    |
| POST   | /api/questions                   | Add question manually    |
| POST   | /api/questions/upload/{examId}   | Upload from Word file    |
| PUT    | /api/questions/{id}              | Update question          |
| DELETE | /api/questions/{id}              | Delete question          |
| POST   | /api/results/submit              | Submit exam              |
| GET    | /api/results                     | All results (admin)      |
| GET    | /api/results/student/{email}     | Student results          |
| GET    | /api/results/check               | Check if attempted       |
| GET    | /api/results/dashboard           | Admin dashboard stats    |

---

## Word Document Upload Format

Create a `.docx` file with this format:

```
Question: What is Java?
A. Programming Language
B. Database
C. Browser
D. Operating System
Answer: A
Marks: 2

Question: What does JVM stand for?
A. Java Virtual Memory
B. Java Variable Machine
C. Java Virtual Machine
D. Java Verified Module
Answer: C
Marks: 2
```

---

## Features

### Admin
- Login with admin credentials
- Dashboard with stats (subjects, exams, questions, results)
- Add / Edit / Delete Subjects
- Create / Edit / Delete Exams
- Add questions manually or upload from Word (.docx)
- View all student results

### Student
- Register and Login
- View available exams
- Take exam with countdown timer
- Navigate questions (Next / Previous)
- Auto-submit when time runs out
- View score, percentage, Pass/Fail
- Cannot attempt same exam twice

---

## Database Tables (Auto-created by Hibernate)

- `users` - stores admin and student accounts
- `subjects` - exam subjects
- `exams` - exam details with subject reference
- `questions` - MCQ questions with options and correct answer
- `results` - student exam results

---

*Built for B.Tech Final Year Project*
