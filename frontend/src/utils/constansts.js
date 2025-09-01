export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    UPDATE_PROFILE: '/auth/profile',
    UPDATE_PASSWORD: '/auth/password'
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    JOIN_CLASS: '/student/join-class',
    CLASSROOMS: '/student/classrooms',
    CLASSROOM: '/student/classroom',
    SUBJECTS: '/student/subjects',
    SUBJECT: '/student/subject',
    MATERIALS: '/student/materials',
    MATERIAL: '/student/material',
    ASSIGNMENTS: '/student/assignments',
    ASSIGNMENT: '/student/assignment',
    PROGRESS: '/student/progress',
    SUBMIT: '/student/submit',
    SUBMISSION: '/student/submission',
    STREAM: '/student/stream',
    POST: '/student/post'
  },
  TEACHER: {
    DASHBOARD: '/teacher/dashboard',
    CLASSROOMS: '/teacher/classrooms',
    CLASSROOM: '/teacher/classroom',
    SUBJECTS: '/teacher/subjects',
    SUBJECT: '/teacher/subject',
    MATERIALS: '/teacher/materials',
    MATERIAL: '/teacher/material',
    ASSIGNMENTS: '/teacher/assignments',
    ASSIGNMENT: '/teacher/assignment',
    SUBMISSIONS: '/teacher/submissions',
    GRADE: '/teacher/grade',
    STUDENTS: '/teacher/students'
  },
  UPLOAD: {
    SINGLE: '/upload/single',
    MULTIPLE: '/upload/multiple',
    AVATAR: '/upload/avatar',
    DELETE: '/upload/delete',
    INFO: '/upload/info',
    SIGNED_URL: '/upload/signed-url'
  }
};

export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher'
};

export const MATERIAL_TYPES = {
  DOCUMENT: 'document',
  PPT: 'ppt',
  VIDEO: 'video',
  PODCAST: 'podcast',
  SUMMARY: 'summary'
};

export const ASSIGNMENT_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  LATE: 'late'
};

export const POST_TYPES = {
  ANNOUNCEMENT: 'announcement',
  ASSIGNMENT: 'assignment',
  MATERIAL: 'material',
  REMINDER: 'reminder'
};

export const FILE_TYPES = {
  IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  DOCUMENTS: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
  PRESENTATIONS: ['ppt', 'pptx', 'odp'],
  AUDIO: ['mp3', 'wav', 'ogg', 'aac'],
  VIDEO: ['mp4', 'avi', 'mov', 'wmv', 'flv'],
  ARCHIVES: ['zip', 'rar', '7z', 'tar', 'gz']
};

export const MAX_FILE_SIZE = {
  AVATAR: 5 * 1024 * 1024, // 5MB
  MATERIAL: 50 * 1024 * 1024, // 50MB
  ASSIGNMENT: 25 * 1024 * 1024, // 25MB
  SUBMISSION: 25 * 1024 * 1024 // 25MB
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TEACHER_DASHBOARD: '/teacher-dashboard',
  PROFILE: '/profile',
  CLASSROOM: '/classroom/:classroomId',
  SUBJECT: '/subject/:subjectId',
  ASSIGNMENT: '/assignment/:assignmentId',
  MATERIAL: '/material/:materialId',
  NOT_FOUND: '/404'
};

export const QUERY_KEYS = {
  STUDENT_DASHBOARD: 'studentDashboard',
  TEACHER_DASHBOARD: 'teacherDashboard',
  CLASSROOMS: 'classrooms',
  CLASSROOM: 'classroom',
  SUBJECTS: 'subjects',
  SUBJECT: 'subject',
  MATERIALS: 'materials',
  MATERIAL: 'material',
  ASSIGNMENTS: 'assignments',
  ASSIGNMENT: 'assignment',
  SUBMISSIONS: 'submissions',
  SUBMISSION: 'submission',
  PROGRESS: 'progress',
  STREAM: 'stream'
};

export const COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#6B7280',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6'
};

export const CLASSROOM_COLORS = [
  'bg-gradient-to-r from-blue-500 to-blue-600',
  'bg-gradient-to-r from-red-500 to-orange-500',
  'bg-gradient-to-r from-green-500 to-green-600',
  'bg-gradient-to-r from-purple-500 to-purple-600',
  'bg-gradient-to-r from-indigo-500 to-indigo-600',
  'bg-gradient-to-r from-pink-500 to-pink-600',
  'bg-gradient-to-r from-teal-500 to-teal-600',
  'bg-gradient-to-r from-yellow-500 to-yellow-600'
];
