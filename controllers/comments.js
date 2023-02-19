const Blog = require('../models/blog')
const Comment = require('../models/comment');

module.exports.newComment = async (req, res) => {
    const date = new Date();
    const blog = await Blog.findById(req.params.id);
    //console.log(blog._id)
    const comment = new Comment(req.body.comment);
    comment.date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    comment.time = `${date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`;
    comment.author = req.user._id;
    blog.comments.push(comment);
    await comment.save();
    await blog.save();
    req.flash('success', 'New Comment Successful');
    //console.log(blog)
    res.redirect(`/blogs/${blog._id}`);
}

module.exports.destroyComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Blog.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Comment Deleted Successfully');
    res.redirect(`/blogs/${id}`);
}