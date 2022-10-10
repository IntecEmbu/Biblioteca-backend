import express from "express";
import ReportService from "../services/ReportService.js";

const router = express.Router();

// ENDPOINT: /reports/book-quantity (GET)
// Descrição: Coleta a quantidade de livros parados, circulção e total
router.get("/quantity-book", async (req, res) => {
  try {
    const result = await ReportService.getBookQuantity();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ENDPOINT: /reports/top-readers (GET)
// Descrição: Coleta os 3 leitores que mais coletaram livros no ultimo mes
router.get("/top-readers", async (req, res) => {
  try {
    const result = await ReportService.getTopReaders();

    // Formato: "João Silva" => "João S."
    var names = {};
    for (let i = 0; i < 3; i++) {
      if (result[i]) {
        const nameSpt = result[i].name.split(" ");
        names = {
          ...names,
          [i + 1]: `${nameSpt[0]} ${nameSpt[nameSpt.length - 1][0]}.`,
        };
      } else {
        names = {
          ...names,
          [i + 1]: "...",
        };
      }
    }

    res.status(200).send(names);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
