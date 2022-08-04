import db from '../Database/Connection.js'

async function insertBook(data){
    const conn = await db.connect()

    const {title, edition, isbn, year, category, cdd, idiom, publisher_name} = data

    // Depois adicionar os nomes corretos das colunas
    const sql = 'INSERT INTO tbl_book (book_name, book_edition, book_isbn, release_year, category_name, book_cdd, book_language, publisher_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

    const values = [title, edition, isbn, year, category, cdd, idiom, publisher_name]

    await conn.query(sql, values)

    conn.end()
}

async function getAllBooks(){
    const conn = await db.connect()

    const sql = 'SELECT * FROM tbl_book'

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

export default {insertBook, getAllBooks}