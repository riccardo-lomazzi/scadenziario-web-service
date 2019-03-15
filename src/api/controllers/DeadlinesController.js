import Transactions from '../models/Transactions';

class DeadlinesController {
    constructor() {
        this.getAllTransactions = this.getAllTransactions.bind(this);
        this.setTransaction = this.setTransaction.bind(this);
        this.getTransaction = this.getTransaction.bind(this);
        this.deleteTransaction = this.deleteTransaction.bind(this);
    }

    getAllTransactions(req, res) {
        let transactionType = req.query['type'];
        Transactions.getTransactionsForUserID(res.locals.userGroups, transactionType)
            .then(rows => {
                if (!rows)
                    return res.status(404).json({
                        success: true,
                        message: "Nessun movimento trovato",
                    }); //not found
                return res.status(200).json({
                    success: true,
                    message: "record found",
                    data: rows,
                });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err,
                });
            });
    }

    getTransaction(req, res) {
        try {
            if (!req.params.transactionId) throw 'Invalid transactionId parameter';
            let transactionId = Number(req.params.transactionId);
            console.log("required transactionId", transactionId);
            if (!Number.isInteger(transactionId))
                return res.status(400).json({
                    success: false,
                    message: 'wrong transactionId parameter',
                });
            Transactions.getTransaction(transactionId)
                .then(esito => {
                    if (esito) {
                        return res.status(200).json({
                            success: true,
                            message: 'record found',
                            data: esito,
                        });
                    }
                    else {
                        return res.status(404).json({
                            success: false,
                            message: 'no record found',
                            data: esito,
                        });
                    }
                });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err,
            });
        }
    }

    setTransaction(req, res) {
        let data = {
            idgruppo: req.body.idgruppo || req.body.transactionGroup,
            tipomovimento: (req.body.tipomovimento || req.body.transactionType).toUpperCase(),
            importo: (req.body.importo || req.body.transactionAmount).toString().replace(',', '.'),
            valuta: req.body.valuta || req.body.transactionCurrency,
            nome: req.body.nome || req.body.transactionName,
            dettagli: req.body.dettagli || req.body.transactionDetails || '',
            datamovimento: req.body.datamovimento || req.body.transactionDate,
        };

        console.log('data', data);

        let rules = {
            idgruppo: 'required|numeric',
            tipomovimento: 'required|alpha',
            importo: 'required|numeric',
            valuta: 'required',
            nome: 'required',
            datamovimento: 'required',
        }

        let Validator = req.app.get('Validator');
        let validation = new Validator(data, rules);

        if (validation.fails()) {
            console.log(validation.errors);
            return res.status(400).json({
                success: false,
                message: 'I campi inseriti non sono validi. ',
                errors: validation.errors,
            });
        }


        Transactions.setTransactionForUserID(
            req.params.transactionId,
            res.locals.userid,
            data,
        ).then(rows => {
            let message = (req.params.transactionId !== 'new') ? "Transazione aggiornata" : "Transazione creata";
            return res.status(201).json({ success: true, message });
        }).catch(err => {
            return res.status(500).json({ success: false, message: err });
        });
    }

    deleteTransaction(req, res) {
        let transactionId = req.params.transactionId;
        if (!transactionId)
            return res.status(400).json({
                success: false,
                message: 'no transactionId sent'
            });
        Transactions.deleteTransaction(transactionId)
            .then(esito => {
                if (esito)
                    return res.status(200).json({
                        success: true,
                        message: 'Transaction deleted'
                    });
                else {
                    return res.status(200).json({
                        success: false,
                        message: 'Transaction not deleted'
                    });
                }
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            });
    }
}

export default new DeadlinesController();