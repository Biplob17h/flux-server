import adminPhotoModel from "../models/adminPhotoModel.js";

//update Product Controller
export const updateAdminPhotoController = async (req, res) => {
    try {
      const { photo } = req.files;
      //Validation
      switch (true) {
        case photo && photo.size > 1000000:
          return res
            .status(500)
            .send({ error: "photo is Required and should be less then 1mb" });
      }
  
      const adminphoto = await adminPhotoModel.findByIdAndUpdate(
        req.params.pid,
        { ...req.fields },
        { new: true }
      );
      if (photo) {
        adminphoto.photo.data = fs.readFileSync(photo.path);
        adminphoto.photo.contentType = photo.type;
      }
      await adminphoto.save();
      res.status(201).send({
        success: true,
        message: "Admin Photo Updated Successfully",
        adminphoto,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in Update product",
      });
    }
  };
  