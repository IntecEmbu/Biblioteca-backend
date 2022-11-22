DROP DATABASE IF EXISTS bd_biblioteca;
CREATE DATABASE bd_biblioteca;
USE bd_biblioteca;

CREATE TABLE tbl_librarian(
	librarian_code INT(10) PRIMARY KEY AUTO_INCREMENT ,
	librarian_name  VARCHAR (45) NOT NULL,
  librarian_user VARCHAR(45) UNIQUE NOT NUll,
	librarian_email VARCHAR(45) UNIQUE NOT NULL,
	librarian_password VARCHAR(30) NOT NULL,
	librarian_type ENUM ('Bibliotecario','Colaborador', 'ADM') NOT NULL,
	librarian_status ENUM ('Ativo', 'Inativo') NOT NULL DEFAULT 'Ativo',
	recovery_token VARCHAR(100) DEFAULT NULL,
	recovery_token_expiration DATE DEFAULT NULL
);

CREATE TABLE tbl_user(
	user_code INT(10) PRIMARY KEY AUTO_INCREMENT,
	user_name VARCHAR(45) NOT NULL,
	user_type ENUM ('Aluno', 'Funcionario') NOT NULL,
	user_email VARCHAR(45) NOT NULL,
	user_cpf VARCHAR(20) NOT NULL,
  	user_phone  VARCHAR(20) NOT NULL,	
	user_course VARCHAR(45) NOT NULL
);

CREATE TABLE tbl_book(
	book_code INT(10) PRIMARY KEY AUTO_INCREMENT,
	book_isbn VARCHAR(22) NOT NULL,
	book_cdd VARCHAR(22) NOT NULL,
	book_name VARCHAR(100) NOT NULL,
	book_language VARCHAR(45) NOT NULL,
	category_name VARCHAR(45) NOT NULL,
	release_year YEAR NOT NULL,
	book_author VARCHAR(45) NOT NULL,
	book_edition VARCHAR(45) NOT NULL,
	book_date_register TIMESTAMP,
	book_position VARCHAR(45) NOT NULL,
	book_tombo VARCHAR(45) NOT NULL
);

CREATE TABLE tbl_quantity(
	quantity_code INT(10) AUTO_INCREMENT PRIMARY KEY,
	FK_book INT(10) NOT NULL,
  quantity_total int(10) DEFAULT 1 NOT NULL,
  quantity_circulation int(10) DEFAULT 0 NOT NULL,
  quantity_stopped int(10) DEFAULT 1 NOT NULL,
  CONSTRAINT FK_book_quantity FOREIGN KEY ( FK_book) REFERENCES tbl_book (book_code)
);

CREATE TABLE tbl_lending(
	lending_code INT(10) PRIMARY KEY AUTO_INCREMENT,
	withdraw_date DATE NOT NULL,
  return_prediction DATE NOT NULL,
	return_date DATE,
	warning BOOLEAN NOT NULL DEFAULT false,
	overdue BOOLEAN NOT NULL DEFAULT false,
	penalty FLOAT(10,2) NOT NULL DEFAULT 0.00,
	last_penaly_date DATE,
	FK_user INT(10) NOT NULL,
	FK_librarian INT(10) NOT NULL,
  FK_book INT(10) NOT NULL,
	CONSTRAINT FK_user FOREIGN KEY (FK_user) REFERENCES tbl_user (user_code),
	CONSTRAINT FK_librarian FOREIGN KEY (FK_librarian) REFERENCES tbl_librarian (librarian_code),
  CONSTRAINT FK_book_lending FOREIGN KEY (FK_book) REFERENCES tbl_book (book_code)
);

# Scripts Para deletar todas as tabelas na nuvem
/*
DROP TABLE IF EXISTS tbl_lending;
DROP TABLE IF EXISTS tbl_quantity;
DROP TABLE IF EXISTS tbl_book;
DROP TABLE IF EXISTS tbl_user;
DROP TABLE IF EXISTS tbl_librarian;
*/

# VIEWS

