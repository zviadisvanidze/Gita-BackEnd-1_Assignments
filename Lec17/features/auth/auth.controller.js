const authService = require('./auth.service');

function serializeUser(user) {
    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        birthDate: user.birthDate,
        blogs: user.blogs,
        profilePicture: user.profilePicture,
    };
}

async function signup(req, res) {
    try {
        const { user, token } = await authService.registerUser(req.body);
        res.status(201).json({
            message: 'რეგისტრაცია წარმატებულია',
            token,
            user: serializeUser(user),
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('შეცდომა რეგისტრაციისას:', error);
        res.status(500).json({ error: 'სერვერის შეცდომა' });
    }
}

async function login(req, res) {
    try {
        const { user, token } = await authService.loginUser(req.body);
        res.json({
            message: 'ავტორიზაცია წარმატებულია',
            token,
            user: serializeUser(user),
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('შეცდომა ავტორიზაციისას:', error);
        res.status(500).json({ error: 'სერვერის შეცდომა' });
    }
}

async function getMe(req, res) {
    try {
        const user = await authService.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'მომხმარებელი ვერ მოიძებნა' });
        }
        res.json(serializeUser(user));
    } catch (error) {
        console.error('შეცდომა მომხმარებლის წაკითხვისას:', error);
        res.status(500).json({ error: 'სერვერის შეცდომა' });
    }
}

async function deleteMe(req, res) {
    try {
        const deletedUser = await authService.deleteUser(req.user.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'მომხმარებელი ვერ მოიძებნა' });
        }
        res.json({ message: 'მომხმარებელი და მისი ბლოგები წაიშალა' });
    } catch (error) {
        console.error('შეცდომა მომხმარებლის წაშლისას:', error);
        res.status(500).json({ error: 'სერვერის შეცდომა' });
    }
}

async function uploadProfilePicture(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'ფაილი ატვირთული არ არის' });
        }
        const user = await authService.uploadProfilePicture(req.user.id, req.file);
        res.json({
            message: 'პროფილის სურათი წარმატებით აიტვირთა',
            user: serializeUser(user),
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('შეცდომა პროფილის სურათის ატვირთვისას:', error);
        res.status(500).json({ error: 'სერვერის შეცდომა' });
    }
}

async function deleteProfilePicture(req, res) {
    try {
        const user = await authService.deleteProfilePicture(req.user.id);
        res.json({
            message: 'პროფილის სურათი წაიშალა',
            user: serializeUser(user),
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ error: error.message });
        }
        console.error('შეცდომა პროფილის სურათის წაშლისას:', error);
        res.status(500).json({ error: 'სერვერის შეცდომა' });
    }
}

module.exports = { signup, login, getMe, deleteMe, uploadProfilePicture, deleteProfilePicture };
