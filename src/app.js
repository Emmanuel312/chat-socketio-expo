import express from "express";
import http from "http";
import io from "socket.io";
import routes from "./routes";
import cors from "cors";

class App {
  constructor() {
    this.init();
    this.middlewares();
    this.routes();
    this.handleIO();
  }

  init() {
    this.app = express();
    this.server = http.Server(this.app);
    this.io = io(this.server);
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      req.io = this.io;
      next();
    });
  }
  routes() {
    this.app.use(routes);
  }

  handleIO() {
    // cliente se conectou
    this.io.on("connection", (socket) => {
      // esperando o evento de entrar na sala
      socket.on("new_user_join_to_room", ({ room_id, username }) => {
        // entrou na sala
        socket.join(`${room_id}`);
        socket.broadcast
          .to(`${room_id}`)
          .emit("warn_everyone_new_user_join_to_room", username);

        // esperando o cliente mandar uma mensagem
        socket.on("new_message", ({ text, username }) => {
          console.log(username);
          // enviando mensagem para todos os clientes daquela sala
          socket.broadcast
            .to(`${room_id}`)
            .emit("warn_everyone_new_message", { text, username });
        });
      });
    });
  }
}

export default new App().server;
