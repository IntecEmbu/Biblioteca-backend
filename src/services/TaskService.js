import db from "../database/connection.js";

// Coleta os empréstimos que estão para vencer
async function getCloseToDate() {
    const conn = await db.connect();

    const sql = "SELECT * FROM VW_lending_CloseToDate_4";

    const [rows] = await conn.query(sql);

    conn.end();
    return rows;
}

// Coleta os empréstimos que estão atrasados
async function getOverdue() {
    const conn = await db.connect();

    const sql = "SELECT * FROM VW_lending_delay";

    const [rows] = await conn.query(sql);

    conn.end();
    return rows;
}

// Aplica multa nos emprestimos atrasados
async function applyFine(){
    const overdue = await getOverdue();
    const value = 1.00;

    const conn = await db.connect();

    // Irá percorrer todos os emprestimos atrasados
    // E incrementar o valor da multa somente uma vez por dia de atraso
}

export default {
    applyFine,
    getCloseToDate
}