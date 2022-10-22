import express from "express";
import db from "../services/BookService.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Endpoint: /book/insert (POST)
// Descrição: Cadastra um livro no banco de dados
router.post(
  "/insert",
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("edition").not().isEmpty().withMessage("Edition is required"),
    body("isbn").not().isEmpty().withMessage("ISBN is required"),
    body("year").not().isEmpty().withMessage("Year is required"),
    body("category").not().isEmpty().withMessage("Category is required"),
    body("cdd").not().isEmpty().withMessage("CDD is required"),
    body("idiom").not().isEmpty().withMessage("Idiom is required"),
    body("author").not().isEmpty().withMessage("Author is required"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
      });
    }

    const { title, edition, isbn, year, category, cdd, idiom, author } =
      req.body;

    try {
      const result = await db.insertBook({
        title,
        edition,
        isbn,
        year,
        category,
        cdd,
        idiom,
        author,
      });

      if (result) {
        res.status(200).json({
          message: "Book inserted successfully",
        });
      } else {
        res.status(401).json({
          message: "Book already exists",
        });
      }
    } catch (error) {
      res.status(500).json({
        DatabaseError: error.message,
      });
    } finally{
      next();
    }
  }
);

// Endpoint: /book/all (GET)
// Descrição: Retorna todos os livros
router.get("/all", async (req, res, next) => {
  try {
    const results = await db.getAllBooks();

    if (results.length === 0) {
      res.status(204).json({
        message: "No books found",
      });
    } else{
      res.status(200).json({
        books: results,
      });
    }

  } catch (error) {
    res.status(500).json({
      DatabaseError: error.message,
    });
  } finally{
    next();
  }
});

// Endpoint: /book/all-count (GET)
// Decrição: Conta todos os livros
router.get("/all-count", async (req, res, next) => {
  try {
    const results = await db.getCountBooks();

    res.status(200).json({
      count: results[0].total,
    });
  } catch (error) {
    res.status(500).json({
      DatabaseError: error.message,
    });
  } finally{
    next();
  }
});

// Endpoint: /book/search-author (GET)
// Descrição: Busca um livro pelo autor
router.get("/search-author", async (req, res, next) => {
  const { author } = req.query;

  try {
    const results = await db.getBookByAuthor(author);

    if (results.length === 0) {
      res.status(204).json({
        message: "No books found",
      });
    } else{
      res.status(200).json({
        books: results,
      });
    }

  } catch (error) {
    res.status(500).json({
      DatabaseError: error.message,
    });
  } finally{
    next();
  }
});

// Endpoint: /book/search-name (GET)
// Descrição: Busca um livro pelo nome
router.get("/search-name", async (req, res, next) => {
  const { name } = req.query;

  try {
    const results = await db.getBookByName(name);

    if (results.length === 0) {
      res.status(204).json({
        message: "No books found",
      });
    } else{
      res.status(200).json({
        books: results,
      });
    }

  } catch (error) {
    return res.status(500).json({
      DatabaseError: error.message,
    });
  } finally{
    next();
  }
});

// Endpoint: /book/search-category (GET)
// Descrição: Busca um livro pelo categoria
router.get("/search-category", async (req, res, next) => {
  const { category } = req.query;

  try {
    const results = await db.getBookByCategory(category);

    if (results.length === 0) {
      res.status(204).json({
        message: "No books found",
      });
    } else {
      res.status(200).json({
        books: results,
      });
    }

  } catch (error) {
    return res.status(500).json({
      DatabaseError: error.message,
    });
  } finally{
    next();
  }
}); 

// Endpoint: /book/update-book (PUT)
// Descrição: Atualiza um livro
router.put(
  "/update-book",
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("edition").not().isEmpty().withMessage("Edition is required"),
    body("isbn").not().isEmpty().withMessage("ISBN is required"),
    body("release_year")
      .not()
      .isEmpty()
      .withMessage("Release_year is required"),
    body("category").not().isEmpty().withMessage("Category is required"),
    body("cdd").not().isEmpty().withMessage("CDD is required"),
    body("language").not().isEmpty().withMessage("Language is required"),
    body("author").not().isEmpty().withMessage("Author is required"),
    body("id").not().isEmpty().withMessage("ID is required"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
      });
    }

    const {
      title,
      edition,
      isbn,
      release_year,
      category,
      cdd,
      language,
      author,
      id,
    } = req.body;

    try {
      await db.updateBook({
        title,
        edition,
        isbn,
        release_year,
        category,
        cdd,
        language,
        author,
        id,
      });

      res.status(200).json({
        message: "Book updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        DatabaseError: error.message,
      });
    } finally{
      next();
    }
  }
);

// Endpoint: /book (DELETE)
// Descrição: Deleta um livro
router.delete("/", async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      message: "ID is required",
    });
  }

  try {
    await db.deleteBook(id);
    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      DatabaseError: error.message,
    });
  } finally{
    next();
  }
});

// Endpoint: /book/update-quantity (PUT)
// Descrição: Altera a quantidade de um livro
router.put("/update-quantity", [
  body("id").not().isEmpty().withMessage("ID is required"),
  body("qtd_total").not().isEmpty().withMessage("qtd_total is required"),
  body("qtd_stopped").not().isEmpty().withMessage("qtd_stopped is required"),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
    });
  }

  const { id, qtd_total, qtd_stopped } = req.body;

  if(qtd_total < 0 || qtd_stopped < 0){
    return res.status(400).json({
      message: "Qtd must be greater than 0",
    });
  }

  try {
    await db.updateQuantity({id, qtd_total, qtd_stopped});

    res.status(200).json({
      message: "Quantity updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      DatabaseError: error.message,
    });
  } finally{
    next();
  }
});

export default router;
