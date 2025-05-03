import mongoose from "mongoose";
const { Schema } = mongoose;

const PrescriptionSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    prescribedBy: {
      type: Schema.Types.ObjectId,
      ref: "MedicalStaff",
      required: true,
    },
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    examination_id: { type: Schema.Types.ObjectId, ref: "Examination" },
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", PrescriptionSchema);
