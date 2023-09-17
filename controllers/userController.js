import User from "../models/userModel.js";

export const createNewUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const result = await user.save();

    res.json({
      stauts: "success",
      result,
    });
  } catch (error) {
    res.json({
      stauts: "faild",
      message: error.message,
      error,
    });
  }
};
