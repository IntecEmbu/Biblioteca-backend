# DROP PROCEDURE IF EXISTS SP_penalty;
# DROP PROCEDURE IF EXISTS SP_recovery_token_check;
# DROP PROCEDURE IF EXISTS SP_create_tempTable_loadBooks;
# DROP PROCEDURE IF EXISTS SP_create_tempTable_reportInventory;

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
			join temp_quantity b on a.book_code = b.FK_book;
	DROP TEMPORARY TABLE temp_books;
	DROP TEMPORARY TABLE temp_quantity;
	*/
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
			join temp_quantity b on a.book_code = b.FK_book;
	DROP TEMPORARY TABLE temp_books;
	DROP TEMPORARY TABLE temp_quantity;
	*/
END $
