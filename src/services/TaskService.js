import db from "../database/connection.js";
import closeToDateEmail from "../email/closeToDate.js"
import sendMail from "../services/sendEmail.js";

// Coleta os empréstimos que estão para vencer
async function getCloseToDate() {
    const conn = await db.connect();

    const sql = "SELECT * FROM VW_lending_CloseToDate_4";

    const [rows] = await conn.query(sql);

    // Para cada emprestimo proximo ao vencimento coletado, ele marca como avisado
    for (const row of rows) {
        await conn.query(
            "UPDATE tbl_lending SET warning = true WHERE id = ?",
            [row.lending_code]
        );
    }

    conn.end();
    return rows;
}

// Para cara emprestimo que está para vencer encontrado ele envia email para o usuário
async function sendEmail(){
    const closeToDate = await getCloseToDate();

    for (const row of closeToDate) {
        // Formata a data de: 2022-10-20T00:00:00.000Z para: 20/10/2022
        const return_prediction_formatted = row.return_prediction
            .toISOString()
            .split("T")[0]
            .split("-")
            .reverse()
            .join("/");

        // Formata a data de: 20/10/2022 para: Segunda-feira
        const return_prediction_day = new Date(
            return_prediction_formatted
        ).toLocaleDateString("pt-BR", { weekday: "long" });

        const email = closeToDateEmail(
            row.user_name,
            row.book_name,
            return_prediction_formatted,
            return_prediction_day,
            row.lending_code
        );

        sendMail(row.user_email, "Empréstimo próximo ao vencimento", email);
    }
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
    sendEmail,
    applyPenalty
}