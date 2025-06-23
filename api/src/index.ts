import 'reflect-metadata';
import dotenv from "dotenv";
import { database } from "./config/db";
import { App } from "./core/app";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await database.connect();

  const app = new App();
  app.listen(PORT);
};

startServer();
