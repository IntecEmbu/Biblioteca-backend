import db from "../database/connection.js";

// Coleta os empréstimos que estão para vencer
async function getCloseToDate() {
    const conn = await db.connect();

    const sql = "SELECT * FROM VW_lending_CloseToDate_4";

    const [rows] = await conn.query(sql);

    conn.end();
    return rows;
}

// Coleta os empréstimos que estão atrasados que ainda não sofreram multa no dia
async function getOverdue() {
    const conn = await db.connect();

    const sql = "SELECT * FROM VW_lending_delay_penalty";

    const [rows] = await conn.query(sql);

    conn.end();
    return rows;
}

// Para cara emprestimo atrasado encontrado ele aplica multa dentro do bd
async function applyPenalty(){
    const lendings = await getOverdue();

    const conn = await db.connect();
    for (const lending of lendings) {
        conn.query("CALL SP_lending_penalty(?)", lending.lending_code);
    }
}

export default {
    getCloseToDate,
    applyPenalty
}