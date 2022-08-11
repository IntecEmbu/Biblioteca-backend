import db from '../Database/Connection.js'

// Realiza o cadastro de voluntários
async function createCollaborator(data){
  const conn = await db.connect()

  const {name, email, password} = data

  const sql = 'INSERT INTO tbl_librian (librian_name, librian_email, librian_password, librian_type) values (?, ?, ?, ?)'

  const values = [name, email, password, 'Colaborador']

  await conn.query(sql, values)

  conn.end()
}

// Realiza o login do Bibliotecario
async function loginCollaborator(data){
  const conn = await db.connect()

  const {email, password} = data

  const sql = 'SELECT * From tbl_librian where librian_email = ? and librian_password = ?'

  const values = [email, password]

  const [rows] = await conn.query(sql, values)

  conn.end()

  return rows
}

export default{
  createCollaborator,
  loginCollaborator
}