import express from "express";
const router = express.Router();

import {
  GetAllUser,
  CreateUser,
  LoginUser,
  GetUserById,
  UpdateUser,
  DeleteUser,
} from "../Controllers/UserController.js";

const initializeUserRoutes = (app, url) => {
  app.use(url, router);

  router.get("/get_all_user", GetAllUser);
  router.get("/get_user_by_id/:id", GetUserById);
  router.post("/create_user", CreateUser);
  router.post("/login_user", LoginUser);
  router.put("/update_user/:id", UpdateUser);
  router.delete("/delete_user/:id", DeleteUser);
};

export default initializeUserRoutes;
