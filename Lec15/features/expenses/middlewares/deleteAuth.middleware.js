const SECRET_KEY = 'zviadi123';

function deleteAuth(req, res, next) {
    const clientSecret = req.headers['secret'];

    if (!clientSecret || clientSecret !== SECRET_KEY) {
        return res.status(401).json({ error: 'არასწორი საიდუმლო კოდი (secret)' });
    }

    next();
}

module.exports = deleteAuth;
