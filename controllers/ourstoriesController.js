import fs from "fs";
import slugify from "slugify";
import ourstoriesModal from "../models/ourstories.js";


//create product
export const createStoryController = async (req, res) => {
  try {
    const { title, description } = req.fields;
    const { photo } = req.files;
    //Validation
    switch (true) {
      case !title:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Price is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const stories = new ourstoriesModal({ ...req.fields, slug: slugify(title)});
    if (photo) {
      stories.photo.data = fs.readFileSync(photo.path);
      stories.photo.contentType = photo.type;
    }
    await stories.save();
    res.status(201).send({
      success: true,
      message: "stories Created Successfully",
      stories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creatring stories",
    });
  }
};

//get all  Story
export const getStoryController = async (req, res) => {
  try {
    const stories = await ourstoriesModal.find({})
      .select("-photo")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: stories.length,
      message: "All stories",
      stories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting stories",
      error: error.message,
    });
  }
};

// //get single Product
export const singleStoryController = async (req, res) => {
  try {
    const stories = await ourstoriesModal.findOne({ slug: req.params.slug })
      .select("-photo")
    res.status(200).send({
      success: true,
      message: "Single stories Fetched",
      stories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while  getting single stories",
      error: error.message,
    });
  }
};

//Story Photo Controller
export const StoryPhotoController = async (req, res) => {
  try {
    const stories = await ourstoriesModal.findById(req.params.pid).select("photo");
    if (stories.photo.data) {
      res.set("Content-type", stories.photo.contentType);
      return res.status(200).send(stories.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while  getting stories photo",
      error: error.message,
    });
  }
};

//delete Product Controller
export const deleteStoryController = async (req, res) => {
  try {
    await ourstoriesModal.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "stories deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while  deleting",
      error: error.message,
    });
  }
};

//update Product Controller
export const updateStoryController = async (req, res) => {
  try {
    const { title, description  } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !title:
        return res.status(500).send({ error: "Title is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const stories = await ourstoriesModal.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(title) },
      { new: true }
    );
    if (photo) {
      stories.photo.data = fs.readFileSync(photo.path);
      stories.photo.contentType = photo.type;
    }
    await stories.save();
    res.status(201).send({
      success: true,
      message: "stories Updated Successfully",
      stories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update stories",
    });
  }
};
