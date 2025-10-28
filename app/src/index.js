import "dotenv/config";
import express from "express";
import pino from "pino";
import { connectDB } from "./database/db.js";
import { startMqtt } from "./database/mqtt.js";
import routes from "./routes.js";

const log = pino({ level: process.env.LOG_LEVEL || "info" });


async function main() {
  
  await connectDB();
  startMqtt();

  const app = express();
  app.use(express.json());
  app.use("/api", routes);

  const port = process.env.API_PORT || 3000;
  app.listen(port, () => {
    log.info(`API listening on port ${port}`);
  });
}

main().catch((err) => {
  log.error(err);
  process.exit(1);
});
