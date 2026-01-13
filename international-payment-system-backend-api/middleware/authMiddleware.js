const jwt = require('jsonwebtoken');

exports.isAuth = (req, res, next) => {
    const authHeader = req.header('Authorization'); // Get token from header

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No valid token, authorization denied' });
    }

    try { // Verify token
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};


exports.isEmployee = (req, res, next) => { // Check if user has employee role
    if (req.user.role && req.user.role === 'employee') {
        next();
    } else {
        return res.status(403).json({ msg: 'Access forbidden: requires employee role' });
    }
};