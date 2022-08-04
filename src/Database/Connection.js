// Concecta com o banco

import mysql from 'mysql2/promise'

async function connect(){

  const connection = await mysql.createConnection({
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PWD: process.env.DB_PWD || '',
    DB_NAME: process.env.DB_NAME || 'biblioteca'
  })

  return connection
}

export default {connect}