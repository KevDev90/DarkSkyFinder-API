const express = require('express');
const knex = require("knex");
const app = require('./app')
const { DATABASE_URL } = require("./config")
process.env.NODE_TLS_REJECT_UNAUTHORIZED=0
const pg = require('pg');
// pg.defaults.ssl = process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false;

const PORT = process.env.PORT || 8000;
const db = knex({
  client: 'pg',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    ssl: { rejectUnauthorized: false }
  // client: 'pg',
  // connection: DATABASE_URL,
    // connection: {
  //   ssl: true,
  //   host:'ec2-54-211-176-156.compute-1.amazonaws.com',
  //   user:'shfqsekarskwby',
  //   password:'9df5be1017edb015aada87fd385802c476ee8770569331f386d2cb49f9fa0624',
  //   database:'db65fnmlmrmiob',
  //   options:{encrypt:true}
  //   }
})

app.set('db', db)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};