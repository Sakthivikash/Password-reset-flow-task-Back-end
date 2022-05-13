import mongoose from "mongoose";
const Schema = mongoose.Schema;

const stringSchema = new Schema({
  OTP: {
    type: String,
    required: true,
  },
});

export default mongoose.model("String", stringSchema);
