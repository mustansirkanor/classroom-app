# Backend API Routes Documentation

This README provides a comprehensive overview of all backend API routes for the classroom-app project. It is intended for frontend engineers to understand available endpoints, their purposes, expected request/response formats, and usage instructions for each API.

---

## Authentication Routes (`routes/auth.js`)

### POST /api/auth/register
**Description:** Register a new user.
**Headers:** None
**Body:**
```
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "student" | "teacher"
}
```
**Response:**
```
{
  "message": "User registered successfully",
  "token": "JWT_TOKEN",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "student" | "teacher"
  }
}
```

### POST /api/auth/login
**Description:** Login user.
**Headers:** None
**Body:**
```
{
  "email": "string",
  "password": "string",
  "role": "student" | "teacher"
}
```
**Response:**
```
{
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "student" | "teacher"
  }
}
```

### GET /api/auth/verify
**Description:** Verify JWT token and get user info.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:**
```
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "student" | "teacher"
  }
}
```

### GET /api/auth/profile
**Description:** Get full user profile (all fields except password).
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:**
```
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "student" | "teacher",
    // ...other fields
  }
}
```

### PATCH /api/auth/profile
**Description:** Update user profile (name, email, password).
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:**
```
{
  "name": "string", // optional
  "email": "string", // optional
  "password": "string", // optional
  "oldPassword": "string" // required if changing password
}
```
**Response:**
```
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### DELETE /api/auth/delete-user
**Description:** Delete user account (student or teacher) and all related data.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** `{ "message": "Account deleted successfully" }`

---

## Student Routes (`routes/student.js`)

### GET /api/student/dashboard
**Description:** Get dashboard stats and enrolled classrooms for student.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:**
```
{
  "classrooms": [ ... ],
  "stats": {
    "totalClassrooms": number,
    "totalSubjects": number,
    "totalMaterials": number,
    "completedMaterials": number,
    "progressPercentage": number
  }
}
```

### POST /api/student/join-class
**Description:** Join a classroom using class code.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:**
```
{
  "classCode": "string"
}
```
**Response:**
```
{
  "message": "Successfully joined classroom",
  "classroom": { ... }
}
```

### GET /api/student/classrooms
**Description:** Get all classrooms student is enrolled in.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** Array of classroom objects

### GET /api/student/subjects/:classroomId
**Description:** Get subjects in a classroom student is enrolled in.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** Array of subject objects

### GET /api/student/materials/:subjectId
**Description:** Get materials for a subject.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** Array of material objects (with progress info)

### GET /api/student/assignments/:subjectId
**Description:** Get assignments for a subject.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** Array of assignment objects

### PATCH /api/student/progress/:materialId
**Description:** Mark material as completed or update progress.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:**
```
{
  "progress": number, // optional, default 100
  "completed": boolean // optional, default true
}
```
**Response:**
```
{
  "message": "Progress updated successfully",
  "progress": { ... }
}
```

### DELETE /api/student/classrooms/:classroomId
**Description:** Remove student from classroom.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** `{ "message": "Removed from classroom successfully" }`

### DELETE /api/student/progress/:materialId
**Description:** Delete student's progress for a material.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** `{ "message": "Progress deleted successfully" }`

### DELETE /api/student/me
**Description:** Delete student's account and related data.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** `{ "message": "Account deleted successfully" }`

### Bulk & Nested Fetches

#### GET /api/student/subjects
Get all subjects for the student (across classrooms).
Headers: `Authorization: Bearer <JWT_TOKEN>`
Response: Array of subject objects

#### GET /api/student/assignments
Get all assignments for the student (across subjects).
Headers: `Authorization: Bearer <JWT_TOKEN>`
Response: Array of assignment objects

#### GET /api/student/materials
Get all materials for the student (across subjects).
Headers: `Authorization: Bearer <JWT_TOKEN>`
Response: Array of material objects

#### GET /api/student/classrooms/:classroomId/subjects
Get all subjects in a classroom.
Headers: `Authorization: Bearer <JWT_TOKEN>`
Response: Array of subject objects

#### GET /api/student/subjects/:subjectId/assignments
Get all assignments in a subject.
Headers: `Authorization: Bearer <JWT_TOKEN>`
Response: Array of assignment objects

#### GET /api/student/subjects/:subjectId/materials
Get all materials in a subject.
Headers: `Authorization: Bearer <JWT_TOKEN>`
Response: Array of material objects

#### GET /api/student/classrooms/:classroomId/assignments
Get all assignments in a classroom.
Headers: `Authorization: Bearer <JWT_TOKEN>`
Response: Array of assignment objects

#### GET /api/student/classrooms/:classroomId/materials
Get all materials in a classroom.
Headers: `Authorization: Bearer <JWT_TOKEN>`
Response: Array of material objects

#### GET /api/student/search-classrooms?query=searchTerm
**Description:** Search for classrooms by name or class code (for students).
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Query Params:**
- `query`: string (required, part or full name/code)
**Response:** Array of matching classroom objects (with teacher info)

---

## Teacher Routes (`routes/teacher.js`)

### GET /api/teacher/dashboard
**Description:** Get dashboard stats and classrooms created by teacher.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:**
```
{
  "classrooms": [ ... ],
  "stats": {
    "totalClassrooms": number,
    "totalStudents": number,
    "totalSubjects": number,
    "totalMaterials": number,
    "totalAssignments": number
  }
}
```

### POST /api/teacher/classroom
**Description:** Create a new classroom.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:**
```
{
  "name": "string",
  "description": "string"
}
```
**Response:**
```
{
  "message": "Classroom created successfully",
  "classroom": { ... }
}
```

### GET /api/teacher/classrooms
**Description:** Get all classrooms created by teacher.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** Array of classroom objects

### POST /api/teacher/subject
**Description:** Create a new subject.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:**
```
{
  "name": "string",
  "description": "string",
  "classroomId": "string"
}
```
**Response:**
```
{
  "message": "Subject created successfully",
  "subject": { ... }
}
```

### POST /api/teacher/material
**Description:** Upload new material with file.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: multipart/form-data`
**Body:**
Form fields:
  - `title`: string
  - `description`: string
  - `type`: string
  - `subjectId`: string
  - `file`: file upload
