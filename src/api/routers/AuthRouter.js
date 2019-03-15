import AuthController from '../controllers/AuthController';

var express = require('express');
var router = express.Router();



// Home page route.
router.get('/', function (req, res) {
  res.send('Wiki home page');
});


router.post('/login', AuthController.loginUser);


module.exports = router;