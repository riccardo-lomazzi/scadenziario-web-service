import DBConnectionData from '../handlers/DBConnectionData';
import Transactions from './Transactions';
import Groups from './Groups';

class Users {
    constructor() {
        this.mariadb = require('mariadb');
    }

    exists(username, password) {
        //TODO: controlla che il dato esista nel db
        return this.mariadb.createConnection(DBConnectionData.getConnectionData())
            .then(conn => {
                return conn.query(
                    "SELECT * FROM utenti WHERE username = ? AND password = ?",
                    [username, password])
                    .then(rows => {
                        let esito = false;
                        //console.log(rows);
                        if (rows.length > 0) {
                            //TODO: ritornare l'esito
                            console.log("User exists");
                            esito = true;
                        }
                        else {
                            console.log("User doesn't exist");
                            esito = false;
                        }
                        conn.end();
                        return esito;
                    })
                    .catch(err => {
                        console.log(err);
                        conn.end();
                        throw err;
                    });
            });
    }

    getUserID(username, password) {
        return this.mariadb.createConnection(DBConnectionData.getConnectionData())
            .then(conn => {
                return conn.query('SELECT userid FROM utenti WHERE username = ? AND password = ?',
                    [username, password])
                    .then(rows => {
                        conn.end();
                        if (rows.length > 0) {
                            return rows[0].userid;
                        }
                        else
                            return false;
                    })
                    .catch(err => {
                        console.log('Errore nel prendere userID:', err);
                        throw err;
                    });
            });
    }

    getUserGroups(userID) {
        return this.mariadb.createConnection(DBConnectionData.getConnectionData())
            .then(conn => {
                return conn.query('SELECT * FROM membrigruppi JOIN gruppi ON membrigruppi.idgruppo = gruppi.idgruppo WHERE userid = ?',
                    [userID])
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

    getUsers(userID) {
        return this.mariadb.createConnection(DBConnectionData.getConnectionData())
            .then(conn => {
                let query = '', params = [];
                if (!userID) {
                    query = 'SELECT * FROM utenti';
                    params = [];
                } else {
                    query = 'SELECT * FROM utenti WHERE userid = ?';
                    params = [userID];
                }
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
                        console.log('Errore nel prendere utenti:', err);
                        throw err;
                    });
            });
    }

    async getUserData(userID) {
        let result = undefined;
        if (!userID) { //get all users
            let allUsers = await this.getUsers(false);
            if (!allUsers) return false;
            result = allUsers.map(async (utente) => {
                console.log("utente multiplo", utente);
                let userGroups = await this.getUserGroups(utente.userid);
                return {
                    "user": {
                        "id": utente.userid,
                        "nome": utente.nome,
                        "email": utente.email,
                        "username": utente.username,
                        "password": utente.password,
                    },
                    "groups": userGroups,
                    "movimenti": await Transactions.getTransactionsForUserID(userGroups, false),
                };
            });
        } else {
            let rows = await this.getUsers(userID);
            let utente = rows[0];
            if (!utente) return false;
            let userGroups = await this.getUserGroups(utente.userid);
            result = {
                "user": {
                    "id": utente.userid,
                    "nome": utente.nome,
                    "email": utente.email,
                    "username": utente.username,
                    "password": utente.password,
                },
                "groups": userGroups,
                "movimenti": await Transactions.getTransactionsForUserID(userGroups, false),
            }
        }
        return result;
    }

}

export default new Users();