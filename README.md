# Scadenziario web-service

The web-service part of the Scadenziario suite, which is a webapp to register fee payment deadlines. 
It is based on a Express server written in ES6.

### Requirements
- Node.js Express server
- A mariadb/MySQL DBMS

### Structure

This RESTful API is built on the MVC pattern, and supports CRUD operations. It provides
- basic authentication with JWT
- fees insertion / updating with various attributes (e.g. fee group, date, type of transaction, etc) and data validation
- fee groups creation


Most of the functions above can be tested on the test page found in `src/api/tests/index.html`, provided you: 
- install all the dependencies in `package.json`
- have a DB structured like this (all the tables and their fields are in Italian)

| Table name | Columns | Description |
| --- | --- | --- |
| utenti | (`userid`, `username`, `password`, `nome`) | Table to store users' login data |
| movimenti | (`idmovimento`, `nome`, `idgruppo`, `tipomovimento`, `importo`, `valuta`, `dettagli`, `datamovimento`, `userid_creazione`, `datacreazione`) | Table to register all the deadlines. `idmovimento` must be set on `AUTO_INCREMENT` |
| gruppi | (`idgruppo`, `nome`) | Table to store fee groups |
| gruppiutenti | (`userid`, `idgruppo`) | Table that joins users and fee groups (not everyone can see other people's groups, only the admin) |
| tipimovimento | (`nome`) | Table to store fee types (`DARE` -> expenses, `AVERE` -> revenues) |

- load the page on the same network location of the Express server (`localhost`)


