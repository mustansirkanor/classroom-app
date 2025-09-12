const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Classroom = require('../../models/Classroom');
const Subject = require('../../models/Subject');
const Material = require('../../models/Material');
const Assignment = require('../../models/Assignment');

// Generate JWT token for testing
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Create test user
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'student',
    ...userData
  };
  
  const user = new User(defaultUser);
  await user.save();
  return user;
};

// Create test teacher
const createTestTeacher = async (teacherData = {}) => {
  return await createTestUser({
    name: 'Test Teacher',
    email: 'teacher@example.com',
    role: 'teacher',
    ...teacherData
  });
};

// Create test student
const createTestStudent = async (studentData = {}) => {
  return await createTestUser({
    name: 'Test Student',
    email: 'student@example.com',
    role: 'student',
    ...studentData
  });
};

// Create test classroom
const createTestClassroom = async (classroomData = {}) => {
  const teacher = await createTestTeacher();
  
  const defaultClassroom = {
    name: 'Test Classroom',
    description: 'A test classroom',
    classCode: 'TEST01',
    teacherId: teacher._id,
    students: [],
    subjects: [],
    ...classroomData
  };
  
  const classroom = new Classroom(defaultClassroom);
  await classroom.save();
  return { classroom, teacher };
};

// Create test subject
const createTestSubject = async (subjectData = {}) => {
  const { classroom, teacher } = await createTestClassroom();
  
  const defaultSubject = {
    name: 'Test Subject',
    description: 'A test subject',
    classroomId: classroom._id,
    teacherId: teacher._id,
    materials: [],
    assignments: [],
    ...subjectData
  };
  
  const subject = new Subject(defaultSubject);
  await subject.save();
  
  // Update classroom with subject
  classroom.subjects.push(subject._id);
  await classroom.save();
  
  return { subject, classroom, teacher };
};

// Create test material
const createTestMaterial = async (materialData = {}) => {
  const { subject, teacher } = await createTestSubject();
  
  const defaultMaterial = {
    title: 'Test Material',
    description: 'A test material',
    type: 'document',
    fileUrl: 'https://example.com/test.pdf',
    subjectId: subject._id,
    teacherId: teacher._id,
    ...materialData
  };
  
  const material = new Material(defaultMaterial);
  await material.save();
  
  // Update subject with material
  subject.materials.push(material._id);
  await subject.save();
  
  return { material, subject, teacher };
};

// Create test assignment
const createTestAssignment = async (assignmentData = {}) => {
  const { subject, teacher } = await createTestSubject();
  
  const defaultAssignment = {
    title: 'Test Assignment',
    description: 'A test assignment',
    instructions: 'Complete this test assignment',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    totalPoints: 100,
    attachments: [],
    subjectId: subject._id,
    teacherId: teacher._id,
    submissions: [],
    ...assignmentData
  };
  
  const assignment = new Assignment(defaultAssignment);
  await assignment.save();
  
  // Update subject with assignment
  subject.assignments.push(assignment._id);
  await subject.save();
  
  return { assignment, subject, teacher };
};

// Mock request with authentication
const mockAuthenticatedRequest = (user) => {
  return {
    user: {
      userId: user._id,
      role: user.role
    },
    headers: {
      authorization: `Bearer ${generateToken(user)}`
    }
  };
};

// Mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

// Mock next function
const mockNext = () => jest.fn();

module.exports = {
  generateToken,
  createTestUser,
  createTestTeacher,
  createTestStudent,
  createTestClassroom,
  createTestSubject,
  createTestMaterial,
  createTestAssignment,
  mockAuthenticatedRequest,
  mockResponse,
  mockNext
};
