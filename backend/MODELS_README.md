# MongoDB Models Reference

This README documents all MongoDB models used in the backend of the classroom-app project. It is designed for frontend engineers to understand the structure, fields, and relationships of each model.

---

## User (`models/User.js`)
Represents a user (student or teacher).

- **Fields:**
  - `name` (String, required)
  - `email` (String, required, unique, lowercase)
  - `password` (String, required, min 6 chars, hashed)
  - `role` (String, required, enum: 'student', 'teacher')
  - `avatar` (String, optional)
  - `createdAt`, `updatedAt` (Date, auto)
- **Methods:**
  - `comparePassword(candidatePassword)` — compares a plain password to the hashed password.

---

## Classroom (`models/Classroom.js`)
Represents a classroom created by a teacher.

- **Fields:**
  - `name` (String, required)
  - `description` (String, optional)
  - `classCode` (String, required, unique, length: 6)
  - `teacherId` (ObjectId, ref: User, required)
  - `students` (Array of ObjectId, ref: User)
  - `subjects` (Array of ObjectId, ref: Subject)
  - `createdAt`, `updatedAt` (Date, auto)

---

## Subject (`models/Subject.js`)
Represents a subject within a classroom.

- **Fields:**
  - `name` (String, required)
  - `description` (String, optional)
  - `classroomId` (ObjectId, ref: Classroom, required)
  - `teacherId` (ObjectId, ref: User, required)
  - `materials` (Array of ObjectId, ref: Material)
  - `assignments` (Array of ObjectId, ref: Assignment)
  - `createdAt`, `updatedAt` (Date, auto)

---

## Material (`models/Material.js`)
Represents a study material uploaded by a teacher.

- **Fields:**
  - `title` (String, required)
  - `description` (String, optional)
  - `type` (String, required, enum: 'podcast', 'ppt', 'summary', 'video', 'document')
  - `fileUrl` (String, required)
  - `subjectId` (ObjectId, ref: Subject, required)
  - `teacherId` (ObjectId, ref: User, required)
  - `createdAt`, `updatedAt` (Date, auto)

---

## Assignment (`models/Assignment.js`)
Represents an assignment for a subject.

- **Fields:**
  - `title` (String, required)
  - `description` (String, required)
  - `instructions` (String, required)
  - `dueDate` (Date, required)
  - `totalPoints` (Number, default: 100)
  - `attachments` (Array of String)
  - `subjectId` (ObjectId, ref: Subject, required)
  - `teacherId` (ObjectId, ref: User, required)
  - `submissions` (Array of ObjectId, ref: Submission)
  - `createdAt`, `updatedAt` (Date, auto)

---

## Progress (`models/Progress.js`)
Tracks a student's progress on a material.

- **Fields:**
  - `studentId` (ObjectId, ref: User, required)
  - `materialId` (ObjectId, ref: Material, required)
  - `subjectId` (ObjectId, ref: Subject, required)
  - `completed` (Boolean, default: false)
  - `progress` (Number, default: 0, min: 0, max: 100)
  - `completedAt` (Date, optional)
  - `createdAt`, `updatedAt` (Date, auto)
- **Indexes:**
  - Compound index on `{ studentId, materialId }` (unique)

---

## GeminiApiOutput (`models/gemini_api_output.js`)
Stores output from Gemini API for a file.

- **Fields:**
  - `fileId` (ObjectId, ref: Material or Assignment, required)
  - `fileUrl` (String, required)
  - `endpoint` (String, required, enum: 'brief-overview', 'assesment', 'podcast')
  - `output` (Object, required)
  - `createdAt` (Date, default: now)
- **Indexes:**
  - Compound index on `{ fileId, endpoint }` (unique)

---

## Relationships Overview
- **User** can be a student or teacher.
- **Classroom** is created by a teacher, contains students and subjects.
- **Subject** belongs to a classroom, has materials and assignments.
- **Material** and **Assignment** are linked to subjects and teachers.
- **Progress** tracks student completion of materials.
- **GeminiApiOutput** stores AI-generated content for materials/assignments.

---

For more details, see the individual model files in `backend/models/`.
