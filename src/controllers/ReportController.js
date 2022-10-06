import express from "express";
import ReportService from "../services/ReportService.js";

const router = express.Router();

// ENDPOINT: /api/reports (GET)
// Descrição: Coleta a quantidade de livros parados, circulção e total
router.get("/quantity-book", async (req, res) => {
  try {
    const result = await ReportService.getBookQuantity();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
