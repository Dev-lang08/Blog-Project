const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateBlog, isAuthor } = require('../middlerware');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });
const blogs = require('../controllers/blogs')

router.route('/')
    .get(catchAsync(blogs.index))
    .post(isLoggedIn, upload.array('image'), validateBlog, catchAsync(blogs.createBlog))

router.get('/new', isLoggedIn, blogs.renderNewForm)

router.route('/:id')
    .get(catchAsync(blogs.showBlog))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateBlog, catchAsync(blogs.editBlog))
    .delete(isLoggedIn, isAuthor, catchAsync(blogs.destroyBlog))

router.get('/:id/like', isLoggedIn, blogs.likeBlog);
router.get('/:id/dislike', isLoggedIn, blogs.dislikeBlog)

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(blogs.showEditBlog));

module.exports = router;