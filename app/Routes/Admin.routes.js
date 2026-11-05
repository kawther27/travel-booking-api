import express from "express";
const router = express.Router();

import {
  GetAllAdmin,
  CreateAdmin,
  LoginAdmin,
  UpdateAdmin,
} from "../Controllers/AdminController.js";

const initializeAdminRoutes = (app, url) => {
  app.use(url, router);

  router.get("/get_all_admin", GetAllAdmin);
  router.post("/create_admin", CreateAdmin);
  router.post("/login_admin", LoginAdmin);
  router.put("/update_admin/:id", UpdateAdmin);
};

export default initializeAdminRoutes;
