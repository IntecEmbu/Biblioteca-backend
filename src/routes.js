import express from "express";
import books from "./controllers/BookController.js";
import librian from "./controllers/LibrarianController.js";
import user from "./controllers/UserController.js";
import lending from "./controllers/LendingController.js";
import report from "./controllers/ReportController.js";
import tasks from "./tasks/index.js"

const router = express.Router();

router.use("/book", books, tasks);        // ✔️
router.use("/librian", librian, tasks);   // ✔️
router.use("/user", user, tasks);         // ✔️
router.use("/lending", lending, tasks);   // ✔️
router.use("/report", report, tasks);     // ✔️

router.use("*", (req, res) => {
  res.status(404).json({
    message: "Verifique os endpoints",
    url: req.originalUrl,
    method: req.method,
  });
});

export default router;
