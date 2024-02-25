function isValidPassword(password) {
    // Password should contain at least 8 characters, one letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'?/>.<,]).{8,}$/;
    return passwordRegex.test(password);
}

function isValidEmail(email) {
    // Basic email validation (this regex allows a wide range of valid email addresses)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports = { isValidEmail, isValidPassword };
