import mongoose from "mongoose";

const subscriberSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    uinque: true
  },
  postalCode: {
    type: Number,
  },
});

const Subscriber = mongoose.model("subscriber", subscriberSchema);

export default Subscriber;
