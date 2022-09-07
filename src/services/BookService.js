import db from '../database/connection.js'

// Insere um novo livro no banco de dados
async function insertBook(data){
    const conn = await db.connect()

    const {title, edition, isbn, year, category, cdd, idiom, author} = data

    const sql = 'INSERT INTO tbl_book (book_name, book_edition, book_isbn, release_year, category_name, book_cdd, book_language, book_author) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    const values = [title, edition, isbn, year, category, cdd, idiom, author]

    await conn.query(sql, values)

    conn.end()
}

// Coleta todos os livros do banco de dados
async function getAllBooks(){
    const conn = await db.connect()

    const sql = 'SELECT * FROM tbl_book ORDER BY book_code DESC'

    const [rows] = await conn.query(sql)

    conn.end()
    return rows
}

async function getCountBooks(){
    const conn = await db.connect()

    const sql = 'SELECT COUNT(*) AS total FROM tbl_book'

    const [rows] = await conn.query(sql)

    conn.end()
    return rows
}

// Coleta todas as cateogorias do banco de dados
async function getAllCategory(){
    const conn = await db.connect()

    const sql = 'SELECT category_name AS category FROM tbl_book group by category'
    const [rows] = await conn.query(sql)

    conn.end()
    return rows
}

// Pesquisa o livro pelo autor
async function getBookByAuthor(author){
    const conn = await db.connect()

    const sql = 'SELECT * FROM tbl_book WHERE book_author like ?'
    const values = `%${author}%`

    const [rows] = await conn.query(sql, values)

    conn.end()
    return rows
}

// Pesquisa livro pelo nome
async function getBookByName(name){
    const conn = await db.connect()

    const sql = 'SELECT * FROM tbl_book WHERE book_name like ?'
    const values = `%${name}%`

    const [rows] = await conn.query(sql, values)

    conn.end()
    return rows
}

// Pesquisa livro por categoria
async function getBookByCategory(category){
    const conn = await db.connect()

    const sql = 'SELECT * FROM tbl_book WHERE category_name like ?'
    const values = `%${category}%`

    const [rows] = await conn.query(sql, values)

    conn.end()
    return rows
}

// Atualiza os dados do livro
async function updateBook(data){

    const conn = await db.connect()

    const {title, edition, isbn, year, category, cdd, idiom, author, id} = data

    const sql = `
    UPDATE tbl_book SET
        book_name = ?, book_edition = ?, book_isbn = ?, release_year = ?,
        category_name = ?, book_cdd = ?, book_language = ?, book_author = ? 
            WHERE book_code = ?`
    
    const values = [title, edition, isbn, year, category, cdd, idiom, author, id]

    await conn.query(sql, values)

    conn.end()
}

export default {
    insertBook,
    getAllBooks,
    getCountBooks,
    getAllCategory,
    getBookByAuthor,
    getBookByName,
    getBookByCategory,
    updateBook
}
