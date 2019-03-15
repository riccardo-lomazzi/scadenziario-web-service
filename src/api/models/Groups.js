import DBConnectionData from '../handlers/DBConnectionData';

class Groups {
    constructor() {
        this.mariadb = require('mariadb');
    }

    getGroups(groupId) {
        return this.mariadb.createConnection(DBConnectionData.getConnectionData())
            .then(conn => {
                let query = (!groupId) ?
                    'SELECT * from gruppi'
                    :
                    'SELECT * from gruppi WHERE idgruppo = ?';
                let params = (!groupId) ? undefined : groupId
                return conn.query(query, params)
                    .then(rows => {
                        conn.end();
                        if (rows.length > 0) {
                            return rows;
                        }
                        else
                            return false;
                    })
                    .catch(err => {
                        console.log('Errore nel prendere gruppo:', err);
                        throw err;
                    });
            });
    }

    setGroup(groupId, groupName) {
        return this.mariadb.createConnection(DBConnectionData.getConnectionData())
            .then(conn => {
                let query = (!groupId) ?
                    'INSERT INTO gruppi (nome) VALUE (?)'
                    :
                    'UPDATE gruppi SET nome = ? WHERE idgruppo = ?';
                let params = (!groupId) ? [groupName] : [groupName, groupId]
                return conn.query(query, params)
                    .then(rows => {
                        conn.end();
                        if (!groupId) {
                            return (rows.insertId) || false;
                        } else {
                            return (rows.affectedRows > 0) ? true : false;
                        }
                    })
                    .catch(err => {
                        console.log('Errore nel settare gruppo:', err);
                        throw err;
                    });
            });
    }

    setGroupMemberships(userID, groupID) {
        return this.mariadb.createConnection(DBConnectionData.getConnectionData())
            .then(conn => {
                let query = (userID.toString() === '1') ?
                    'INSERT INTO membrigruppi (idgruppo, userid) VALUE (?,?)'
                    :
                    'INSERT INTO membrigruppi (idgruppo, userid) VALUES (?,?), (?, ?)';
                let params = (userID.toString() === '1') ?
                    [groupID, userID] : [groupID, userID, groupID, 1]
                return conn.query(query, params)
                    .then(rows => {
                        conn.end();
                        return true;
                    })
                    .catch(err => {
                        console.log('Errore nel settare membri gruppo:', err);
                        throw err;
                    });
            });
    }

}

export default new Groups();