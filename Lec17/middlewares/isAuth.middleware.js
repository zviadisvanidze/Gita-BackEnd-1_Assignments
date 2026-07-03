const jwt = require('jsonwebtoken');

function isAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ error: 'ავტორიზაცია სავალდებულოა' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'არასწორი ან ვადაგასული ტოკენი' });
    }
}

module.exports = isAuth;
