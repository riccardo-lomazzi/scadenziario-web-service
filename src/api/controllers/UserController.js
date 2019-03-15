import Users from '../models/Users';

class UserController {
    constructor() {
        this.getUserData = this.getUserData.bind(this);
    }

    async getUserData(req, res) {
        let userID = req.params.userId;
        console.log("userID", userID);
        try {
            let response = await Users.getUserData(userID);
            if (response)
                return res.status(200).json({
                    success: true,
                    message: 'dati utente',
                    data: response
                });
            else
                return res.status(401).json({
                    success: false,
                    message: 'utente inesistente',
                });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err,
            });
        }
    }
}

export default new UserController();