import User from "./User.model.js";
import { Schema } from "mongoose";

const patientSchema = new Schema({
  type: { type: String, enum: ["Student", "Staff", "Teacher"] },
  register: { type: String },
  address: { type: String },
  school: { type: String },
  sisiID: { type: String },
  occupation: { type: String },
  education: { type: String },
  birthOfDate: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"] },
});

const Patient = User.discriminator("Patient", patientSchema);

export default Patient;
