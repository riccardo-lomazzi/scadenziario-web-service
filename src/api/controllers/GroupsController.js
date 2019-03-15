import Groups from '../models/Groups';

class GroupsController {
    constructor() {
        this.getGroups = this.getGroups.bind(this);
        this.setGroup = this.setGroup.bind(this);
    }

    async getGroups(req, res) {
        try {
            let groups = await Groups.getGroups(req.params.groupId);
            if (!groups)
                return res.status(404).json({
                    success: false,
                    message: 'Nessun gruppo trovato',
                });
            return res.status(200).json({
                success: true,
                message: 'Gruppi utenti',
                data: groups
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error ' + err,
            });
        }
    }

    async setGroup(req, res) {
        try {
            let groups = await Groups.setGroup(req.params.groupId, req.body.newGroupName);
            if (!groups)
                return res.status(404).json({
                    success: false,
                    message: 'Nessun gruppo modificato',
                });
            //dobbiamo creare i diritti di visione per l'utente e per l'admin
            if (!req.params.groupId) { //se è stato creato un nuovo gruppo
                console.log('groups', groups);
                let membership = await Groups.setGroupMemberships(res.locals.userid, groups);
                if (!membership) {
                    return res.status(404).json({
                        success: false,
                        message: 'Impossibile associare utente al gruppo',
                    });
                }
            }
            return res.status(201).json({
                success: true,
                message: (req.params.groupId) ? 'Gruppo modificato' : 'Gruppo creato',
                data: groups
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Error ' + err,
            });
        }
    }

}

export default new GroupsController();