import db from "../database/connection.js";

// Insere um novo livro no banco de dados
async function insertBook(data) {
  const { title, edition, isbn, year, category, cdd, idiom, author } = data;

  const book_sql = `INSERT INTO tbl_book 
    (book_name, book_edition, book_isbn, release_year, category_name, 
    book_cdd, book_language, book_author)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const quantity_sql = `INSERT INTO tbl_quantity (FK_book) 
    VALUES ((SELECT book_code FROM tbl_book WHERE book_name = ? and book_edition = ? and
      book_isbn = ? and release_year = ? and category_name = ? and book_cdd = ? and
      book_language = ? and book_author = ?))`;

  const book_values = [
    title,
    edition,
    isbn,
    year,
    category,
    cdd,
    idiom,
    author,
  ];

  const conn = await db.connect();

  const [rows] = await conn.query(
    "SELECT (*) FROM tbl_book WHERE book_name = ? and book_edition = ? and book_isbn = ? and release_year = ? and category_name = ? and book_cdd = ? and book_language = ? and book_author = ?",
    book_values
  );

  if (rows[0].total === 0) {
    await conn.query(book_sql, book_values);
    await conn.query(quantity_sql, book_values);

    conn.end();
    return true;
  }

  conn.end();
  return false;
}

// Coleta todos os livros do banco de dados
async function getAllBooks() {
  const conn = await db.connect();

  const sql = "SELECT * FROM VW_all_books WHERE book_status = 'Ativo'";

  const [rows] = await conn.query(sql);

  conn.end();
  return rows;
}

async function getCountBooks() {
  const conn = await db.connect();

  const sql = "SELECT COUNT(*) AS total FROM tbl_book";

  const [rows] = await conn.query(sql);

  conn.end();
  return rows;
}

// Pesquisa o livro pelo autor
async function getBookByAuthor(author) {
  const conn = await db.connect();

  const sql = "SELECT * FROM tbl_book WHERE book_author like ?";
  const values = `%${author}%`;

  const [rows] = await conn.query(sql, values);

  conn.end();
  return rows;
}

// Pesquisa livro pelo nome
async function getBookByName(name) {
  const conn = await db.connect();

  const sql = "SELECT * FROM tbl_book WHERE book_name like ?";
  const values = `%${name}%`;

  const [rows] = await conn.query(sql, values);

  conn.end();
  return rows;
}

// Pesquisa livro por categoria
async function getBookByCategory(category) {
  const conn = await db.connect();

  const sql = "SELECT * FROM tbl_book WHERE category_name like ?";
  const values = `%${category}%`;

  const [rows] = await conn.query(sql, values);

  conn.end();
  return rows;
}

// Atualiza os dados do livro
async function updateBook(data) {
  const conn = await db.connect();

  const {
    title,
    edition,
    isbn,
    release_year,
    category,
    cdd,
    language,
    author,
    id,
  } = data;

  const sql = `UPDATE tbl_book SET
        book_name = ?, book_edition = ?, book_isbn = ?, release_year = ?,
        category_name = ?, book_cdd = ?, book_language = ?, book_author = ? 
            WHERE book_code = ?`;

  const values = [
    title,
    edition,
    isbn,
    release_year,
    category,
    cdd,
    language,
    author,
    id,
  ];

  await conn.query(sql, values);

  conn.end();
}

// deleta um livro
async function deleteBook(id) {
  // OBS: Quando fazer todo o crud do sistema, fazer com que o livro seja deletado,
  // e delete junto com ele todas as informações que estão relacionadas a ele, na seguinte ordem:
  // 1 - tbl_quantity
  // 2 - tbl_penalty
  // 3 - tbl_lending
  // 4 - tbl_book

  const conn = await db.connect();

  const tbl_quantity_sql = "DELETE FROM tbl_quantity WHERE FK_book = ?";
  const tbl_penalty_sql = "DELETE FROM tbl_penalty WHERE FK_book = ?";
  const tbl_lending_sql = "DELETE FROM tbl_lending WHERE FK_book = ?";
  const tbl_book_sql = "DELETE FROM tbl_book WHERE book_code = ?";

  await conn.query(tbl_quantity_sql, id);
  await conn.query(tbl_penalty_sql, id);
  await conn.query(tbl_lending_sql, id);
  await conn.query(tbl_book_sql, id);

  conn.end();
}

export default {
  insertBook,
  getAllBooks,
  getCountBooks,
  getBookByAuthor,
  getBookByName,
  getBookByCategory,
  updateBook,
  deleteBook,
};
