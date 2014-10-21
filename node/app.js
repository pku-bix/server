var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var RedisStore = require('connect-redis')(session);
var multipart = require('connect-multiparty')
var Admin = require('./models/admin.js')
var authenticate = require('./controllers/authenticate.js')

// mongoose setup
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bix');

// passport setup
var passport = require('passport')
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// app setup
var app = express();
app.set('env', process.env.NODE_ENV || 'development');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(multipart({ uploadDir: __dirname + '/upload' })) 
app.use(cookieParser());

if (app.get('env') === 'development') {
  app.use(session({ secret: 'hello! Bix', resave: true, saveUninitialized: true, cookie: { maxAge: 60000 } }));
}
else{
  app.use(session({ secret: 'hello! Bix', store: new RedisStore(), resave: true, saveUninitialized: true, cookie: { maxAge: 60000 } }));
}

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./controllers/home'));
app.use('/admin', authenticate(require('./controllers/admin')))
app.use('/api', require('./controllers/api'));
app.use('/xmppforward', require('./controllers/xmppforward'));


// error handlers

// catch 404 
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// development error handlers

// print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
