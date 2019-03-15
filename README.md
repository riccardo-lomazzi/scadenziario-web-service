# Scadenziario web-service

The web-service part of the Scadenziario suite, which is a webapp to register fee payment deadlines. 
It is based on a Express server written in ES6.

### Features

This RESTful API is built on the MVC pattern, and supports CRUD operations. It provides
- basic authentication with JWT
- fees insertion / updating with various attributes (e.g. fee group, date, type of transaction, etc) and data validation
- fee groups creation


Most of the functions above can be tested on the test page found in `/src/api/tests/index.html`

### Requirements
- `Node.js Express` server
- A `mariadb/MySQL` DBMS with a `scadenziario` database structured like [this](#DB-Structure)

### Installation
- Install `packages.json` dependencies
- Insert your DBMS connection data inside `/src/api/handlers/DBConnectionData.js`
- Insert a `secret_key` for `JWT` validation inside `/src/config.js`
- Start the server with `npm run start`

### DB Structure

| Table name | Columns | Description |
| --- | --- | --- |
| utenti | (`userid`, `username`, `password`, `nome`) | Table to store users' login data |
| movimenti | (`idmovimento`, `nome`, `idgruppo`, `tipomovimento`, `importo`, `valuta`, `dettagli`, `datamovimento`, `userid_creazione`, `datacreazione`) | Table to register all the deadlines. `idmovimento` must be set on `AUTO_INCREMENT` |
| gruppi | (`idgruppo`, `nome`) | Table to store fee groups |
| gruppiutenti | (`userid`, `idgruppo`) | Table that joins users and fee groups (not everyone can see other people's groups, only the admin) |
| tipimovimento | (`nome`) | Table to store fee types (`DARE` -> expenses, `AVERE` -> revenues) |





