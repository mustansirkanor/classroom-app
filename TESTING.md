# Testing Guide for Classroom App

This document provides comprehensive information about testing the Classroom App, including setup, running tests, and writing new tests.

## Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Utilities](#test-utilities)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The Classroom App uses Jest as the primary testing framework with the following setup:

- **Backend**: Jest with Supertest for API testing and MongoDB Memory Server for database testing
- **Frontend**: Jest with React Testing Library for component testing and MSW for API mocking

## Test Structure

```
classroom-app/
├── backend/
│   ├── tests/
│   │   ├── setup.js                 # Test setup and configuration
│   │   ├── helpers/
│   │   │   └── testHelpers.js       # Test utility functions
│   │   ├── models/                  # Model tests
│   │   │   ├── User.test.js
│   │   │   ├── Classroom.test.js
│   │   │   └── Material.test.js
│   │   └── routes/                  # API route tests
│   │       ├── auth.test.js
│   │       └── student.test.js
│   └── package.json                 # Backend test configuration
├── frontend/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── utils/
│   │   │   │   └── testUtils.js     # Frontend test utilities
│   │   │   ├── components/          # Component tests
│   │   │   │   ├── LoginForm.test.js
│   │   │   │   └── ClassroomCard.test.js
│   │   │   ├── pages/               # Page tests
│   │   │   │   └── StudentDashboard.test.js
│   │   │   └── hooks/               # Hook tests
│   │   │       └── useAuth.test.js
│   │   └── setupTests.js            # Frontend test setup
│   └── package.json                 # Frontend test configuration
└── package.json                     # Root test scripts
```

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Verify installation:**
   ```bash
   npm test
   ```

## Running Tests

### All Tests

```bash
# Run all tests (backend + frontend)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

### Backend Tests Only

```bash
# Run backend tests
npm run test:backend

# Run backend tests in watch mode
npm run test:backend:watch

# Run backend tests with coverage
npm run test:backend:coverage

# Run backend tests for CI
npm run test:backend:ci
```

### Frontend Tests Only

```bash
# Run frontend tests
npm run test:frontend

# Run frontend tests in watch mode
npm run test:frontend:watch

# Run frontend tests with coverage
npm run test:frontend:coverage

# Run frontend tests for CI
npm run test:frontend:ci
```

### Individual Test Files

```bash
# Backend
cd backend
npm test -- User.test.js
npm test -- --testNamePattern="should create user"

# Frontend
cd frontend
npm test -- LoginForm.test.js
npm test -- --testNamePattern="should render login form"
```

## Writing Tests

### Backend Tests

#### Model Tests

```javascript
// backend/tests/models/User.test.js
const User = require('../../models/User');
const { createTestUser } = require('../helpers/testHelpers');

describe('User Model', () => {
  it('should create a user with valid data', async () => {
    const user = await createTestUser({
      name: 'Test User',
      email: 'test@example.com',
      role: 'student'
    });

    expect(user._id).toBeDefined();
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@example.com');
  });
});
```

#### API Route Tests

```javascript
// backend/tests/routes/auth.test.js
const request = require('supertest');
const app = require('../../server'); // Your Express app

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'student'
      })
      .expect(201);

    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('test@example.com');
  });
});
```

### Frontend Tests

#### Component Tests

```javascript
// frontend/src/__tests__/components/LoginForm.test.js
import { render, screen, fireEvent, waitFor } from '../utils/testUtils';
import LoginForm from '../../components/forms/LoginForm';

