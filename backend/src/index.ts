import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { sequelize } from "./config/database";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/task";
import { Server } from "ws";
import http from "http";

const app = express();
const PORT = process.env.PORT || 5000;

process.on("uncaughtException", (error) => {
  console.error("Unhandled Exception:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});

app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const server = http.createServer(app);
const wss = new Server({ server });

sequelize.sync({alter:true})
  .then(() => {
    console.log("Tabelas sincronizadas com sucesso.");
    // Inicie o servidor depois de sincronizar
    app.listen(5000, () => {
      console.log("Servidor rodando na porta 5000.");
    });
  })
  .catch((error) => {
    console.error("Erro ao sincronizar as tabelas:", error);
  });
  wss.on("connection", (ws) => {
    console.log("Novo cliente conectado");

    // Quando uma mensagem é recebida
    ws.on("message", (message) => {
        console.log(`Recebido: ${message}`);
        // Envie uma resposta ao cliente
        ws.send(`Você disse: ${message}`);
    });

    // Quando o cliente desconecta
    ws.on("close", () => {
        console.log("Cliente desconectado");
    });
});



  