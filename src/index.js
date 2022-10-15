import { config } from "dotenv";
import express from "express";
import routes from "./routes.js";
import cors from "cors";

config(); // Carrega as variáveis de ambiente do .env

const api = express();
const port = process.env.PORT || 3333;

api.use(cors());
api.use(express.json());

api.use("/", routes, (req, res) => {
  console.log("teste")
});

api.listen(port, () => {
  console.log(`server is running in ${port}`);
});
