import UserController from '../controllers/UserController.js';
import AuthController from '../controllers/AuthController.js';

var express = require('express');
var router = express.Router();

router.all("*", function (req, res, next) {
    // console.log('headers', req.headers);
    let token = (req.headers.authorization
        && req.headers.authorization.split(' ')[0] === 'Bearer') ?
        req.headers.authorization.split(' ')[1] : undefined;
    // console.log('token', token);
    if (!token)
        res.status(401).json({
            success: false,
            message: "Token non valido",
        });
    try {
        let userID = AuthController.verifyToken(token, req.app.get('secretKey'), req.app.get('jwt')).userID;
        if (!userID) throw 'Token non verificabile';
        else res.locals.userID = userID;
        next();
    } catch (err) {
        console.log('err', err);
        res.status(401).json({
            success: false,
            message: 'Impossibile autenticare il token. ' + err
        });
    }
});

router.get('/:userId?', UserController.getUserData);

module.exports = router;
