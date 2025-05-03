import express from "express";
import { authenticateJWT, authorizeRole } from "../middleware/auth.js";

import {
  createExamination,
  getMedicalStaffExamHistory,
  updateExaminationById,
  getExaminationById,
  deleteExaminationById,
  getPatientExaminationHistory,
  getExaminationDiagnosisList,
} from "../controller/examination.controller.js";

const router = express.Router();

router.post("/exam/", authorizeRole(["MedicalStaff"]), createExamination);

router.get(
  "/exam/:id",
  authorizeRole(["MedicalStaff", "Admin"]),
  getExaminationById
);

router.put("/exam/:id", authorizeRole(["MedicalStaff"]), updateExaminationById);

router.delete(
  "/exam/:id",
  authorizeRole(["MedicalStaff"]),
  deleteExaminationById
);

// Get all examinations for a specific patient
router.get(
  "/patient/exam/:patientId",
  authorizeRole(["MedicalStaff", "Admin"]),
  getPatientExaminationHistory
);

//doctor gets their exams
router.get(
  "/my-examinations",
  authorizeRole(["MedicalStaff"]),
  getMedicalStaffExamHistory
);

// Get all diagnoses for a specific examination (for medical staff and the patient)
router.get(
  "/examination/diagnosis/:examinationId",
  authorizeRole(["MedicalStaff", "Admin"]),
  getExaminationDiagnosisList
);

// Get all diagnoses for a specific examination (patient can only view their own examinations)
router.get(
  "/examination/:examinationId/diagnoses",
  authenticateJWT,
  authorizeRole(["Patient"]),
  getExaminationDiagnosisList
);

export default router;
