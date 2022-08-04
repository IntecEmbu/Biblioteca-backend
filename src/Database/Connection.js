// Concecta com o banco

import mysql from 'mysql2/promise'

async function connect(){

  const DB_HOST = process.env.DB_HOST || 'localhost'
  const DB_USER = process.env.DB_USER || 'root'
  const DB_PWD = process.env.DB_PWD || ''
  const DB_NAME = process.env.DB_NAME || 'biblioteca'

  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PWD, 
    database: DB_NAME
  })

  return connection
}

export default {connect}