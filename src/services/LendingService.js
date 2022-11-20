import db from "../database/connection.js";
import dateFormat from "dateformat.js";

// Realiza o emprestimo de livros
async function createLending(data) {
  const { librarian_id, book_id, user_cpf } = data;

  const conn = await db.connect();

  // Verifica se o usuario está cadastrado
  const sqlUser = `SELECT user_code, user_type FROM tbl_user WHERE user_cpf = "${user_cpf}"`;
  const [rows] = await conn.query(sqlUser);
  if (rows.length === 0) {
    conn.end();
    return { error: "Usuário não cadastrado!" };
  }
  const user_id = rows[0].user_code;
  const user_type = rows[0].user_type;

  // Verifica se o livro está disponivel
  const sqlBook =
    "SELECT * FROM tbl_quantity WHERE FK_book = ? AND quantity_stopped > 0";
  const [rowsBook] = await conn.query(sqlBook, book_id);
  if (rowsBook.length == 0) {
    conn.end();
    return { error: "Livro indisponível!" };
  }

  // Verifica o tipo do usuario para calular o tempo de emprestimo
  if (user_type === "Aluno") {
    // Emprestimo de 7 dias no formato YYYY-MM-DD
    var return_prediction = new Date();
    return_prediction.setDate(return_prediction.getDate() + 7);
  } else {
    // Emprestimo de 14 dias no formato YYYY-MM-DD
    var return_prediction = new Date();
    return_prediction.setDate(return_prediction.getDate() + 14);
  }

  // Realiza o emprestimo
  const sqlLending =
    "INSERT INTO tbl_lending (FK_librarian, FK_book, FK_user, return_prediction, withdraw_date) VALUES (?, ?, ?, ?, (SELECT NOW()))";

  const values = [librarian_id, book_id, user_id, return_prediction];

  // Atualiza a quantidade de livros disponiveis
  const sqlQuantity =
    "UPDATE tbl_quantity SET quantity_stopped = quantity_stopped - 1, quantity_circulation = quantity_circulation + 1 WHERE FK_book = ?";

  await conn.query(sqlLending, values);
  await conn.query(sqlQuantity, book_id);

  conn.end();
}

// Devolve um livro
async function returnBook(lending_id) {
  const conn = await db.connect();

  // Verifica se o livro já foi devolvido
  const sqlVerify = `SELECT * FROM tbl_lending WHERE lending_code = "${lending_id}" AND return_date IS NULL`;
  const [rows] = await conn.query(sqlVerify);
  if (rows.length === 0) {
    conn.end();
    return { error: "Livro já devolvido!" };
  }

  // Realiza a devolução
  const sqlLending =
    "UPDATE tbl_lending SET return_date = (SELECT NOW()) WHERE lending_code = ?";

  // Atualiza a quantidade de livros disponiveis
  const sqlQuantity =
    "UPDATE tbl_quantity SET quantity_stopped = quantity_stopped + 1, quantity_circulation = quantity_circulation - 1 WHERE FK_book = (SELECT book_code FROM tbl_book WHERE book_code = (SELECT FK_book FROM tbl_lending WHERE lending_code = ?))";

  await conn.query(sqlLending, lending_id);
  await conn.query(sqlQuantity, lending_id);

  conn.end();
}

// Retorna todos os emprestimos não devolvidos
async function getAllNotReturned() {
  const conn = await db.connect();

  const sql = "SELECT * FROM VW_lending_pending ORDER BY lending_code DESC";

  const [rows] = await conn.query(sql);
  conn.end();

  rows.forEach((row) => {
    row.withdraw_date = dateFormat.formateDateFromDatabase(row.withdraw_date);
    row.return_prediction = dateFormat.formateDateFromDatabase(row.return_prediction);
  });

  return rows;
}

// Retorna todos os emprestimos
async function getAll() {
  const conn = await db.connect();

  const sql = "SELECT * FROM tbl_lending ORDER BY lending_code DESC";

  const [rows] = await conn.query(sql);

  conn.end();

  return rows;
}

export default {
  createLending,
  returnBook,
  getAllNotReturned,
  getAll,
};
