DROP DATABASE IF EXISTS bd_biblioteca;
CREATE DATABASE bd_biblioteca;
USE bd_biblioteca;

CREATE TABLE tbl_librarian(
	librarian_code INT(10) PRIMARY KEY AUTO_INCREMENT ,
	librarian_name  VARCHAR (45) UNIQUE NOT NULL,
  librarian_login VARCHAR(45) UNIQUE NOT NUll,
	librarian_email VARCHAR(45) UNIQUE NOT NULL,
	librarian_password VARCHAR(30) NOT NULL,
	librarian_type ENUM ('Bibliotecario','Colaborador', 'ADM') NOT NULL,
	librarian_status ENUM ('Ativo', 'Inativo') NOT NULL
);

CREATE TABLE tbl_user(
	user_code INT(10) PRIMARY KEY AUTO_INCREMENT,
	user_name VARCHAR(45) NOT NULL,
	user_type ENUM ('Aluno', 'Funcionario') NOT NULL,
	user_email VARCHAR(45) NOT NULL,
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
    penalty_finish DATE
);

CREATE TABLE tbl_quantity(
	quantity_code INT(10) AUTO_INCREMENT PRIMARY KEY,
	FK_book INT(10) NOT NULL,
  quantity_total int(10),
  quantity_circulation int(10),
  quantity_stopped int(10),
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

# Dados para teste
/*
INSERT INTO tbl_user (user_name,user_type,user_email,user_phone,user_course)
	VALUE ("Josefino", "Aluno", "Josefino@gmail.com", "11 966488326", "AUT")
*/


# VIEWS
/*

# Livros proximos da devolução de 1 dia
SELECT a.lending_code, a.return_prediction, b.user_name, b.user_email, c.book_name
	from tbl_lending a, tbl_user b, tbl_book c
		where return_date IS NULL AND return_prediction <= CURRENT_DATE + INTERVAL 1 DAY AND 
			a.FK_user = b.user_code AND a.FK_book = c.book_code;

*/