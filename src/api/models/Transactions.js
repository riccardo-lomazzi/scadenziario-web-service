import DBConnectionData from '../handlers/DBConnectionData';
import { formatDate } from '../handlers/DataFormatter';

class Transactions {
    constructor() {
        this.mariadb = require('mariadb');
    }

    getTransaction(transactionId) {
        return this.mariadb.createConnection(DBConnectionData.getConnectionData())
            .then(conn => {
                let query = 'SELECT * from movimenti WHERE idmovimento = ?';
                let params = [transactionId];
                return conn.query(query, params)
                    .then(rows => {
                        conn.end();
                        if (rows.length <= 0)
                            return false;
                        return rows;
                    }).catch(err => {
                        conn.end();
                        throw err;
                    });
            }
            );
    }

    getTransactionsForUserID(userGroups, transactionType) {
        //vanno restituiti i movimenti che può vedere un certo utente
        //crea un escape token per ogni elemento dell'array di gruppi
        userGroups = userGroups.map(gruppo => gruppo.idgruppo);
        let userGroupsTokens = DBConnectionData.createMasks(userGroups);
        //prepara la query
        let query = "", params;
        if (transactionType) {
            query = "SELECT * from movimenti WHERE tipomovimento=? AND idgruppo IN (" + userGroupsTokens + ");";
            params = [transactionType, ...userGroups]; //... necessario per copiare gli elementi dell'array dentro ai param
        } else {
            query = "SELECT * from movimenti WHERE idgruppo IN (" + userGroupsTokens + ") ;";
            params = [...userGroups];
        }
        //esegui la query
        return this.mariadb.createConnection(DBConnectionData.getConnectionData())
            .then(conn => {
                return conn.query(query, params)
                    .then(rows => {
                        conn.end();
                        if (rows.length <= 0) {
                            //TODO: ritornare l'esito
                            console.log("Nessun movimento trovato");
                            return false;
                        }
                        else {
                            //console.log("righe", rows)
                            return rows;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        conn.end();
                        throw err;
                    });
            });
    }

    getGroupTransactions(userGroups) {
        return this.mariadb.createConnection(DBConnectionData.getConnectionData())
            .then(conn => {
                userGroups = userGroups.map(gruppo => gruppo.idgruppo);
                let userGroupsMasks = DBConnectionData.createMasks(userGroups);
                return conn.query(
                    "SELECT * from movimentigruppi WHERE idgruppo IN (" + userGroupsMasks + ")", userGroups
                )
                    .then(rows => {
                        conn.end();
                        if (rows.length <= 0) {
                            //TODO: ritornare l'esito
                            console.log("Nessun movimento trovato per il/i gruppo/i selezionato/i");
                            return false;
                        }
                        else {
                            return rows;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        conn.end();
                        throw err;
                    });
            });
    }

    setTransactionForUserID(transactionId, userid_creazione, { idgruppo, tipomovimento, importo, valuta, nome, dettagli, datamovimento }) {
        //1 - set record inside "movimenti"
        return this.mariadb.createConnection(DBConnectionData.getConnectionData())
            .then(conn => {
                if (transactionId !== 'new' && !Number.isInteger(Number(transactionId))) return false;
                let query = '', params;
                if (transactionId !== 'new') {
                    query = 'UPDATE movimenti SET idgruppo = ?, tipomovimento = ?, importo = ?, valuta = ?, nome = ?, dettagli = ? , datamovimento = ? WHERE idmovimento = ?';
                    params = [idgruppo, tipomovimento, importo, valuta, nome, dettagli, datamovimento, transactionId];
                    console.log("params update", params);
                } else {
                    query = "INSERT INTO movimenti (userid_creazione, idgruppo, tipomovimento, importo, valuta, nome, dettagli, datamovimento) VALUE (?, ?, ?, ?, ?, ?, ?, ?)";
                    params = [userid_creazione, idgruppo, tipomovimento, importo, valuta, nome, dettagli, datamovimento];
                }
                return conn.query(query, params)
                    .then(rows => {
                        conn.end();
                        if (transactionId === 'new') {
                            console.log('Inserted new transaction')
                            return (rows.insertId) ? true : false;
                        } else {
                            console.log('Updated transaction')
                            return (rows.affectedRows > 0) ? true : false;
                        }
                    }).catch(err => {
                        console.log(err);
                        conn.end();
                        throw err;
                    });
            });
    }

    deleteTransaction(transactionId) {
        return this.mariadb.createConnection(DBConnectionData.getConnectionData())
            .then(conn => {
                let query = 'DELETE FROM movimenti WHERE idmovimento = ?';
                let params = [transactionId];
                return conn.query(query, params)
                    .then(rows => {
                        conn.end();
                        return (rows.affectedRows > 0) ? true : false;
                    }).catch(err => {
                        console.log(err);
                        conn.end();
                        throw err;
                    });
            });
    }
}

export default new Transactions();