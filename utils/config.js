require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const PG_DATABASE = process.env.PG_DATABASE

module.exports = {
  MONGODB_URI,
  PORT,
  PG_DATABASE
}