describe('LoginForm', () => {
  it('renders login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const mockOnSuccess = jest.fn();
    render(<LoginForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
```

#### Hook Tests

```javascript
// frontend/src/__tests__/hooks/useAuth.test.js
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../contexts/AuthContext';

describe('useAuth Hook', () => {
  it('should login user successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
        role: 'student'
      });
    });

    expect(result.current.user).toBeDefined();
  });
});
```

## Test Utilities

### Backend Test Helpers

The `backend/tests/helpers/testHelpers.js` file provides utility functions:

- `createTestUser()` - Create a test user
- `createTestTeacher()` - Create a test teacher
- `createTestStudent()` - Create a test student
- `createTestClassroom()` - Create a test classroom
- `createTestSubject()` - Create a test subject
- `createTestMaterial()` - Create a test material
- `createTestAssignment()` - Create a test assignment
- `generateToken()` - Generate JWT token for testing
- `mockResponse()` - Mock Express response object
- `mockNext()` - Mock Express next function

### Frontend Test Utilities

The `frontend/src/__tests__/utils/testUtils.js` file provides:

- `render()` - Custom render function with providers
- `mockUser`, `mockTeacher` - Mock user data
- `mockClassroom`, `mockSubject` - Mock data objects
- `waitFor()` - Helper for async operations
- `mockLocalStorage()`, `mockSessionStorage()` - Storage mocks

## Best Practices

### General Testing Principles

1. **Test Behavior, Not Implementation**
   - Focus on what the code does, not how it does it
   - Test user interactions and outcomes

2. **Use Descriptive Test Names**
   ```javascript
   // Good
   it('should return 401 when user provides invalid credentials')
   
   // Bad
   it('should handle error')
   ```

3. **Arrange, Act, Assert (AAA)**
   ```javascript
   it('should create user successfully', async () => {
     // Arrange
     const userData = { name: 'Test', email: 'test@example.com' };
     
     // Act
     const user = await createTestUser(userData);
     
     // Assert
     expect(user.name).toBe('Test');
   });
   ```

4. **Test Edge Cases**
   - Empty inputs
   - Invalid data
   - Network errors
   - Boundary conditions

### Backend Testing

1. **Use In-Memory Database**
   - Tests run faster
   - No external dependencies
   - Clean state for each test

2. **Mock External Services**
   - Cloudinary uploads
   - Email services
   - Third-party APIs

3. **Test Authentication**
   - Valid tokens
   - Invalid tokens
   - Expired tokens
   - Missing tokens

### Frontend Testing

1. **Test User Interactions**
   - Button clicks
   - Form submissions
   - Navigation
   - Input changes

2. **Mock API Calls**
   - Use MSW for consistent API mocking
   - Test loading states
   - Test error states

3. **Test Accessibility**
   - Screen reader compatibility
   - Keyboard navigation
   - ARIA attributes

## Troubleshooting

### Common Issues

1. **Tests Failing Due to Async Operations**
   ```javascript
   // Use waitFor for async operations
   await waitFor(() => {
     expect(screen.getByText('Success')).toBeInTheDocument();
   });
   ```

2. **Database Connection Issues**
   ```javascript
   // Ensure MongoDB Memory Server is properly configured
   // Check backend/tests/setup.js
   ```

3. **Mock Not Working**
   ```javascript
   // Clear mocks between tests
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```

4. **Component Not Rendering**
   ```javascript
   // Ensure all required providers are included
   render(<Component />, { wrapper: AllTheProviders });
   ```

### Debug Tips

1. **Use `screen.debug()`**
   ```javascript
   render(<Component />);
   screen.debug(); // Prints the DOM
   ```

2. **Check Test Coverage**
   ```bash
   npm run test:coverage
   # Open coverage/lcov-report/index.html
   ```

3. **Run Specific Tests**
   ```bash
   npm test -- --testNamePattern="specific test name"
   ```

4. **Verbose Output**
   ```bash
   npm test -- --verbose
   ```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm run install:all
      - run: npm run test:ci
```

## Coverage Reports

After running tests with coverage, you can view detailed reports:

- **Backend**: `backend/coverage/lcov-report/index.html`
- **Frontend**: `frontend/coverage/lcov-report/index.html`

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain or improve coverage
4. Update this documentation if needed

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MSW Documentation](https://mswjs.io/docs/)
