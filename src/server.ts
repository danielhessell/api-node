import express, { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { logger } from "./logger";

/**
 * SERVER
 */
export const server = express();
server.use(helmet());
server.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute(s)
  max: 100, // limit each IP to 300 request(s) per windowMs
  keyGenerator(request: Request): string {
    return request.ip;
  },
  handler(_, response: Response): void {
    logger.error("Too many request");
    response.status(429).send({ code: 429, message: "Many requests." });
  }
});

server.use(apiLimiter);

server.get("/", async (_, response) => {
  return response.send({ message: "Hello World!" });
});

server.get("/users", async (_, response) => {
  return response.send([
    { id: "1", name: "1", email: "1@1.com" },
    { id: "1", name: "1", email: "1@1.com" },
    { id: "1", name: "1", email: "1@1.com" },
    { id: "1", name: "1", email: "1@1.com" },
    { id: "1", name: "1", email: "1@1.com" },
  ]);
});

