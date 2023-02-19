const Blog = require('../models/blog');
const { cloudinary } = require('../Cloudinary/index')

module.exports.index = async (req, res) => {
    const blogs = await Blog.find({});
    usernames = []
    for (let blog of blogs) {
        usernames.push(await Blog.findById(blog._id).populate('author'))
    }
    //console.log(usernames)
    res.render('blogs/index', { blogs, usernames });
};

module.exports.renderNewForm = (req, res) => {
    res.render('blogs/new');
}

module.exports.createBlog = async (req, res) => {
    const blog = new Blog(req.body.blog);
    blog.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    const date = new Date()
    blog.date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    blog.time = `${date.getHours()}:${date.getMinutes()}`;
    blog.author = req.user._id;
    blog.likes = 0;
    blog.dislikes = 0;
    await blog.save();
    //console.log(blog);
    req.flash('success', "Successfully made a new Blog!");
    res.redirect(`/blogs/${blog._id}`);
}

module.exports.showBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    //console.log(blog);
    if (!blog) {
        //console.log(id);
        req.flash('error', 'Blog not found');
        return res.redirect('/blogs');
    }
    res.render('blogs/show', { blog });
}

module.exports.showEditBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        //console.log(id);
        req.flash('error', 'Cannot find that Blog');
        return res.redirect('/blogs');
    }

    //console.log(blog.title)
    res.render('blogs/edit', { blog });
}

module.exports.editBlog = async (req, res) => {
    const { id } = req.params;
    const date = new Date();
    let blog = await Blog.findById(id);
    if (!blog.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do');
        return res.redirect(`/blogs/${id}`);
    }
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    blog.images.push(...images);
    blog.date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    blog.time = `${date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`;
    await blog.save();
    if (req.body.deleteImages.length > 1) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await blog.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    blog = await Blog.findByIdAndUpdate(id, { ...req.body.blog });
    req.flash('success', "Successfully updated the Blog!");
    res.redirect(`/blogs/${blog._id}`)
}

module.exports.destroyBlog = async (req, res) => {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted blog ');
    res.redirect('/blogs');
}

module.exports.likeBlog = async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    blog.likes += 1;
    await blog.save();
    res.redirect(`/blogs/${blog._id}`)
};

module.exports.dislikeBlog = async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    blog.dislikes += 1;
    await blog.save();
    res.redirect(`/blogs/${blog._id}`)
}