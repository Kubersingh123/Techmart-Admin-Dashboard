import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

customerSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("Customer", customerSchema);
