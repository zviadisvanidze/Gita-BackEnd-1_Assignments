const Blog = require('../blog.model');

async function isOwner(req, res, next) {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ error: 'ბლოგი მოცემული ID-ით ვერ მოიძებნა' });
        }

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ error: 'თქვენ არ გაქვთ ამ ბლოგზე წვდომა' });
        }

        next();
    } catch (error) {
        console.error('შეცდომა უფლებამოსილების შემოწმებისას:', error);
        res.status(500).json({ error: 'სერვერის შეცდომა' });
    }
}

module.exports = isOwner;
