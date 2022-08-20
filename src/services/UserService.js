import db from '../Database/Connection.js'

// Realiza o cadastro de usuarios 
async function createUser(data){
    const {name, email, type, phone, course} = data

    const conn = await db.connect()

    const sql = 'INSERT INTO tbl_user (user_name, user_email, user_type, user_phone, user_course, user_status), values (?, ?, ?, ?, ?, ?)'

    const values = [name, email, type, phone, course, 'Ativo']

    await conn.query(sql, values)

    conn.end()
}