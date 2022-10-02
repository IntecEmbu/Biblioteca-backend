import db from "../database/connection.js";

// Realiza o cadastro de usuarios
async function createUser(data) {
  const { name, email, type, phone, course } = data;

  const conn = await db.connect();

  const sql = `INSERT INTO tbl_user 
    (user_name, user_email, user_type, user_phone, user_course) 
        value (?, ?, ?, ?, ?)`;

  const values = [name, email, type, phone, course];

  await conn.query(sql, values);

  conn.end();
}

// Coleta todos os usuarios cadastrados
async function getAllUsers() {
  const conn = await db.connect();

  const sql = "SELECT * From tbl_user ORDER BY user_code DESC";

  const [rows] = await conn.query(sql);

  conn.end();

  return rows;
}

// Pesquisa usuarios pelo nome
async function searchUserByName(name) {
  const conn = await db.connect();

  const sql = "SELECT * From tbl_user where user_name = ?";

  const [rows] = await conn.query(sql, name);

  conn.end();

  return rows;
}

// Atualiza os dados do usuario
async function updateUser(data) {
  const { name, email, type, phone, course, id } = data;

  const conn = await db.connect();

  const sql = `UPDATE tbl_user SET
    user_name = ?, user_email = ?, user_type = ?, user_phone = ?, user_course = ? 
        WHERE user_code = ?`;

  const values = [name, email, type, phone, course, id];

  await conn.query(sql, values);

  conn.end();
}

// Deleta um usuario
async function deleteUser(id) {
  const conn = await db.connect();

  const sql = "DELETE FROM tbl_user WHERE user_code = ?";

  await conn.query(sql, id);

  conn.end();
}

export default {
  createUser,
  getAllUsers,
  searchUserByName,
  updateUser,
  deleteUser,
};