# Livros proximos da devolução de 4 dias
CREATE VIEW VW_lending_CloseToDate_4 AS
SELECT a.lending_code, a.return_prediction, b.user_name, b.user_email, c.book_name
	from tbl_lending a
		inner join tbl_user b on a.FK_user = b.user_code
		inner join tbl_book c on a.FK_book = c.book_code
			where return_date IS NULL AND return_prediction <= CURRENT_DATE + INTERVAL 4 DAY AND warning = false;

# Todos os livros com quantidade
CREATE VIEW VW_all_books AS
SELECT a.book_code, a.book_isbn, a.book_cdd, a.book_name, a.book_language, 
	   	 a.category_name, a.release_year, a.book_author, a.book_edition, 
			 a.book_position, a.book_tombo, b.quantity_total, b.quantity_circulation, 
			 b.quantity_stopped
	from tbl_book a
		inner join tbl_quantity b on a.book_code = b.FK_book
			order by a.book_code desc;

# Todos os emprestimos que estão pendentes
CREATE VIEW VW_lending_pending AS
SELECT a.lending_code, a.withdraw_date, a.return_prediction, b.user_name, 
       b.user_course, b.user_email, b.user_phone, c.book_name, d.librarian_name, 
			 a.overdue, a.penalty
	from tbl_lending a
		inner join tbl_user b on a.FK_user = b.user_code
		inner join tbl_book c on a.FK_book = c.book_code
		inner join tbl_librarian d on a.FK_librarian = d.librarian_code
			where a.return_date IS NULL;

# Quantidade de livros parados e em circulação, quantidade e total
CREATE VIEW VW_quantity AS
SELECT sum(b.quantity_total) as total, sum(b.quantity_circulation) as circulation, 
			 sum(b.quantity_stopped) as stopped
	from tbl_book a
		inner join tbl_quantity b on a.book_code = b.FK_book;		

# Coleta os emprestimos em atraso
CREATE VIEW VW_lending_delay AS
	SELECT * from tbl_lending
		where return_date IS NULL AND return_prediction < (SELECT CURRENT_DATE);

# Coleta os emprestimos em atraso e que não sofreram penalidade no dia
CREATE VIEW VW_lending_delay_penalty AS
	SELECT lending_code from tbl_lending
		where return_date IS NULL AND return_prediction < (SELECT CURRENT_DATE) AND 
			last_penaly_date != (SELECT CURRENT_DATE);

# Coleta os 3 leitores que mais coletaram livros no ultimo mes
CREATE VIEW VW_top_readers AS
	SELECT a.user_name as name, COUNT(a.user_name) as count
		FROM tbl_user a
			inner join tbl_lending b on a.user_code = b.FK_user
				where b.withdraw_date >= (SELECT CURRENT_DATE - INTERVAL 1 MONTH)
					GROUP BY a.user_name
						ORDER BY COUNT(a.user_name) DESC
							LIMIT 3;						

# Relátorio para ver todos os livros registrados
CREATE VIEW VW_report_all_books as
select a.book_name "Título", a.book_author "Autor", a.book_edition "Edição", a.release_year "Ano",
	   a.category_name "Categoria", a.book_position "Posição", a.book_tombo "Tombo", a.book_isbn "ISBN",
       a.book_cdd "CDD", b.quantity_total "Quant. Total", b.quantity_stopped "Quant. Parado",
       b.quantity_circulation "Quant. Circulação"
	from tbl_book a
		inner join tbl_quantity b on a.book_code = b.FK_book
			order by a.book_code desc;

# Relátorio para ver todos os emprestimos que ainda não foram devolvidos
CREATE VIEW VW_report_lending_pending AS
SELECT a.book_name "Título", a.book_tombo "Tombo", a.book_position "Posição", b.user_name "Nome", 
			 b.user_course "Curso", b.user_email "Email", b.user_phone "Telefone", b.user_cpf "CPF", 
			 c.librarian_name "Emprestado por", d.withdraw_date "Data do emprestimo", 
			 d.return_prediction "Previsão de devolução", d.overdue "Dias de atraso", d.penalty "Penalidade"
	from tbl_book a
		join tbl_lending d on a.book_code = d.FK_book
		join tbl_user b on b.user_code = d.FK_user
		join tbl_librarian c on c.librarian_code = d.FK_librarian
			where d.return_date IS NULL
				order by d.withdraw_date desc;

