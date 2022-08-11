import db from '../Database/Connection.js'

// Realiza o cadastro de colaboradores
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

// Altera status do colaborador para ativo
async function activatedCollaborator(id){
  const conn = await db.connect()

  const sql = 'UPDATE tbl_librian SET librian_status = ? WHERE librian_id = ?'

  const values = ['Ativo', id]

  await conn.query(sql, values)

  conn.end()
}

// Altera status do colaborador para inativo
async function deactivatedCollaborator(id){
  const conn = await db.connect()

  const sql = 'UPDATE tbl_librian SET librian_status = ? WHERE librian_id = ?'

  const values = ['Inativo', id]

  await conn.query(sql, values)

  conn.end()
}

// Coleta todos os colaboradores
async function getAllCollaborators(){
  const conn = await db.connect()

  const sql = 'SELECT * FROM tbl_librian'

  const [rows] = await conn.query(sql)

  conn.end()

  return rows
}

// Coleta todos os colaboradores ativos
async function getAllActivatedCollaborators(){
  const conn = await db.connect()

  const sql = 'SELECT * FROM tbl_librian WHERE librian_status = ?'

  const [rows] = await conn.query(sql, 'Ativo')

  conn.end()

  return rows
}

// Coleta todos os colaboradores inativos
async function getAllDeactivatedCollaborators(){
  const conn = await db.connect()

  const sql = 'SELECT * FROM tbl_librian WHERE librian_status = ?'

  const [rows] = await conn.query(sql, 'Inativo')

  conn.end()

  return rows
}

export default{
  createCollaborator,
  loginCollaborator,
  activatedCollaborator,
  deactivatedCollaborator,
  getAllCollaborators,
  getAllActivatedCollaborators,
  getAllDeactivatedCollaborators
}