# DROP PROCEDURE IF EXISTS SP_penalty;
# DROP PROCEDURE IF EXISTS SP_recovery_token_check;
# DROP PROCEDURE IF EXISTS SP_create_tempTable_loadBooks;
# DROP PROCEDURE IF EXISTS SP_drop_tempTable_loadBooks;
# DROP PROCEDURE IF EXISTS SP_create_tempTable_reportInventory;
# DROP PROCEDURE IF EXISTS SP_drop_tempTable_reportInventory;
# DROP PROCEDURE IF EXISTS SP_create_tempTable_reportLendingReturned;
# DROP PROCEDURE IF EXISTS SP_create_tempTable_reportLendingPending;
# DROP PROCEDURE IF EXISTS SP_drop_tempTable_reportLending;

# Aplicar multa em emprestimos que ainda não sofreram multa no dia
delimiter $
CREATE PROCEDURE SP_penalty(IN lending_code VARCHAR(11), IN penalty_value FLOAT(10,2))
BEGIN
	-- Calcula o valor da multa multiplicando a quantidade de dias que se passou pelo valor da multa
	-- Exemplo: 10 dias de atraso * 0.50 = 5.00
	UPDATE tbl_lending SET penalty = 
		(SELECT penalty + (DATEDIFF(CURRENT_DATE, return_prediction) * @penalty_value)),
		overdue = true, last_penaly_date = CURRENT_DATE WHERE lending_code = lending_code;
END $


# Apagar o token de recuperação de senha caso esteja expirado
delimiter $
CREATE PROCEDURE SP_recovery_token_check()
BEGIN
	UPDATE tbl_librarian SET recovery_token = NULL, recovery_token_expiration = NULL 
		WHERE recovery_token_expiration < CURRENT_DATE;
END $


# Perfomance do carregamento de livros com tabela temporaria
delimiter $
CREATE PROCEDURE SP_create_tempTable_loadBooks()
BEGIN
	-- Cria uma tabela temporaria e clona a tabela de livros com dados
	CREATE TEMPORARY TABLE temp_books SELECT * FROM tbl_book;

	-- Cria uma tabela temporaria e clona a tabela de quantidade com dados
	CREATE TEMPORARY TABLE temp_quantity SELECT * FROM tbl_quantity;

	-- Para realizar a consulta dessa tabela temporaria use os comandos:
	/*
	CALL SP_create_tempTable_loadBooks();
	SELECT a.book_code, a.book_isbn, a.book_cdd, a.book_name, a.book_language, a.category_name, 
				 a.release_year, a.book_author, a.book_edition, a.book_position, a.book_tombo, 
				 b.quantity_total, b.quantity_stopped, b.quantity_circulation
		FROM temp_books a
			join temp_quantity b on a.book_code = b.FK_book
				WHERE a.book_status = "Ativo";
	CALL SP_drop_tempTable_loadBooks();
	*/
END $


# Apaga a tabela temporaria de carregamento de livros
delimiter $
CREATE PROCEDURE SP_drop_tempTable_loadBooks()
BEGIN
	DROP TEMPORARY TABLE temp_quantity;
	DROP TEMPORARY TABLE temp_books;
END $


# perfomance da geração de relatóro de iventário com tabela temporaria
delimiter $
CREATE PROCEDURE SP_create_tempTable_reportInventory()
BEGIN
	-- Cria uma tabela temporaria e clona a tabela de livros com dados
	CREATE TEMPORARY TABLE temp_books SELECT * FROM tbl_book;

	-- Cria uma tabela temporaria e clona a tabela de quantidade com dados
	CREATE TEMPORARY TABLE temp_quantity SELECT * FROM tbl_quantity;

	-- Para realizar a consulta dessa tabela temporaria use os comandos:
	/*
	CALL SP_create_tempTable_reportInventory();
	SELECT a.book_code, a.book_isbn, a.book_cdd, a.book_name, a.book_language, a.category_name, 
				 a.release_year, a.book_author, a.book_edition, a.book_position, a.book_tombo, 
				 b.quantity_total, b.quantity_stopped, b.quantity_circulation
		FROM temp_books a
			join temp_quantity b on a.book_code = b.FK_book
				WHERE a.book_status = "Ativo";
	CALL SP_drop_tempTable_reportInventory();
	*/
END $


# Apaga a tabela temporaria de geração de relatóro de iventário
delimiter $
CREATE PROCEDURE SP_drop_tempTable_reportInventory()
BEGIN
	DROP TEMPORARY TABLE temp_quantity;
	DROP TEMPORARY TABLE temp_books;
END $


