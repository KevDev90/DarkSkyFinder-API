const express = require('express');
const knex = require("knex");
const app = require('./app')
const { DATABASE_URL } = require("./config")

const PORT = process.env.PORT || 8000;

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

app.set('db', db)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};