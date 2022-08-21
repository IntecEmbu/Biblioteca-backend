import db from '../Database/Connection.js'

// Realiza o emprestimo de livros
async function createLending(data){
    const {librian_id, book_id, user_id, withdraw_date, return_date} = data

    const conn = await db.connect()

    const sql = 'INSERT INTO tbl_lending (FK_librarian, FK_book, FK_user, withdraw_date, return_date) values (?, ?, ?, ?, ?)'

    const values = [librian_id, book_id, user_id, withdraw_date, return_date]

    await conn.query(sql, values)

    conn.end()
}

export default{
    createLending
}