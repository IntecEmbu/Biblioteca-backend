import db from '../database/connection.js'

// Realiza o cadastro de colaboradores
async function createCollaborator(data){
  const {name, email, password, login} = data

  const conn = await db.connect()

  const sql = `INSERT INTO tbl_librarian
    (librarian_name, librarian_email, librarian_password, 
    librarian_login, librarian_type, librarian_status), 
      values (?, ?, ?, ?, 'Colaborador', 'Ativo')`

  const values = [name, email, password, login]

  await conn.query(sql, values)

  conn.end()
}

// Realiza o login do Bibliotecario
async function loginCollaborator(data){
  const {login, password} = data

  const conn = await db.connect()

  const sql = `SELECT librarian_code, librarian_name, librarian_type
    From tbl_librarian 
      where librarian_login = ? and librarian_password = ? and librarian_status = 'Ativo'`

  const values = [login, password]

  const [rows] = await conn.query(sql, values)

  conn.end()

  return rows
}

// Altera status do colaborador para ativo
async function activatedCollaborator(id){
  const conn = await db.connect()

  const sql = 'UPDATE tbl_librarian SET librarian_status = ? WHERE librarian_id = ?'

  const values = ['Ativo', id]

  await conn.query(sql, values)

  conn.end()
}

// Altera status do colaborador para inativo
async function deactivatedCollaborator(id){
  const conn = await db.connect()

  const sql = 'UPDATE tbl_librarian SET librarian_status = ? WHERE librarian_id = ?'

  const values = ['Inativo', id]

  await conn.query(sql, values)

  conn.end()
}

// Coleta todos os colaboradores
async function getAllCollaborators(){
  const conn = await db.connect()

  const sql = `SELECT librarian_code, librarian_name, librarian_type, librarian_status
  FROM tbl_librarian`

  const [rows] = await conn.query(sql)

  conn.end()

  return rows
}

// Coleta todos os colaboradores ativos
async function getActivatedCollaborators(){
  const conn = await db.connect()

  const sql = `SELECT librarian_code, librarian_name, librarian_type, librarian_status
  FROM tbl_librarian WHERE librarian_status = ?`

  const [rows] = await conn.query(sql, 'Ativo')

  conn.end()

  return rows
}

// Coleta todos os colaboradores inativos
async function getDesactivatedCollaborators(){
  const conn = await db.connect()

  const sql = `SELECT librarian_code, librarian_name, librarian_type, librarian_status
  FROM tbl_librarian WHERE librarian_status = ?`

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