**Response:**
```
{
  "message": "Material uploaded successfully",
  "material": { ... }
}
```

### POST /api/teacher/assignment
**Description:** Create new assignment (with optional file attachments).
**Headers:** `Authorization: Bearer <JWT_TOKEN>`, `Content-Type: multipart/form-data`
**Body:**
Form fields:
  - `title`: string
  - `description`: string
  - `instructions`: string
  - `dueDate`: string (ISO date)
  - `totalPoints`: number
  - `subjectId`: string
  - `attachments`: file(s) or array of URLs
**Response:**
```
{
  "message": "Assignment created successfully",
  "assignment": { ... }
}
```

### GET /api/teacher/subjects
**Description:** Get all subjects for the teacher.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** Array of subject objects

### GET /api/teacher/assignments
**Description:** Get all assignments for the teacher.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** Array of assignment objects

### GET /api/teacher/materials
**Description:** Get all materials for the teacher.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** Array of material objects

### GET /api/teacher/classrooms/:classroomId/subjects
**Description:** Get all subjects in a classroom.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** Array of subject objects

### GET /api/teacher/subjects/:subjectId/assignments
**Description:** Get all assignments in a subject.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** Array of assignment objects

### GET /api/teacher/subjects/:subjectId/materials
**Description:** Get all materials in a subject.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** Array of material objects

### GET /api/teacher/classrooms/:classroomId/assignments
**Description:** Get all assignments in a classroom.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** Array of assignment objects

### GET /api/teacher/classrooms/:classroomId/materials
**Description:** Get all materials in a classroom.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None
**Response:** Array of material objects

### SIH File API


#### POST /api/teacher/file/brief-overview
Get brief overview for a file (SIH API).
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:**
```json
{
  "fileId": "MATERIAL_ID" // string, required (Material ID)
}
```
**Response:** SIH API output

#### POST /api/teacher/file/assesment
Get assessment for a file (SIH API).
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:**
```json
{
  "fileId": "MATERIAL_ID" // string, required (Material ID)
}
```
**Response:** SIH API output

