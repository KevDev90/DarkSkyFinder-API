const express = require('express');
const knex = require("knex");
const app = require('./app')
const { DATABASE_URL } = require("./config")
process.env.NODE_TLS_REJECT_UNAUTHORIZED=0
const pg = require('pg');

const PORT = process.env.PORT || 8000;
const db = knex({
  client: 'pg',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    ssl: { rejectUnauthorized: false }
})

app.set('db', db)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};