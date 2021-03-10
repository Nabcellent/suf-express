const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
let session = require('express-session');
const passport = require('passport');
const fileUpload = require('express-fileupload');

app.use(cors());
app.use(express.urlencoded({extended: false})); //==    Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.json());    //==    Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());
app.use(fileUpload());

const publicDir = path.join(__dirname, '../public');

//==    Static Files
app.use(express.static(publicDir));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/images', express.static(__dirname + 'public/images'));

//==    Set Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/navless');
app.set('views', './views');
app.set('view engine', 'ejs');


//==    Setting Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

//==    Configure passport middleware
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//==    Defining Routes
app.use('/', require('./api/Routes'));


app.listen(process.env.PORT, () => console.log('Server Running'))