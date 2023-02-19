const User = require('../models/user');

module.exports.registerFormRender = (req, res) => {
    res.render('users/register');
}

module.exports.registerNewUser = async (req, res) => {
    try {
        //console.log("hi");
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        user.profilePicture.url = req.file.path;
        user.profilePicture.filename = req.file.filename;
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            else {
                req.flash('success', 'Welcome to Blog Post Project');
                res.redirect('/blogs');
            }
        })
    }
    catch (e) {
        //console.log(registeredUser);
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginPage = (req, res) => {
    res.render('users/login');
}

module.exports.verifyUser = (req, res) => {
    req.flash('success', 'Welcome Back');
    const redirectUrl = req.session.returnTo || '/blogs';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', "Goodbye");
        res.redirect('/blogs');
    })
}