# Relatorio para ver todos os emprestimos que já foram devolvidos
CREATE VIEW VW_report_lending_returned AS
SELECT a.book_name "Título", a.book_tombo "Tombo", a.book_position "Posição", b.user_name "Nome", 
			 b.user_course "Curso", b.user_email "Email", b.user_phone "Telefone", b.user_cpf "CPF", 
			 c.librarian_name "Emprestado por", d.withdraw_date "Data do emprestimo", 
			 d.return_prediction "Previsão de devolução", d.return_date "Data de devolução", 
			 d.overdue "Dias de atraso", d.penalty "Penalidade"
	from tbl_book a
		join tbl_lending d on a.book_code = d.FK_book
		join tbl_user b on b.user_code = d.FK_user
		join tbl_librarian c on c.librarian_code = d.FK_librarian
			where d.return_date IS NOT NULL
				order by d.withdraw_date desc;

# DROP VIEW IF EXISTS VW_lending_CloseToDate_4
# DROP VIEW IF EXISTS VW_all_books;
# DROP VIEW IF EXISTS VW_lending_pending;
# DROP VIEW IF EXISTS VW_quantity;
# DROP VIEW IF EXISTS VW_lending_delay;
# DROP VIEW IF EXISTS VW_top_readers;
# DROP VIEW IF EXISTS VW_report_all_books;
# DROP VIEW IF EXISTS VW_report_lending_pending;
# DROP VIEW IF EXISTS VW_report_lending_returned;

# Procedures 

# Procedure para aplicar multa em emprestimos que ainda não sofreram multa no dia
delimiter $
CREATE PROCEDURE SP_penalty(IN lending_code VARCHAR(11), IN penalty_value FLOAT(10,2))
BEGIN
	-- Calcula o valor da multa multiplicando a quantidade de dias que se passou pelo valor da multa
	-- Exemplo: 10 dias de atraso * 0.50 = 5.00
	UPDATE tbl_lending SET penalty = 
		(SELECT penalty + (DATEDIFF(CURRENT_DATE, return_prediction) * @penalty_value)),
		overdue = true, last_penaly_date = CURRENT_DATE WHERE lending_code = lending_code;
END $

# Procedure para apagar o token de recuperação de senha caso esteja expirado
delimiter $
CREATE PROCEDURE SP_recovery_token_check()
BEGIN
	UPDATE tbl_librarian SET recovery_token = NULL, recovery_token_expiration = NULL 
		WHERE recovery_token_expiration < CURRENT_DATE;
END $

# Pocedure para aumentar a perfomance do carregamento de livros com tabela temporaria
delimiter $
CREATE PROCEDURE SP_create_tempTable_loadBooks()
BEGIN
	-- Cria uma tabela temporaria e clona a tabela de livros com dados
	CREATE TEMPORARY TABLE temp_books SELECT * FROM tbl_book;

	-- Cria uma tabela temporaria e clona a tabela de quantidade com dados
	CREATE TEMPORARY TABLE temp_quantity SELECT * FROM tbl_quantity;

	-- Para realizar a consulta dessa tabela temporaria use o comando:
	/*
	CALL SP_create_tempTable_loadBooks();
	SELECT a.book_code, a.book_isbn, a.book_cdd, a.book_name, a.book_language, a.category_name, 
				 a.release_year, a.book_author, a.book_edition, a.book_position, a.book_tombo, 
				 b.quantity_total, b.quantity_stopped, b.quantity_circulation
		FROM temp_books a
			join temp_quantity b on a.book_code = b.FK_book;
	*/
END $

	
# DROP PROCEDURE IF EXISTS SP_penalty;
# DROP PROCEDURE IF EXISTS SP_recovery_token_check;
# DROP PROCEDURE IF EXISTS SP_create_tempTable_viewReference_loadBooks;