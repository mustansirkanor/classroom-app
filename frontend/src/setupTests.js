// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');

// Mock window.location
delete window.location;
window.location = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock fetch
global.fetch = jest.fn();

// Setup MSW (Mock Service Worker) for API mocking in tests
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Setup request handlers
export const server = setupServer(
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      message: 'Login successful',
      token: 'mock-jwt-token',
      user: {
        id: 'mock-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'student'
      }
    });
  }),
  
  http.post('/api/auth/register', () => {
    return HttpResponse.json({
      message: 'User registered successfully',
      token: 'mock-jwt-token',
      user: {
        id: 'mock-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'student'
      }
    });
  }),
  
  http.get('/api/auth/verify', () => {
    return HttpResponse.json({
      user: {
        id: 'mock-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'student'
      }
    });
  }),

  // Student endpoints
  http.get('/api/student/dashboard', () => {
    return HttpResponse.json({
      classrooms: [],
      stats: {
        totalClassrooms: 0,
        totalSubjects: 0,
        totalMaterials: 0,
        completedMaterials: 0,
        progressPercentage: 0
      }
    });
  }),
  
  http.get('/api/student/classrooms', () => {
    return HttpResponse.json([]);
  }),

  // Teacher endpoints
  http.get('/api/teacher/dashboard', () => {
    return HttpResponse.json({
      classrooms: [],
      stats: {
        totalClassrooms: 0,
        totalStudents: 0,
        totalSubjects: 0,
        totalMaterials: 0,
        totalAssignments: 0
      }
    });
  }),
  
  http.get('/api/teacher/classrooms', () => {
    return HttpResponse.json([]);
  }),

  // Default fallback
  http.get('*', () => {
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),
  
  http.post('*', () => {
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),
);

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  // Clear all mocks
  jest.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});

// Clean up after the tests are finished.
afterAll(() => server.close());
