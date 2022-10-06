import express from "express";
import db from "../services/LendingService.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Endpoint: /insert (POST)
// Descrição: Cadastra um emprestimo no banco de dados
router.post(
  "/insert",
  [
    body("librarian_id")
      .not()
      .isEmpty()
      .withMessage("Librarian id is required"),
    body("book_id").not().isEmpty().withMessage("Book id is required"),
    body("user_cpf").not().isEmpty().withMessage("User CPF is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { librarian_id, book_id, user_cpf } = req.body;

    try {
      const result = await db.createLending({
        librarian_id,
        book_id,
        user_cpf,
      });

      if (result) {
        return res.status(401).json({
          error: result.error,
        });
      }
      console.log(result);

      return res.status(200).json({
        message: "Lending created successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        DatabaseError: error.message,
      });
    }
  }
);

// Endpoint: /return-book (UPDATE)
// Descrição: Devolve um livro
router.post(
  "/return-book",
  [body("lending_id").not().isEmpty().withMessage("Lending id is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { lending_id } = req.body;

    try {
      const result = await db.returnBook(lending_id);

      if (result) {
        return res.status(400).json({
          error: result.error,
        });
      }

      return res.status(200).json({
        message: "Book returned successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        DatabaseError: error.message,
      });
    }
  }
);

// Endpoint: /not-returned (GET)
// Descrição: Lista os emprestimos não devolvidos
router.get("/not-returned", async (req, res) => {
  try {
    const result = await db.getNotReturned();

    if (result.length > 0) {
      return res.status(204).json({
        message: "Not returned found",
        data: result,
      });
    }

    res.status(200).json({
      message: "Not returned list",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      DatabaseError: error.message,
    });
  }
});

// Endpoint: /all (GET)
// Descrição: Lista todos os emprestimos
router.get("/all", async (req, res) => {
  try {
    const result = await db.getAll();

    if (result.length > 0) {
      return res.status(204).json({
        message: "All found",
        data: result,
      });
    }

    res.status(200).json({
      message: "All list",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      DatabaseError: error.message,
    });
  }
});

export default router;
