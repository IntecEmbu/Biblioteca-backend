import express from "express";
import db from "../services/UserService.js";
import { body, validationResult } from "express-validator";
import welcomeUser from "../email/welcomeUser.js";

const router = express.Router();

// Endpoint: /user/insert-user (POST)
// Descrição: Cadastra um usuario no banco de dados
router.post(
  "/insert",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("email").not().isEmpty().withMessage("Email is required"),
    body("type").not().isEmpty().withMessage("Type is required"),
    body("phone").not().isEmpty().withMessage("Phone is required"),
    body("course").not().isEmpty().withMessage("Course is required"),
    body("cpf").not().isEmpty().withMessage("CPF is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, email, type, phone, course, cpf } = req.body;

    // Verifica se o tipo de usuario é valido
    if (!(type == "Aluno" || type == "Funcionario")) {
      return res.status(400).json({
        message: "Type must be Aluno or Funcionario",
        type: type,
      });
    }

    try {
      welcomeUser(name.split(" ")[0], email); // Envia email para o usuário (obs: sem await para performance)

      await db.createUser({ name, email, type, phone, course, cpf });
      res.status(200).json({
        message: "User inserted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        DatabaseError: error.message,
      });
    }
  }
);

// Endpoint: /user/get-all (GET)
// Descrição: Coleta todos os usuarios cadastrados
router.get("/all", async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({
      DatabaseError: error.message,
    });
  }
});

// Endpoint: /user/search-user (GET)
// Descrição: Pesquisa usuarios pelo nome
router.get("/search-user", async (req, res) => {
  const { name } = req.query;

  try {
    const users = await db.searchUserByName(name);
    res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({
      DatabaseError: error.message,
    });
  }
});

// Endpoint: /user/update-user (PUT)
// Descrição: Atualiza os dados do usuario
router.put(
  "/update-user",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("email").not().isEmpty().withMessage("Email is required"),
    body("type").not().isEmpty().withMessage("Type is required"),
    body("phone").not().isEmpty().withMessage("Phone is required"),
    body("course").not().isEmpty().withMessage("Course is required"),
    body("id").not().isEmpty().withMessage("Id is required"),
    body("cpf").not().isEmpty().withMessage("CPF is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, email, type, phone, course, id, cpf } = req.body;

    // Verifica se o tipo de usuario é valido
    if (!(type == "Aluno" || type == "Funcionario")) {
      return res.status(400).json({
        message: "Type must be Aluno or Funcionario",
        type: type,
      });
    }

    try {
      await db.updateUser({ name, email, type, phone, course, id, cpf });
      res.status(200).json({
        message: "User updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        DatabaseError: error.message,
      });
    }
  }
);

// Endpoint: /user (DELETE)
// Descrição: Deleta um usuario pelo id
router.delete("/", async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      message: "Id is required",
    });
  }

  try {
    await db.deleteUser(id);
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      DatabaseError: error.message,
    });
  }
});

export default router;
