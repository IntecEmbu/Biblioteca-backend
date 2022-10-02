import db from "../database/connection.js";

// Insere um novo livro no banco de dados
async function insertBook(data) {
  const conn = await db.connect();

  const { title, edition, isbn, year, category, cdd, idiom, author } = data;

  const book_sql = `INSERT INTO tbl_book 
    (book_name, book_edition, book_isbn, release_year, category_name, book_cdd, book_language, book_author)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const quantity_sql = `INSERT INTO tbl_quantity (quantity_code) 
    VALUES (SELECT book_code FROM tbl_book WHERE book_isbn = ? and book_author = ?, book_name = ?)`;

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
  const quantity_values = [isbn, author, title];

  await conn.query(book_sql, book_values);
  await conn.query(quantity_sql, quantity_values); // não sei se está certo

  conn.end();
}

// Coleta todos os livros do banco de dados
async function getAllBooks() {
  const conn = await db.connect();

  const sql = "SELECT * FROM VW_all_books";

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

// Coleta todas as cateogorias do banco de dados
async function getAllCategory() {
  const conn = await db.connect();

  const sql =
    "SELECT category_name AS category FROM tbl_book group by category";
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
  const conn = await db.connect();

  const sql = `DELETE FROM tbl_book WHERE book_code = ?`;

  await conn.query(sql, id);

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
