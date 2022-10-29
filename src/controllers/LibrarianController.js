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
  async (req, res, next) => {
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
      res.status(500).json({
        DatabaseError: error.message,
      });
    } finally{
      next();
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
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors.array(),
      });
    }

    const { user, password } = req.body;

    try {
      const result = await db.loginCollaborator({ user, password });

      if (result[1]) {
        res.status(200).json({
          message: result[0],
          data: result[1],
        });
      } else {
        res.status(401).json({
          message: result[0],
          data: result[1],
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

// Endpoint: /librarian/get-all-collaborators (GET)
// Descrição: Retorna todos os colaboradores
router.get("/all-collaborators", async (req, res, next) => {
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
    res.status(500).json({
      DatabaseError: error.message,
    });
  } finally{
    next();
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
    body("status").not().isEmpty().withMessage("Status is required"),
    body("type").not().isEmpty().withMessage("Type is required"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { id, name, user, email, type, status } = req.body;

    try {
      db.updateCollaborator({
        id,
        name,
        user,
        email,
        type,
        status,
      });

      res.status(200).json({
        message: "Collaborator updated successfully",
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

// Endpoint: /librarian (DELETE)
// Descrição: Desabilita um colaborador
router.delete("/", async (req, res, next) => {
  const { id } = req.query;

  if(!id){
    return res.status(400).json({
      message: "Id is required"
    });
  }

  try {
    db.desativateCollaborator(id);

    res.status(200).json({
      message: "Collaborator disabled successfully",
    });
  } catch (error) {
    res.status(500).json({
      DatabaseError: error.message,
    });
  } finally{
    next();
  }
});

// Endpoint: /librarian/activate (PUT)
// Descrição: Ativa um colaborador
// irá coletar o id pelo query params
router.put("/activate/:id", async (req, res, next) => {
  const { id } = req.params;

  try{
    await db.activateCollaborator(id);

    res.status(200).json({
      message: "Collaborator activated successfully"
    });
  } catch(error){
    res.status(500).json({
      DatabaseError: error.message
    });
  } finally{
    next();
  }
});

// Endpoint: /librarian/new-password
// Descrição: Envia email para código para alteração de senha
router.post("/new-password", [
  body("email").not().isEmpty().withMessage("Email is required"),
] ,async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try{
    const response = await db.forgotPWD(req.body.email);

    if(response == "Email não encontrado"){
      return res.status(404).json({
        message: response
      });
    }
    else{
      return res.status(200).json({
        message: response
      });
    }
  } catch(error){
    res.status(500).json({
      DatabaseError: error.message
    });
  } finally{
    next();
  }
});

// Endpoint: /librian/verify-code (POST)
// Descrição: Verifica se o código enviado por email é válido
router.post("/verify-code", [
  body("code").not().isEmpty().withMessage("Code is required"),
  body("email").not().isEmpty().withMessage("Email is required")
] ,async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try{
    const response = await db.verifyCode(req.body.code, req.body.email);

    if(response == "Token inválido"){
      return res.status(404).json({
        message: response
      });
    }
    else{
      return res.status(200).json({
        message: response
      });
    }
  } catch(error){
    res.status(500).json({
      DatabaseError: error.message
    });
  } finally{
    next();
  }
});

// Endpoint: /librarian/change-password (POST)
// Descrição: Altera a senha do colaborador
router.post("/change-password", [
  body("code").not().isEmpty().withMessage("Code is required"),
  body("password").not().isEmpty().withMessage("Password is required"),
  body("email").not().isEmpty().withMessage("Email is required")
] ,async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { code, password, email } = req.body;

  try{
    await db.changePWD(email, password, code);
    return res.status(200).json({
      message: "Senha alterada com sucesso"
    });
  } catch(error){
    res.status(500).json({
      DatabaseError: error.message
    });
  } finally{
    next();
  }
});
  
export default router;
