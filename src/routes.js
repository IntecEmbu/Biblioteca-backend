import express from "express";
import books from "./controllers/BookController.js";
import librian from "./controllers/LibrarianController.js";
import user from "./controllers/UserController.js";
import lending from "./controllers/LendingController.js";
import report from "./controllers/ReportController.js";
import verifyJWT from "./middlewares/jwt.js";

const router = express.Router();

router.use("/book", books);
router.use("/librian", librian);
router.use("/user", user);
router.use("/lending", lending);
router.use("/report", report);

router.use("*", (req, res) => {
  res.status(404).json({
    message: "Verifique os endpoints",
    url: req.originalUrl,
    method: req.method,
  });
});

export default router;
