import { CLASSROOM_COLORS, FILE_TYPES } from './constants';

// Date helpers
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTimeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now - past;
  
  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
};

export const calculateDaysLeft = (dueDate) => {
  if (!dueDate) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600', urgent: true };
  if (diffDays === 0) return { text: 'Due today', color: 'text-orange-600', urgent: true };
  if (diffDays === 1) return { text: '1 day left', color: 'text-yellow-600', urgent: false };
  if (diffDays <= 7) return { text: `${diffDays} days left`, color: 'text-blue-600', urgent: false };
  return { text: `${diffDays} days left`, color: 'text-green-600', urgent: false };
};

// String helpers
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const generateUsername = (email) => {
  if (!email) return '';
  return email.split('@')[0];
};

// File helpers
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

export const getFileType = (filename) => {
  const extension = getFileExtension(filename);
  
  for (const [type, extensions] of Object.entries(FILE_TYPES)) {
    if (extensions.includes(extension)) {
      return type.toLowerCase();
    }
  }
  
  return 'unknown';
};

export const getFileIcon = (filename) => {
  const type = getFileType(filename);
  
  const icons = {
    images: '🖼️',
    documents: '📄',
    presentations: '📊',
    audio: '🎵',
    video: '🎬',
    archives: '📦',
    unknown: '📎'
  };
  
  return icons[type] || icons.unknown;
};

export const isValidFileType = (filename, allowedTypes = []) => {
  if (!allowedTypes.length) return true;
  
  const extension = getFileExtension(filename);
  return allowedTypes.includes(extension);
};

export const isValidFileSize = (fileSize, maxSize) => {
  return fileSize <= maxSize;
};

// UI helpers
export const getClassroomColor = (index) => {
  return CLASSROOM_COLORS[index % CLASSROOM_COLORS.length];
};

export const generateAvatarUrl = (name, size = 100) => {
  const initials = getInitials(name);
  return `https://ui-avatars.com/api/?name=${initials}&size=${size}&background=3B82F6&color=ffffff`;
};

export const getProgressColor = (percentage) => {
  if (percentage >= 90) return 'bg-green-500';
  if (percentage >= 70) return 'bg-blue-500';
  if (percentage >= 50) return 'bg-yellow-500';
  if (percentage >= 30) return 'bg-orange-500';
  return 'bg-red-500';
};

// Validation helpers
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

export const isValidClassCode = (code) => {
  return code && code.length === 6 && /^[A-Z0-9]+$/.test(code);
};

// Array helpers
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (direction === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
};

// URL helpers
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

export const getQueryParams = () => {
  return new URLSearchParams(window.location.search);
};

// Local storage helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${error}`);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${error}`);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`);
    }
  }
};

// Debounce helper
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Throttle helper
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