#### POST /api/teacher/file/podcast
Get podcast for a file (SIH API).
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:**
```json
{
  "fileId": "MATERIAL_ID" // string, required (Material ID)
}
```
**Response:** SIH API output

> **Note:** For all SIH endpoints, you only need to provide the Material ID (`fileId`). The backend will fetch the file URL automatically. You do **not** need to upload any file from the frontend.

### Delete Routes

#### DELETE /api/teacher/classrooms/:classroomId
Delete classroom created by teacher.
Headers: `Authorization: Bearer <JWT_TOKEN>`
Response: `{ "message": "Classroom deleted successfully" }`

#### DELETE /api/teacher/subjects/:subjectId
Delete subject created by teacher.
Headers: `Authorization: Bearer <JWT_TOKEN>`
Response: `{ "message": "Subject deleted successfully" }`

#### DELETE /api/teacher/materials/:materialId
Delete material uploaded by teacher.
Headers: `Authorization: Bearer <JWT_TOKEN>`
Response: `{ "message": "Material deleted successfully" }`

#### DELETE /api/teacher/assignments/:assignmentId
Delete assignment created by teacher.
Headers: `Authorization: Bearer <JWT_TOKEN>`
Response: `{ "message": "Assignment deleted successfully" }`

---

## Notes

- All routes are prefixed with `/api/` and grouped by role (`auth`, `student`, `teacher`).
- Most routes require authentication via JWT in headers (use `Authorization: Bearer <token>`).
- File uploads use `multipart/form-data` for endpoints accepting files.
- Error responses follow `{ error: "message" }` format.

---

For more details, refer to the individual route files in `backend/routes/` or ask the backend team for specific request/response examples.



...existing code...

---

## Additional Student Routes (`routes/student.js`)

### GET /api/student/announcements
**Description:** Get all announcements for all classrooms the student is enrolled in.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Array of announcement objects

### GET /api/student/announcements/:classroomId
**Description:** Get announcements for a specific classroom.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Array of announcement objects

### GET /api/student/classroom/:classroomId
**Description:** Get classroom details for a student.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Classroom object

### GET /api/student/subject/:subjectId
**Description:** Get subject details for a student.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Subject object

### GET /api/student/classrooms-enrolled
**Description:** Get all classrooms where the student is enrolled.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Array of classroom objects

### GET /api/student/subjects-enrolled
**Description:** Get all subjects where the student is enrolled.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Array of subject objects

### GET /api/student/all-subjects
**Description:** Get all subjects for the student.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Array of subject objects

### GET /api/student/all-materials
**Description:** Get all materials for the student.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Array of material objects

### GET /api/student/completed-materials
**Description:** Get all completed materials for the student.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Array of material objects

---

## Additional Teacher Routes (`routes/teacher.js`)

### GET /api/teacher/announcements/:classroomId
**Description:** Get announcements for a classroom.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Array of announcement objects

### POST /api/teacher/announcements/:classroomId
**Description:** Post a new announcement for a classroom.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:**
```
{
  "title": "string",
  "content": "string"
}
```
**Response:**
```
{
  "message": "Announcement posted successfully",
  "announcement": { ... }
}
```

### GET /api/teacher/classroom/:classroomId
**Description:** Get classroom by ID with populated students and subjects.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Classroom object (with students and subjects)

### GET /api/teacher/subject/:subjectId
**Description:** Get subject details by ID.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Subject object

### GET /api/teacher/search-classrooms?query=searchTerm
**Description:** Search classrooms by name or class code.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Query Params:**
- `query`: string (required, part or full name/code)
**Response:** Array of matching classroom objects

### GET /api/teacher/subjects-created
**Description:** Get all subjects created by the teacher.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Array of subject objects

### GET /api/teacher/materials-created
**Description:** Get all materials created by the teacher.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Array of material objects

### GET /api/teacher/assignments-created
**Description:** Get all assignments created by the teacher.
**Headers:** `Authorization: Bearer <JWT_TOKEN>`
**Body:** None  
**Response:** Array of