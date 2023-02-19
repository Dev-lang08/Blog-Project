if (process.env.NODE_ENV !== 'production')
    require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');

const blogRoutes = require('./routes/blogs');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');

const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/blog'
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'BlogProject!'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600
})

store.on('error', function (e) {
    console.log('Session Store Error', e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes)
app.use('/blogs', blogRoutes);
app.use('/blogs/:id/comments', commentRoutes);

app.get('/', (req, res) => {
    res.send('home');
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Good Game'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
});