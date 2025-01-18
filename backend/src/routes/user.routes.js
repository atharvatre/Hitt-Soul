import { Router } from "express";
import {
  postUserQuestion,
  getUserLocation,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/question", postUserQuestion);
router.get("/location/:city", getUserLocation);
export default router;
