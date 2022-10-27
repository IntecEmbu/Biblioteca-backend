import db from "../database/connection.js";

// Realiza o cadastro de colaboradores
async function createCollaborator(data) {
  const { name, email, password, user } = data;

  const conn = await db.connect();

  const sql = `INSERT INTO tbl_librarian
    (librarian_name, librarian_email, librarian_password, 
    librarian_user, librarian_type, librarian_status) 
      values (?, ?, ?, ?, 'Colaborador', 'Ativo')`;

  const values = [name, email, password, user];

  await conn.query(sql, values);

  conn.end();
}

// Realiza o login do Bibliotecario
async function loginCollaborator(data) {
  let dataResult = [];
  const { user, password } = data;

  const conn = await db.connect();

  // Verifica se o usuário está ativo
  let [rows] = await conn.query(
    `SELECT COUNT(*) AS count FROM tbl_librarian WHERE librarian_status = ? AND librarian_user = ?`, 
    ["Inativo", user]
  );

  if (rows[0].count > 0) {
    dataResult[0] = "Usuário inativo";
    conn.end();
    return dataResult;
  }


  // Verifica se o usuario existe
  [rows] = await conn.query(
    "SELECT count(*) from tbl_librarian WHERE librarian_user = ?",
    [user]
  );

  if (rows[0]["count(*)"] === 0) {
    dataResult[0] = "Usuário não encontrado";
    
    conn.end();
    return dataResult;
  }


  // Verifica se a senha está correta
  [rows] = await conn.query(
    `SELECT librarian_code, librarian_name, librarian_type
    From tbl_librarian 
      where librarian_user = ? and librarian_password = ? and librarian_status = 'Ativo'`, 
    [user, password]
  );

  if(rows.length === 0){
    dataResult[0] = "Senha incorreta!";
  }else{
    dataResult[0] = "Login realizado com sucesso!";
    dataResult[1] = rows;
  }
  
  conn.end();
  return dataResult;
}

// Coleta todos os colaboradores
async function getAllCollaborators() {
  const conn = await db.connect();

  const sql = `SELECT 
  librarian_code, librarian_name, librarian_type, librarian_status, librarian_email, librarian_user
    FROM tbl_librarian WHERE librarian_type != "ADM"
      ORDER BY librarian_code DESC`;

  const [rows] = await conn.query(sql);

  conn.end();

  // Ordena primeiro os ativos e depois os inativos
  rows.sort((a, b) => {
    if (a.librarian_status === "Ativo") {
      return -1;
    } else {
      return 1;
    }
  });

  return rows;
}

// Atualiza os dados do colaborador
async function updateCollaborator(data) {
  const { name, email, user, id, type, status } = data;

  const conn = await db.connect();

  const sql = `UPDATE tbl_librarian SET
  librarian_name = ?, librarian_email = ?, librarian_user = ?, librarian_type = ?, librarian_status = ?
    WHERE librarian_code = ?`;

  const values = [name, email, user, type, status, id];

  await conn.query(sql, values);

  conn.end();
}

// Altera status do colaborador para inativo
async function desativateCollaborator(id) {
  const conn = await db.connect();

  const sql =
    "UPDATE tbl_librarian SET librarian_status = ? WHERE librarian_code = ?";

  const values = ["Inativo", id];

  await conn.query(sql, values);

  conn.end();
}

// Altera status do colaborador para ativo
async function activateCollaborator(id) {
  const conn = await db.connect();

  const sql =
    "UPDATE tbl_librarian SET librarian_status = ? WHERE librarian_code = ?";
  const values = ["Ativo", id];

  await conn.query(sql, values);
  conn.end();
}

export default {
  createCollaborator,
  loginCollaborator,
  getAllCollaborators,
  updateCollaborator,
  desativateCollaborator,
  activateCollaborator
};
