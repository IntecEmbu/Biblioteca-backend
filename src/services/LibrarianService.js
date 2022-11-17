import db from "../database/connection.js";
import emailPwd from "../email/forgotPWD.js";
import sendMail from "./sendEmail.js";

// Realiza o cadastro de colaboradores
async function createCollaborator(data) {
  const { name, email, password, user } = data;

  const conn = await db.connect();

  const sql_insert = `INSERT INTO tbl_librarian
    (librarian_name, librarian_email, librarian_password, 
    librarian_user, librarian_type, librarian_status) 
      values (?, ?, ?, ?, 'Colaborador', 'Ativo')`;

  await conn.query(sql_insert, [name, email, password, user]);
  conn.end();
  }

// Realiza o login do Bibliotecario
async function loginCollaborator(data) {
  let dataResult = [];
  const { user, password } = data;

  const conn = await db.connect();

  // Verifica se o usuário está ativo
  let [rows] = await conn.query(
    `SELECT COUNT(*) AS count FROM tbl_librarian WHERE librarian_status = ? AND (librarian_user = ? OR librarian_email = ?)`, 
    ["Inativo", user, user]
  );

  if (rows[0].count > 0) {
    dataResult[0] = "Usuário inativo";
    conn.end();
    return dataResult;
  }


  // Verifica se o usuario existe
  [rows] = await conn.query(
    "SELECT count(*) from tbl_librarian WHERE librarian_user = ? OR librarian_email = ?",
    [user, user]
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
      where (librarian_user = ? OR librarian_email = ?) and librarian_password = ? and librarian_status = 'Ativo'`, 
    [user, user, password]
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

// Solicita alteração de senha do colaborador 
async function forgotPWD(email) {

  const conn = await db.connect();

  // Verifica se o email existe
  let [rows] = await conn.query(
    "SELECT count(*) from tbl_librarian WHERE librarian_email = ?", 
    [email]
  );

  if (rows[0]["count(*)"] === 0) {
    conn.end();
    return "Email não cadastrado!";
  }

  // Gera um token de recuperação de senha com 6 numeros
  const recovery_token = Math.floor(100000 + Math.random() * 900000);

  // Atualiza o token de recuperação de senha no banco de dados com data de expiração de 1 dia
  await conn.query(
    "UPDATE tbl_librarian SET recovery_token = ?, recovery_token_expiration = DATE_ADD(NOW(), INTERVAL 1 DAY) WHERE librarian_email = ?",
    [recovery_token, email]
  );

  [rows] = await conn.query(
    "SELECT librarian_name FROM tbl_librarian WHERE librarian_email = ?",
    [email]
  );

  conn.end();

  // Envia o email com o token de recuperação de senha
  await sendMail(email, "Recuperação de senha", emailPwd(rows[0].librarian_name, recovery_token));

  return "Email enviado com sucesso!";
}

// Verifica se o token de recuperação de senha é válido
async function verifyToken(token, email) {
  const conn = await db.connect();

  // Verifica se o token é válido
  let [rows] = await conn.query(
    "SELECT count(*) FROM tbl_librarian WHERE recovery_token = ? AND librarian_email = ?",
    [token, email]
  );

  if (rows[0]["count(*)"] === 0) {
    conn.end();
    return "Token inválido";
  } else{
    // Verifica se o token está expirado
    [rows] = await conn.query(
      "SELECT count(*) FROM tbl_librarian WHERE recovery_token = ? AND recovery_token_expiration > NOW() AND librarian_email = ?",
      [token, email]
    );

    if (rows[0]["count(*)"] === 0) {
      conn.end();
      return "Token expirado";
    } else {
      conn.end();
      return "Token válido";
    }
  }
}

// Altera a senha do colaborador
async function changePWD(email, password, token) {
  const conn = await db.connect();

  // Altera a senha do colaborador
  await conn.query(
    "UPDATE tbl_librarian SET librarian_password = ?, recovery_token = NULL, recovery_token_expiration = NULL WHERE librarian_email = ? AND recovery_token = ?",
    [password, email, token]
  );

  // Remove o token e expiração do token do banco de dados
  await conn.query(
    "UPDATE tbl_librarian SET recovery_token = NULL, recovery_token_expiration = NULL WHERE librarian_email = ? AND recovery_token = ?",
    [email, token]
  );

  conn.end();

  return "Senha alterada com sucesso!";
}

export default {
  createCollaborator,
  loginCollaborator,
  getAllCollaborators,
  updateCollaborator,
  desativateCollaborator,
  activateCollaborator,
  forgotPWD,
  verifyToken,
  changePWD,
};
