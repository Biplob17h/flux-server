import User from "../models/userModel.js";
import fs from 'fs'

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


//update user Controller
export const updateUserphotoController = async (req, res) => {
  try {
    // const { photo } = req.files;
    //Validation
    // switch (true) {
    //   case photo && photo.size > 2000000:
    //     return res
    //       .status(500)
    //       .send({ error: "photo is Required and should be less then 2mb" });
    // }
const query={email:req.query.email}
    const userphoto = await User.find(query);
    // if (photo) {
    //   userphoto.photo.data = fs.readFileSync(photo.path);
    //   userphoto.photo.contentType = photo.type;
    // }
    // await userphoto.save();
    // res.status(201).send({
    //   success: true,
    //   message: "Profile Updated Successfully",
    //   userphoto,
    // });
    console.log(userphoto);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update product",
    });
  }
};
