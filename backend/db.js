const { Pool } = require('pg');

// Pool to connect to the RDS Postgres
const pool = new Pool({
  user: 'nevin',
  host: 'todolist.c1dflb4y7v2r.us-east-1.rds.amazonaws.com',
  database: '******', //confidential
  password: '*******', //confidential
  port: 5432
});
console.log('connected to db');
module.exports = pool;
