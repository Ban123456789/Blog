var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var session = require('express-session');
const { auth } = require('firebase');
app.engine('ejs', require('express-ejs-extend'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
// todo flash 倚靠 session 生存，所以放在他後面
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  duration: 10*1000,
  cookie: { 
    secure: false,
    // maxAge: 10*1000 // 設定5分鐘沒有動作就登出
  }
}));
app.use(flash());

const authCheck = function(req, res, next){
  console.log(req.session);
    if(req.session.uid){
      return next();
    }
    return res.redirect('/auth/signin');
};

app.use('/', indexRouter);
app.use('/dashboard', authCheck, dashboardRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
