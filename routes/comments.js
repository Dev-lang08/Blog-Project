const express = require('express');
const { isLoggedIn, validateComment, isReviewAuthor } = require('../middlerware')
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const comments = require('../controllers/comments')


router.post('/', isLoggedIn, validateComment, catchAsync(comments.newComment));

router.delete('/:commentId', isLoggedIn, isReviewAuthor, catchAsync(comments.destroyComment));

module.exports = router