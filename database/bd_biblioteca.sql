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

# DROP TABLE IF EXISTS tbl_lending;
# DROP TABLE IF EXISTS tbl_quantity;
# DROP TABLE IF EXISTS tbl_book;
# DROP TABLE IF EXISTS tbl_user;
# DROP TABLE IF EXISTS tbl_librarian;
