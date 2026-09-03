// Regex Email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

// Validation for password
export const validatePassword = (password) => {
    const error = [];

    // Password must be at least 8 characters long
    if (password.length < 8) {
        error.push('Password must be at least 8 characters long');
    }

    // Password must contain at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        error.push('Password must contain at least one uppercase letter');
    }

    // Password must contain at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        error.push('Password must contain at least one lowercase letter');
    }

    // Password must contain at least one number
    if (!/\d/.test(password)) {
        error.push('Password must contain at least one number');
    }

    // Password must contain at least one special character
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        error.push('Password must contain at least one special character');
    }

    return {
        error,
        isValid: error.length === 0
    };
};