import db from '../database/connection.js'

// Realiza o emprestimo de livros
async function createLending(data){
    const {librarian_id, book_id, cpf, return_prediction} = data

    const conn = await db.connect()

    const sql = `INSERT INTO tbl_lending
     (FK_librarian, FK_book, FK_user, withdraw_date, return_prediction),
      values (?, ?, (SELECT user_code from tbl_user where user_cpf = ?), (SELECT NOW()), (SELECT NOW() + INTERVAL ? DAY))`

    const values = [librarian_id, book_id, cpf, return_prediction]

    await conn.query(sql, values)

    conn.end()
}

// Devolve um livro
async function returnBook(lending_id){

    const conn = await db.connect()

    const sql = 'UPDATE tbl_lending SET return_date = (SELECT NOW()) WHERE lending_code = ?'

    const values = [lending_id]

    await conn.query(sql, values)

    conn.end()
}

// Retorna todos os emprestimos não devolvidos
async function getAllNotReturned(){
    
    const conn = await db.connect()

    const sql = 'SELECT * FROM tbl_lending WHERE return_date IS NULL ORDER BY lending_code DESC'

    const [rows] = await conn.query(sql)

    conn.end()

    return rows
}

// Retorna todos os emprestimos
async function getAll(){
    const conn = await db.connect()

    const sql = 'SELECT * FROM tbl_lending ORDER BY lending_code DESC'

    const [rows] = await conn.query(sql)

    conn.end()

    return rows
}

export default{
    createLending,
    returnBook,
    getAllNotReturned,
    getAll
}