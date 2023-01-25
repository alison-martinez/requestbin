require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

//const PG_HOST = process.env.PG_HOST
//const PG_PORT = process.env.PG_PORT
//const PG_USER = process.env.PG_USER
//const PG_PASSWORD = process.env.PG_PASSWORD
const PG_DATABASE = process.env.PG_DATABASE

module.exports = {
  MONGODB_URI,
  PORT,
  //PG_HOST,
  //PG_PORT,
  //PG_USER,
  //PG_PASSWORD,
  PG_DATABASE
}