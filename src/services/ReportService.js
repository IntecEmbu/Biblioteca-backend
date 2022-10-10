import db from "../database/connection.js";

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

export default {
  getBookQuantity,
  getTopReaders,
};
