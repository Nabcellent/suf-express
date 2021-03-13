const express = require('express');
const favicon = require('serve-favicon');
const createError = require('http-errors');
const methodOverride = require('method-override');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const fileUpload = require('express-fileupload');

app.use(cors());
app.use(express.urlencoded({extended: false})); //==    Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.json());    //==    Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(fileUpload());


//==    Static Files
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/images', express.static(__dirname + 'public/images'));


//==    Set Templating Engine
const expressLayout = require('express-ejs-layouts');
app.use(expressLayout);
app.set('layout', './layouts/navless');
app.set('views', './views');
app.set('view engine', 'ejs');


//==    Setting Session
const session = require('express-session');
const flash = require('connect-flash');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

//==    Flash Messages
app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
})


//==    Configure passport middleware
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());


//==    Defining Routes
const apiRoutes = require('./Api/Routes');
app.use(apiRoutes);


//==    Catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError.NotFound());
});


//==    Error handler
app.use(function(error, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = error.message;
    res.locals.error = req.app.get('env') === 'development' ? error : {};

    // render the error page
    res.status(error.status || 500);
    res.render('error', {Title:'Error', error});
});

app.listen(process.env.PORT, () => console.log('Server Running'))