// ...existing code...
import * as PatientUseCase from "../../application/use_cases/patientUseCases.js";
// ...existing code...
class PatientController {
  async getProfile(req, res) {
    try {
      const userId = req.user.id; // Token эсвэл session-аас авч байна гэж үзэв
      const patient = await PatientUseCase.getPatientProfile(userId);
      res.json(patient);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updatedPatient = await PatientUseCase.updatePatientProfile(userId, req.body);
      res.json(updatedPatient);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Бүх үйлчлүүлэгчийн жагсаалт авах public API
  async getAllPatients(req, res) {
    try {
      const patients = await PatientUseCase.getAllPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: "Үйлчлүүлэгчдийн жагсаалт авахад алдаа гарлаа" });
    }
  }
}

export default new PatientController();
