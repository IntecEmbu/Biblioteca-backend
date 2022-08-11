import db from '../Database/Connection.js'

async function createLibrian(data){
  const conn = await db.connect()

  const {name, email, password} = data

  const sql = 'INSERT INTO tbl_librian (librian_name, librian_email, librian_password) values (?, ?, ?)'

  const values = [name, email, password]

  await conn.query(sql, values)

  conn.end()
}

export default{
  createLibrian
}