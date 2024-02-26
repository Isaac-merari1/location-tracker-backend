const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

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



function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`
    
    try {
        if (!token) {
            return res.status(401).json({ message: "No token provided!" });
        }
        
        jwt.verify(token, jwtSecretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
}

function generateToken(payload) {
    const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`;
    const token = jwt.sign(payload, jwtSecretKey);
    return token;
}



module.exports = { isValidEmail, isValidPassword, verifyToken, generateToken };
