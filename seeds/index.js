const mongoose = require('mongoose');
const Blog = require('../models/blog');

mongoose.connect('mongodb://localhost:27017/blog');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const date = new Date();
//console.log(date);
const seedDB = async () => {
    await Blog.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const blog = new Blog({
            likes: 0,
            dislikes: 0,
            date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
            time: `${date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`,
            images: [{
                url: "https://res.cloudinary.com/dgvnbh1wn/image/upload/v1676735150/Blog-Post/zw4f5prk0levqxdbix1v.jpg",
                filename: 'Blog-Post/isfg4hnzoenjbeuajlgp'
            }],
            title: 'Lorem Ipsum',
            author: i % 2 == 0 ? "63f09dd4a250a2f0e27d530a" : "63f09d8b3efc86aaac12c40a",
            content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima unde temporibus, soluta dolorum fugiat fuga in ad magnam, veniam laudantium, sed iure animi sequi? Inventore labore obcaecati sunt magnam necessitatibus."
        })
        await blog.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})