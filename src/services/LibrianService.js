import db from '../Database/Connection.js'

// Realiza o cadastro de colaboradores
async function createCollaborator(data){
  const conn = await db.connect()

  const {name, email, password, login} = data

  const sql = 'INSERT INTO tbl_librian (librian_name, librian_email, librian_password, librian_login, librian_type, librian_status), values (?, ?, ?, ?, ?, ?)'

  const values = [name, email, password, login, 'Colaborador', 'Ativo']

  await conn.query(sql, values)

  conn.end()
}

// Realiza o login do Bibliotecario
async function loginCollaborator(data){
  const conn = await db.connect()

  const {login, password} = data

  const sql = 'SELECT * From tbl_librian where librian_login = ? and librian_password = ? and librian_status = ?'

  const values = [login, password, 'Ativo']

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
async function getActivatedCollaborators(){
  const conn = await db.connect()

  const sql = 'SELECT * FROM tbl_librian WHERE librian_status = ?'

  const [rows] = await conn.query(sql, 'Ativo')

  conn.end()

  return rows
}

// Coleta todos os colaboradores inativos
async function getDesactivatedCollaborators(){
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
  getActivatedCollaborators,
  getDesactivatedCollaborators
}