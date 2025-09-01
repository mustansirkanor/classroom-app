// Basic validation functions
export const required = (value, message = 'This field is required') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return message;
  }
  return null;
};

export const minLength = (min, message) => (value) => {
  if (!value || value.length < min) {
    return message || `Must be at least ${min} characters`;
  }
  return null;
};

export const maxLength = (max, message) => (value) => {
  if (value && value.length > max) {
    return message || `Must be no more than ${max} characters`;
  }
  return null;
};

export const pattern = (regex, message) => (value) => {
  if (value && !regex.test(value)) {
    return message || 'Invalid format';
  }
  return null;
};

// Email validation
export const email = (value) => {
  if (!value) return null;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return null;
};

// Password validation
export const password = (value) => {
  if (!value) return null;
  
  if (value.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  if (!/(?=.*[a-z])/.test(value)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/(?=.*[A-Z])/.test(value)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/(?=.*\d)/.test(value)) {
    return 'Password must contain at least one number';
  }
  
  return null;
};

export const confirmPassword = (originalPassword) => (value) => {
  if (!value) return 'Please confirm your password';
  
  if (value !== originalPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

// Name validation
export const name = (value) => {
  if (!value) return null;
  
  if (value.length < 2) {
    return 'Name must be at least 2 characters';
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(value)) {
    return 'Name can only contain letters, spaces, apostrophes, and hyphens';
  }
  
  return null;
};

// Class code validation
export const classCode = (value) => {
  if (!value) return null;
  
  if (value.length !== 6) {
    return 'Class code must be exactly 6 characters';
  }
  
  if (!/^[A-Z0-9]+$/.test(value)) {
    return 'Class code can only contain uppercase letters and numbers';
  }
  
  return null;
};

// Number validation
export const number = (value) => {
  if (!value && value !== 0) return null;
  
  if (isNaN(value)) {
    return 'Must be a valid number';
  }
  
  return null;
};

export const positiveNumber = (value) => {
  const numberError = number(value);
  if (numberError) return numberError;
  
  if (value <= 0) {
    return 'Must be a positive number';
  }
  
  return null;
};

export const minValue = (min, message) => (value) => {
  const numberError = number(value);
  if (numberError) return numberError;
  
  if (value < min) {
    return message || `Must be at least ${min}`;
  }
  
  return null;
};

export const maxValue = (max, message) => (value) => {
  const numberError = number(value);
  if (numberError) return numberError;
  
  if (value > max) {
    return message || `Must be no more than ${max}`;
  }
  
  return null;
};

// Date validation
export const date = (value) => {
  if (!value) return null;
  
  const dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) {
    return 'Please enter a valid date';
  }
  
  return null;
};

export const futureDate = (value) => {
  const dateError = date(value);
  if (dateError) return dateError;
  
  const now = new Date();
  const inputDate = new Date(value);
  
  if (inputDate <= now) {
    return 'Date must be in the future';
  }
  
  return null;
};

export const pastDate = (value) => {
  const dateError = date(value);
  if (dateError) return dateError;
  
  const now = new Date();
  const inputDate = new Date(value);
  
  if (inputDate >= now) {
    return 'Date must be in the past';
  }
  
  return null;
};

// File validation
export const fileSize = (maxSize, message) => (file) => {
  if (!file) return null;
  
  if (file.size > maxSize) {
    return message || `File size must be less than ${formatFileSize(maxSize)}`;
  }
  
  return null;
};

export const fileType = (allowedTypes, message) => (file) => {
  if (!file) return null;
  
  const extension = file.name.split('.').pop().toLowerCase();
  if (!allowedTypes.includes(extension)) {
    return message || `File type must be one of: ${allowedTypes.join(', ')}`;
  }
  
  return null;
};

// URL validation
export const url = (value) => {
  if (!value) return null;
  
  try {
    new URL(value);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

// Phone validation
export const phone = (value) => {
  if (!value) return null;
  
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  if (!phoneRegex.test(value)) {
    return 'Please enter a valid phone number';
  }
  
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    return 'Phone number must be between 10 and 15 digits';
  }
  
  return null;
};

// Compose validators
export const validate = (value, validators) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

// Form validation
export const validateForm = (data, schema) => {
  const errors = {};
  
  for (const [field, validators] of Object.entries(schema)) {
    const error = validate(data[field], validators);
    if (error) {
      errors[field] = error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Helper function for file size formatting
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Common validation schemas
export const schemas = {
  login: {
    email: [required, email],
    password: [required]
  },
  
  register: {
    name: [required, name],
    email: [required, email],
    password: [required, password],
    role: [required]
  },
  
  classroom: {
    name: [required, minLength(3), maxLength(100)],
    description: [maxLength(500)]
  },
  
  subject: {
    name: [required, minLength(3), maxLength(100)],
    description: [maxLength(500)]
  },
  
  assignment: {
    title: [required, minLength(5), maxLength(200)],
    description: [required, minLength(10)],
    instructions: [required, minLength(10)],
    dueDate: [required, futureDate],
    totalPoints: [required, positiveNumber, minValue(1), maxValue(1000)]
  },
  
  material: {
    title: [required, minLength(3), maxLength(200)],
    description: [maxLength(500)],
    type: [required]
  },
  
  profile: {
    name: [required, name],
    email: [required, email]
  },
  
  changePassword: {
    currentPassword: [required],
    newPassword: [required, password],
    confirmPassword: [required]
  }
};
