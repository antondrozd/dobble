import type { Express } from "express";

export const registerHealthController = (app: Express) => {
  app.get("/health", (_req, res) => {
    res.json({ status: "running" });
  });
};
