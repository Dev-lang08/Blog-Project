const ExpressError = require('./utils/ExpressError');
const Blog = require('./models/blog');
const Review = require('./models/comment')
const { blogSchema, commentSchema } = require('./schemas');

module.exports.isLoggedIn = (req, res, next) => {
    //console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateBlog = (req, res, next) => {
    const { error } = blogSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do');
        return res.redirect(`/blogs/${req.params.id}`);
    }

    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const comment = await Review.findById(req.params.Reviewid);
    if (comment && !comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do');
        return res.redirect(`/blogs/${req.params.id}`);
    }
    next();
};

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}