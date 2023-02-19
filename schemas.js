const Joi = require('joi');

module.exports.blogSchema = Joi.object({
    blog: Joi.object({
        likes: Joi.number(),
        dislikes: Joi.number(),
        title: Joi.string().required(),
        time: Joi.string(),
        date: Joi.string(),
        content: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required(),
        time: Joi.string(),
        date: Joi.string()
    }).required()
})
