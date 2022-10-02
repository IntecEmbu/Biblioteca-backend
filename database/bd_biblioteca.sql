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
	librarian_status ENUM ('Ativo', 'Inativo') NOT NULL DEFAULT 'Ativo'
);

CREATE TABLE tbl_user(
	user_code INT(10) PRIMARY KEY AUTO_INCREMENT,
	user_name VARCHAR(45) NOT NULL,
	user_type ENUM ('Aluno', 'Funcionario') NOT NULL,
	user_email VARCHAR(45) NOT NULL,
	user_cpf VARCHAR(11) NOT NULL,
  user_phone  VARCHAR(14) NOT NULL,	
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
	book_edition VARCHAR(45) NOT NULL
);

CREATE TABLE tbl_lending(
	lending_code INT(10) PRIMARY KEY AUTO_INCREMENT,
	withdraw_date DATE NOT NULL,
    return_prediction DATE NOT NULL,
	return_date DATE,
	FK_user INT(10) NOT NULL,
	FK_librarian INT(10) NOT NULL,
    FK_book INT(10) NOT NULL,
	CONSTRAINT FK_user FOREIGN KEY (FK_user) REFERENCES tbl_user (user_code),
	CONSTRAINT FK_librarian FOREIGN KEY (FK_librarian) REFERENCES tbl_librarian (librarian_code),
    CONSTRAINT FK_book_lending FOREIGN KEY (FK_book) REFERENCES tbl_book (book_code)
);

CREATE TABLE tbl_penalty(
    FK_user INT(10) NOT NULL,
    FK_book INT(10) NOT NULL,
    FK_librarian INT(10) NOT NULL,
    FK_lending INT (10) NOT NULL,
    PRIMARY KEY(FK_user, FK_book,FK_librarian,FK_lending),
    CONSTRAINT FK_user_penalty FOREIGN KEY ( FK_user) REFERENCES tbl_user (user_code),
    CONSTRAINT FK_book_penalty FOREIGN KEY ( FK_book) REFERENCES tbl_book (book_code),
    CONSTRAINT FK_librarian_penalty FOREIGN KEY ( FK_librarian) REFERENCES tbl_librarian (librarian_code),
    CONSTRAINT FK_lending_penalty FOREIGN KEY ( FK_lending) REFERENCES tbl_lending (lending_code),
    penalty_desc VARCHAR(10) NOT NULL,
    penalty_init DATE NOT NULL,
    penalty_finish DATE,
		penalty_value FLOAT(10,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE tbl_quantity(
	quantity_code INT(10) AUTO_INCREMENT PRIMARY KEY,
	FK_book INT(10) NOT NULL,
  quantity_total int(10) DEFAULT 0 NOT NULL,
  quantity_circulation int(10) DEFAULT 0 NOT NULL,
  quantity_stopped int(10) DEFAULT 0 NOT NULL,
  CONSTRAINT FK_book_quantity FOREIGN KEY ( FK_book) REFERENCES tbl_book (book_code)
);

# Scripts Para deletar todas as tabelas na nuvem
/*
DROP TABLE IF EXISTS tbl_quantity;
DROP TABLE IF EXISTS tbl_penalty;
DROP TABLE IF EXISTS tbl_lending;
DROP TABLE IF EXISTS tbl_book;
DROP TABLE IF EXISTS tbl_user;
DROP TABLE IF EXISTS tbl_librarian;
/*

# VIEWS
/*

# Livros proximos da devolução de 1 dia
CREATE VIEW VW_lending_CloseToDate_4 AS
SELECT a.lending_code, a.return_prediction, b.user_name, b.user_email, c.book_name
	from tbl_lending a, tbl_user b, tbl_book c
		where return_date IS NULL AND return_prediction <= CURRENT_DATE + INTERVAL 4 DAY AND 
			a.FK_user = b.user_code AND a.FK_book = c.book_code;
*/

# Todos os livros com quantidade
CREATE VIEW VW_all_books AS
SELECT a.book_code, a.book_isbn, a.book_cdd, a.book_name, a.book_language, a.category_name, a.release_year, a.book_author, a.book_edition, b.quantity_total, b.quantity_circulation, b.quantity_stopped
	from tbl_book a, tbl_quantity b
		where a.book_code = b.FK_book;

# DROP VIEW IF EXISTS vw_lending;
# DROP VIEW IF EXISTS vw_all_books;