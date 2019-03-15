import AuthController from '../controllers/AuthController';
import DeadlinesController from '../controllers/DeadlinesController';

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
        //con questo userID, prendi tutti i gruppi associati ad esso
        AuthController.getUserGroupsFromUserID(userID)
            .then(userGroups => {
                res.locals.userid = userID;
                res.locals.userGroups = userGroups;
                next();
            });
    } catch (err) {
        console.log('err', err);
        res.status(401).json({
            success: false,
            message: 'Impossibile autenticare il token.'
        });
    }
});


router.get('/all', DeadlinesController.getAllTransactions);
router.get('/:transactionId', DeadlinesController.getTransaction);
router.put('/:transactionId', DeadlinesController.setTransaction);
router.delete('/:transactionId', DeadlinesController.deleteTransaction);

module.exports = router;
