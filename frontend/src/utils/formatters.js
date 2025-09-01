// Number formatters
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  return new Intl.NumberFormat().format(num);
};

export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount && amount !== 0) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatPercentage = (value, decimals = 0) => {
  if (!value && value !== 0) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatCompactNumber = (num) => {
  if (!num && num !== 0) return '0';
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Date formatters
export const formatDateShort = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateMedium = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatDateLong = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime12Hour = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const formatTime24Hour = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now - target) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDateShort(date);
};

// Text formatters
export const formatName = (firstName, lastName) => {
  if (!firstName && !lastName) return '';
  if (!lastName) return firstName;
  if (!firstName) return lastName;
  return `${firstName} ${lastName}`;
};

export const formatInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

export const formatAddress = (address) => {
  if (!address) return '';
  
  const { street, city, state, zipCode, country } = address;
  const parts = [];
  
  if (street) parts.push(street);
  if (city) parts.push(city);
  if (state) parts.push(state);
  if (zipCode) parts.push(zipCode);
  if (country && country !== 'US') parts.push(country);
  
  return parts.join(', ');
};

// Grade formatters
export const formatGrade = (score, total) => {
  if (!score && score !== 0) return 'Not graded';
  if (!total) return score.toString();
  
  const percentage = (score / total) * 100;
  return `${score}/${total} (${percentage.toFixed(1)}%)`;
};

export const formatGradePercentage = (score, total) => {
  if (!score && score !== 0) return '0%';
  if (!total) return '0%';
  
  const percentage = (score / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

export const getGradeLetter = (percentage) => {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
};

// Status formatters
export const formatSubmissionStatus = (status) => {
  const statusMap = {
    pending: 'Not Submitted',
    submitted: 'Submitted',
    graded: 'Graded',
    late: 'Late Submission'
  };
  
  return statusMap[status] || status;
};

export const formatMaterialType = (type) => {
  const typeMap = {
    document: 'Document',
    ppt: 'Presentation',
    video: 'Video',
    podcast: 'Podcast',
    summary: 'Summary'
  };
  
  return typeMap[type] || type;
};

export const formatUserRole = (role) => {
  const roleMap = {
    student: 'Student',
    teacher: 'Teacher',
    admin: 'Administrator'
  };
  
  return roleMap[role] || role;
};

// List formatters
export const formatList = (items, conjunction = 'and') => {
  if (!items || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  return `${items.slice(0, -1).join(', ')}, ${conjunction} ${items[items.length - 1]}`;
};

export const formatTagList = (tags) => {
  if (!tags || tags.length === 0) return '';
  return tags.map(tag => `#${tag}`).join(' ');
};
