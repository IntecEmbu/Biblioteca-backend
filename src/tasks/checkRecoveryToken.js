import db from "../database/connection.js";

// Verifica se o token de recuperação de senha está expirado e apaga caso esteja expirado
export default async function() {
  const conn = await db.connect();

  const sql = "CALL SP_recovery_token_check()";

  await conn.query(sql);

  conn.end();
}