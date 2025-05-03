import PatientUseCase from "../usecases/Patient.usecase.js";

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
}

export default new PatientController();
