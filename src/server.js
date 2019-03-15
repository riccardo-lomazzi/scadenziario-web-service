var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var port = process.env.PORT || 4000;
var config = require('./config.js');
var jwt = require('jsonwebtoken');
let Validator = require('validatorjs');

var authRouter = require('./api/routers/AuthRouter.js');
var deadlinesRouter = require('./api/routers/DeadlinesRouter.js');
var userRouter = require('./api/routers/UserRouter.js');
var groupsRouter = require('./api/routers/GroupsRouter.js');

var app = express();
app.use(bodyParser.json({ type: 'application/json' }));
app.options('*', cors());
app.use(cors());

app.use('/auth', authRouter);
app.use('/deadlines', deadlinesRouter);
app.use('/users', userRouter);
app.use('/groups', groupsRouter);

app.set('secretKey', config.secret); // secret variable
app.set('jwt', jwt);
app.set('Validator', Validator);

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

app.listen(port, function () {
  console.log('Scadenziario RESTful API server started on: ' + port);
});
