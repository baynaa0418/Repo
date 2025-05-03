import {
  signUp,
  signIn,
  signUpDoctor,
  signUpNurse,
  signUpAdmin,
} from "../controller/auth.controller.js";
import express from "express";

const router = express.Router();

router.post("/signup/patient", signUp);
router.post("/signin", signIn);
router.post("/signup/doctor", signUpDoctor);
router.post("/signup/nurse", signUpNurse);
router.post("/signup/admin", signUpAdmin);

export default router;
