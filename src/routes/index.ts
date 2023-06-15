import express from "express";
import auth from "./auth";
import UserAuthManager from "../middlewares/authentication";
import user from "./user";
import role from "./role";
import logs from "./logs";
import request from "./request";
import CheckDbConnection from "../middlewares/checkDbConnection";

const router = express.Router();
router.use("/api/auth", CheckDbConnection.connect, auth);
router.use("/api/user", CheckDbConnection.connect, UserAuthManager.authenticate, user);
router.use("/api/role", CheckDbConnection.connect, UserAuthManager.authenticate, role);
router.use("/api/logs", CheckDbConnection.connect, UserAuthManager.authenticate, logs);
router.use("/api/request", CheckDbConnection.connect, UserAuthManager.authenticate, request);

export default router;



