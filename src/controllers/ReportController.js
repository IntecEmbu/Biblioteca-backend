import express from "express";
import ReportService from "../services/ReportService.js";

const router = express.Router();

// ENDPOINT: /reports/book-quantity (GET)
// Descrição: Coleta a quantidade de livros parados, circulção e total
router.get("/quantity-book", async (req, res, next) => {
  try {
    const result = await ReportService.getBookQuantity();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  } finally{
    next();
  }
});

// ENDPOINT: /reports/top-readers (GET)
// Descrição: Coleta os 3 leitores que mais coletaram livros no ultimo mes
router.get("/top-readers", async (req, res, next) => {
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
  } finally{
    next();
  }
});

// ENDPOINT: /reports/
// Descrição: Gerencia a geração de relatórios
router.get("/generator/:type", async (req, res, next) => {
  try {
    const {type} = req.params
    const {returned} = req.query

    switch(type){
      case "book":
        const result = await ReportService.getReportAllBoks();
        res.status(200).send(result);
        break
      case "lending":
        if(returned === "true"){
          const result = await ReportService.getReportLendingReturned()
          res.status(200).send(result)
        } else{
          const result = await ReportService.getReportLendingPending()
          res.status(200).send(result)
        }
        break
      default:
        res.status(400).send("Tipo de relatório inválido")
    }
  } catch (error) {
    res.status(500).send(error.message)
  } finally{
    next()
  }
})

export default router;
