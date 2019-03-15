import Users from '../models/Users';

class AuthController {
    constructor() {
        this.loginUser = this.loginUser.bind(this);
    }

    loginUser(req, res) {
        this.createToken(req.body.username, req.body.password, req.app.get('secretKey'), req.app.get('jwt'))
            .then(esito => {
                if (esito === false)
                    res.status(401).json({
                        success: false,
                        message: "Nessun utente associato a questi username/password",
                    });
                res.status(200).json({
                    success: true,
                    message: 'Ecco il token!',
                    token: esito
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    message: err,
                });
            });
    }

    createToken(username, password, secretKey, jwt) {
        console.log('username', username, 'password', password);
        return Users.exists(username, password).then(esito => {
            if (esito) {
                //get user id
                return Users.getUserID(username, password).then(userID => {
                    if (userID) {
                        let token = jwt.sign({ userID: userID, },
                            secretKey,
                            {
                                // expiresIn: 86400,
                            });
                        console.log('token', token);
                        return token;
                    } //impossibile trovare l'utente (non dovrebbe accadere ma non si sa mai)
                    else return false;
                });
            }
            else { //utente non esiste
                return false;
            }
        });
    }

    verifyToken(token, secretKey, jwt) {
        // verifies secret and checks exp
        return jwt.verify(token, secretKey, function (err, decoded) {
            if (err) {
                throw err;
            } else {
                return decoded;
            }
        });

    }

    getUserGroupsFromUserID(userID) {
        return Users.getUserGroups(userID)
            .then(arrayIdGruppi => { return arrayIdGruppi; });
    }
}

export default new AuthController();