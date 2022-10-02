import express from "express";
import db from "../services/LibrarianService.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Endpoint: /librarian/insert-collaborator (POST)
// Descrição: Cadastra um colaborador no banco de dados
router.post(
  "/insert-collaborator",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("email").not().isEmpty().withMessage("Email is required"),
    body("password").not().isEmpty().withMessage("Password is required"),
    body("user").not().isEmpty().withMessage("User is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, email, user, password } = req.body;

    try {
      await db.createCollaborator({ name, email, user, password });
      res.status(200).json({
        message: "Voluntary inserted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        DatabaseError: error.message,
      });
    }
  }
);

// Endpoint: /librarian/login-collaborator (POST)
// Descrição: Login de um colaborador no sistema
router.post(
  "/login-collaborator",
  [
    body("user").not().isEmpty().withMessage("User is required"),
    body("password").not().isEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { user, password } = req.body;

    try {
      const result = await db.loginCollaborator({ user, password });

      if (result.length > 0) {
        res.status(200).json({
          message: "Login successful",
          data: result,
        });
      } else {
        res.status(401).json({
          message: "Login failed",
        });
      }
    } catch (error) {
      return res.status(500).json({
        DatabaseError: error.message,
      });
    }
  }
);

// Endpoint: /librarian/get-all-collaborators (GET)
// Descrição: Retorna todos os colaboradores
router.get("/all-collaborators", async (req, res) => {
  try {
    const result = await db.getAllCollaborators();

    if (result.length > 0) {
      res.status(200).json({
        data: result,
      });
    } else {
      res.status(204).json({
        message: "Collaborators not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      DatabaseError: error.message,
    });
  }
});

// Endpoint: /librarian/update-collaborator (PUT)
// Descrição: Atualiza os dados de um colaborador
router.put(
  "/update-collaborator",
  [
    body("id").not().isEmpty().withMessage("Id is required"),
    body("name").not().isEmpty().withMessage("Name is required"),
    body("email").not().isEmpty().withMessage("Email is required"),
    body("user").not().isEmpty().withMessage("User is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { id, name, user, email } = req.body;

    try {
      db.updateCollaborator({
        id,
        name,
        user,
        email,
      });

      res.status(200).json({
        message: "Collaborator updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        DatabaseError: error.message,
      });
    }
  }
);

// Endpoint: /librarian (DELETE)
// Descrição: Desabilita um colaborador
router.delete("/", async (req, res) => {
  const { id } = req.query;

  try {
    db.desativateCollaborator(id);

    res.status(200).json({
      message: "Collaborator disabled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      DatabaseError: error.message,
    });
  }
});

export default router;
