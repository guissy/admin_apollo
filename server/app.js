const path = require('path');
const express = require('express');
const createError = require('http-errors');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
// const graphqlRouter = require('./routes/graphql');
const token = require('./routes/token');
const rest_login = require('./routes/rest_login');
const rest_message = require('./routes/rest_message');
const rest_active = require('./routes/rest_active');
const rest_user = require('./routes/rest_user');
const rest_stat = require('./routes/rest_stat');
const rest_brokerage = require('./routes/rest_brokerage');
const rest_cash = require('./routes/rest_cash');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(cors());
app.use('/graphql', token);
app.use('/admin', rest_login.router);
app.use('/message', rest_message.router);
app.use('', rest_active.router);
app.use('', rest_user.router);
app.use('', rest_stat.router);
app.use('', rest_brokerage.router);
app.use('', rest_cash.router);
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // console.log('☞☞☞ 9527 app 29', req);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json(err);
});

app.listen(8081, () => {
  console.log('☞☞☞ running: ', 8081);
});
module.exports = app;