# Perfomance na geração de relatórios de emprestimos devolvidos com tabela temporaria
delimiter $
CREATE PROCEDURE SP_create_tempTable_reportLendingReturned()
BEGIN
  -- Cria uma tabela temporaria e clona a tabela de livros com dados
  CREATE TEMPORARY TABLE temp_books SELECT * FROM tbl_book;

  -- Cria uma tabela temporaria e clona a tabela de quantidade com dados
  CREATE TEMPORARY TABLE temp_quantity SELECT * FROM tbl_quantity;

  -- Cria uma tabela temporaria e clona a tabela de emprestimos com dados
  CREATE TEMPORARY TABLE temp_lending SELECT * FROM tbl_lending;

  -- Cria uma tabela temporaria e clona a tabela de bibliotecario com dados
  CREATE TEMPORARY TABLE temp_librarian SELECT * FROM tbl_librarian;

  -- Cria uma tabela temporaria e clona a tabela de usuario com dados
  CREATE TEMPORARY TABLE temp_user SELECT * FROM tbl_user;

  -- Para realizar a consulta dessa tabela temporaria use os comandos:
  /*
  CALL SP_create_tempTable_reportLendingReturned();
  SELECT a.book_name "Título", a.book_tombo "Tombo", a.book_position "Posição", b.user_name "Nome", 
			 b.user_course "Curso", b.user_email "Email", b.user_phone "Telefone", b.user_cpf "CPF", 
			 c.librarian_name "Emprestado por", d.withdraw_date "Data do emprestimo", 
			 d.return_prediction "Previsão de devolução", d.return_date "Data de devolução", 
			 d.overdue "Dias de atraso", d.penalty "Penalidade"
	from temp_books a
    join temp_user b on a.book_code = b.FK_book
    join temp_lending d on b.user_code = d.FK_user
    join temp_librarian c on d.FK_librarian = c.librarian_code
			where d.return_date IS NOT NULL
				order by d.withdraw_date desc;
	CALL SP_drop_tempTable_reportLending();
  */
END $


# Perfomance na geração de relatórios de emprestimos pendentes com tabela temporaria
delimiter $
CREATE PROCEDURE SP_create_tempTable_reportLendingPending()
BEGIN
  -- Cria uma tabela temporaria e clona a tabela de livros com dados
  CREATE TEMPORARY TABLE temp_books SELECT * FROM tbl_book;

  -- Cria uma tabela temporaria e clona a tabela de quantidade com dados
  CREATE TEMPORARY TABLE temp_quantity SELECT * FROM tbl_quantity;

  -- Cria uma tabela temporaria e clona a tabela de emprestimos com dados
  CREATE TEMPORARY TABLE temp_lending SELECT * FROM tbl_lending;

  -- Cria uma tabela temporaria e clona a tabela de bibliotecario com dados
  CREATE TEMPORARY TABLE temp_librarian SELECT * FROM tbl_librarian;

  -- Cria uma tabela temporaria e clona a tabela de usuario com dados
  CREATE TEMPORARY TABLE temp_user SELECT * FROM tbl_user;

  -- Para realizar a consulta dessa tabela temporaria use os comandos:
  /*
  CALL SP_create_tempTable_reportLendingPending();
  SELECT a.book_name "Título", a.book_tombo "Tombo", a.book_position "Posição", b.user_name "Nome", 
			 b.user_course "Curso", b.user_email "Email", b.user_phone "Telefone", b.user_cpf "CPF", 
			 c.librarian_name "Emprestado por", d.withdraw_date "Data do emprestimo", 
			 d.return_prediction "Previsão de devolução", d.overdue "Dias de atraso", d.penalty "Penalidade"
	from temp_books a
    join temp_user b on a.book_code = b.FK_book
    join temp_lending d on b.user_code = d.FK_user
    join temp_librarian c on d.FK_librarian = c.librarian_code
      where d.return_date IS NULL
				order by d.withdraw_date desc;
	CALL SP_drop_tempTable_reportLending();
  */
END $


# Apaga a tabela temporaria de geração de relatórios de emprestimos
delimiter $
CREATE PROCEDURE SP_drop_tempTable_reportLending()
BEGIN
	DROP TEMPORARY TABLE temp_lending;
  DROP TEMPORARY TABLE temp_quantity;
  DROP TEMPORARY TABLE temp_books;
  DROP TEMPORARY TABLE temp_user;
  DROP TEMPORARY TABLE temp_librarian;
END $


# Aplica a multa pelo id do emprestimo
delimiter $
CREATE PROCEDURE SP_lending_penalty(IN lending_id INT)
BEGIN
	UPDATE tbl_lending SET penalty = (SELECT DATEDIFF(CURDATE() - INTERVAL 1 DAY, return_prediction) * 1),
	last_penaly_date = NOW() WHERE lending_code = lending_id;
END $