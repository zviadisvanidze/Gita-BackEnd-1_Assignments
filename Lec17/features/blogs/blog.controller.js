const blogsService = require('./blog.service');

async function getAll(req, res) {
    try {
        const blogs = await blogsService.getAllBlogs();
        res.json(blogs);
    } catch (error) {
        console.error('შეცდომა ბლოგების წაკითხვისას:', error);
        res.status(500).json({ error: 'სერვერზე მონაცემების წაკითხვისას მოხდა ხარვეზი' });
    }
}

async function getById(req, res) {
    try {
        const blog = await blogsService.getBlogById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'ბლოგი მოცემული ID-ით ვერ მოიძებნა' });
        }
        res.json(blog);
    } catch (error) {
        console.error('შეცდომა ბლოგის წაკითხვისას:', error);
        res.status(500).json({ error: 'სერვერზე მონაცემების წაკითხვისას მოხდა ხარვეზი' });
    }
}

async function create(req, res) {
    try {
        const { title, content } = req.body;
        const blog = await blogsService.createBlog({ title, content, authorId: req.user.id });
        res.status(201).json(blog);
    } catch (error) {
        console.error('შეცდომა ბლოგის დამატებისას:', error);
        res.status(500).json({ error: 'სერვერზე მონაცემების დამატებისას მოხდა ხარვეზი' });
    }
}

async function update(req, res) {
    try {
        const updated = await blogsService.updateBlog(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        console.error('შეცდომა ბლოგის განახლებისას:', error);
        res.status(500).json({ error: 'სერვერზე მონაცემების განახლებისას მოხდა ხარვეზი' });
    }
}

async function remove(req, res) {
    try {
        await blogsService.deleteBlog(req.params.id);
        res.json({ message: 'ბლოგი წარმატებით წაიშალა' });
    } catch (error) {
        console.error('შეცდომა ბლოგის წაშლისას:', error);
        res.status(500).json({ error: 'სერვერზე მონაცემების წაშლისას მოხდა ხარვეზი' });
    }
}

module.exports = { getAll, getById, create, update, remove };
