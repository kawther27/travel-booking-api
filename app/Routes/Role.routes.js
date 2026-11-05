import express from "express";
const router = express.Router();

import { CreateRole } from "../Controllers/RoleController.js";

const initializeRoleRoutes = (app, url) => {
  app.use(url, router);
  router.post("/create_role", CreateRole);
};

export default initializeRoleRoutes;
