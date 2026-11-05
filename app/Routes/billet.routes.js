import express from "express";
const router = express.Router();

import {
  GetAllTicket,
  GetOneTicket,
  CreateTicket,
  UpdateTicket,
  DeleteTicket,
} from "../Controllers/BilletController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const initializeTicketRoutes = (app, url) => {
  app.use(url, router);

  router.get("/get_all_ticket", authMiddleware, GetAllTicket);
  router.get("/get_one_ticket/:id", authMiddleware, GetOneTicket);
  router.post("/create_ticket", authMiddleware, CreateTicket);
  router.put("/update_ticket/:id", authMiddleware, UpdateTicket);
  router.delete("/delete_ticket/:id", authMiddleware, DeleteTicket);
};

export default initializeTicketRoutes;
