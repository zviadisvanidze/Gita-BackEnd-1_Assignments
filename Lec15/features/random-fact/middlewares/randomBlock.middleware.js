function randomBlock(req, res, next) {
    if (Math.random() < 0.5) {
        return res.status(403).json({ error: 'მოთხოვნა დაბლოკილია! სცადეთ თავიდან.' });
    }

    next();
}

module.exports = randomBlock;
