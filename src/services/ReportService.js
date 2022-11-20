import db from "../database/connection.js";
import dateFormat from "../utils/DateFormat.js";

// Coleta a quantidade de livros parados e em circulção
async function getBookQuantity() {
  const conn = await db.connect();

  const sql = "SELECT * FROM VW_quantity";

  const [rows] = await conn.query(sql);
  conn.end();

  return rows;
}

async function getTopReaders() {
  const conn = await db.connect();

  const sql = "SELECT * FROM VW_top_readers";

  const [rows] = await conn.query(sql);
  conn.end();

  return rows;
}

async function getReportAllBoks(){
  const conn = await db.connect()

  const sql = "SELECT * FROM VW_report_all_books"

  const [rows] = await conn.query(sql)
  conn.end()

  return rows
}

async function getReportLendingPending(){
  const conn = await db.connect()

  const sql = "SELECT * FROM VW_report_lending_pending"

  const [rows] = await conn.query(sql)
  conn.end()

  rows.forEach((row) => {
    row["Data do emprestimo"] = dateFormat(row["Data do emprestimo"])
    row["Previsão de devolução"] = dateFormat(row["Previsão de devolução"])
  })

  return rows
}

async function getReportLendingReturned(){
  const conn = await db.connect()

  const sql = "SELECT * FROM VW_report_lending_returned"

  const [rows] = await conn.query(sql)
  conn.end()

  rows.forEach((row) => {
    row["Data do emprestimo"] = dateFormat(row["Data do emprestimo"])
    row["Previsão de devolução"] = dateFormat(row["Previsão de devolução"])
    row["Data de devolução"] = dateFormat(row["Data de devolução"])
  })

  return rows
}

export default {
  getBookQuantity,
  getTopReaders,
  getReportAllBoks,
  getReportLendingPending,
  getReportLendingReturned
};
