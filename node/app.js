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
var cluster = require('cluster');

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
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views')); // dirname is where the current file is located
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(multipart({
    uploadDir: __dirname + '/public/upload'
}))
app.use(cookieParser());

if (app.get('env') === 'development') {
    app.use(session({
        secret: 'hello! Bix',
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 60000
        }
    }));
} else {
    app.use(session({
        secret: 'hello! Bix',
        store: new RedisStore(),
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 60000
        }
    }));
}

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

if (app.get('env') === 'development') {
    app.use(logRequest);
    app.use(logResponse);
}

app.use('/', require('./controllers/home'));
app.use('/api', require('./controllers/api')(app));
app.use('/xmppforward', require('./controllers/xmppforward')(app));
app.use('/admin', authenticate(require('./controllers/admin')))

app.use(notFoundCatcher);
if (app.get('env') === 'development') {
    app.use(devErrorHandler);
} else{
    app.use(devErrorHandler);
}


// error handlers

function notFoundCatcher(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
};

function devErrorHandler(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        error: err.message || err || 'unkown error',
        stack: err.stack || 'no stack info'
    }) // print stacktrace
};

function prodErrorHandler(err, req, res, next) {
    res.status(err.status || 500);

    // no stacktraces leaked to user
    res.send(err.message || err || 'unkown error');
};

function logRequest(req, res, next) {
    console.log('------------------------------')
    console.log('REQUEST')
    console.log(req.ip, req.method, req.protocol + '://' + req.get('host') + req.originalUrl)
    console.log(req.body)
    next();
}

function logResponse(req, res, next) {
    var oldWrite = res.write,
        oldEnd = res.end;
    var chunks = [];
    res.write = function(chunk) {
        chunks.push(chunk);
        oldWrite.apply(res, arguments);
    };
    res.end = function(chunk) {
        if (chunk) chunks.push(chunk);
        var body = Buffer.concat(chunks).toString('utf8');

        console.log('RESPONSE')
        console.log(body);

        oldEnd.apply(res, arguments);
    };
    next();
}


// restart app.js when crashed
if (cluster.isMaster) {
    console.log('master node started, starting worker...')
    cluster.fork();

    //if the worker dies, restart it.
    cluster.on('exit', function(worker) {
        console.log('worker', worker.id + '(' + worker.process.pid + ') died, restarting...');
        cluster.fork();
    });
} else {
    var server = app.listen(app.get('port'), function() {
        console.log('worker started on port ' + server.address().port);
    });
}

process.on('uncaughtException', function(err) {
    console.error((new Date).toUTCString() + ' uncaughtException found:',
        err.stack || 'no stack info', 'exiting...')
    process.exit(1);
});

module.exports = app;
