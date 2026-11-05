import express from "express";
const router = express.Router();

import {
  GetAllTravel,
  GetTravelById,
  CreateTravel,
  SearchTravel,
  UpdateTravel,
  DeleteTravel,
} from "../Controllers/VoyageController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const initializeTravelRoutes = (app, url) => {
  app.use(url, router);

  router.get("/get_all_travel", authMiddleware, GetAllTravel);
  router.get("/get_travel_by_id/:id", authMiddleware, GetTravelById);
  router.post("/create_travel", authMiddleware, CreateTravel);
  router.get("/search_travel/:de/:a/:date", authMiddleware, SearchTravel);
  router.put("/update_travel/:id", authMiddleware, UpdateTravel);
  router.delete("/delete_travel/:id", authMiddleware, DeleteTravel);
};

export default initializeTravelRoutes;
