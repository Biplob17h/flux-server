import fs from "fs";
import slugify from "slugify";
import ourstoryModel from "../models/ourstoryModel.js";



//create story
export const createStoryController = async (req, res) => {
  try {
    const { title, details, subtitle } = req.fields;
    const { photo } = req.files;
    //Validation
    switch (true) {
      case !title:
        return res.status(500).send({ error: "title is Required" });
        case !subtitle:
        return res.status(500).send({ error: "subtitle is Required" });
      case !details:
        return res.status(500).send({ error: "details is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const story = new ourstoryModel({ ...req.fields, slug: slugify(title)});
    if (photo) {
      story.photo.data = fs.readFileSync(photo.path);
      story.photo.contentType = photo.type;
    }
    await story.save();
    res.status(201).send({
      success: true,
      message: "story Created Successfully",
      story,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creatring story",
    });
  }
};


//get all  Story
export const getStoryController = async (req, res) => {
  try {
    const story = await ourstoryModel.find({})
    .select("-photo")
    .sort({createdAt: -1});
    res.status(200).send({
      success: true,
      countTotal : story.length,
      message : "All Story",
      story,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting Story",
      error: error.message,
    });
  }
};


//get single Product
export const singleStoryController = async (req, res) => {
  try {
    const story = await ourstoryModel.findOne({ slug: req.params.slug })
      .select("-photo")
    res.status(200).send({
      success: true,
      message: "Single story Fetched",
      story,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while  getting single story",
      error: error.message,
    });
  }
};

//product Photo Controller
export const storyPhotoController = async (req, res) => {
  try {
    const story = await ourstoryModel.findById(req.params.pid).select("photo");
    if (story.photo.data) {
      res.set("Content-type", story.photo.contentType);
      return res.status(200).send(story.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while  getting story photo",
      error: error.message,
    });
  }
};

//delete Story Controller
export const deleteStoryController = async (req, res) => {
  try {
    await ourstoryModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Story deleted Successfully",
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

//update Story Controller
export const updateStoryController = async (req, res) => {
  try {
    const { title, details, subtitle  } =
      req.fields;
    const { photo } = req.files;
    //Validation
    switch (true) {
      case !title:
        return res.status(500).send({ error: "title is Required" });
        case !subtitle:
        return res.status(500).send({ error: "subtitle is Required" });
      case !details:
        return res.status(500).send({ error: "details is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const story = await ourstoryModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(title) },
      { new: true }
    );
    if (photo) {
      story.photo.data = fs.readFileSync(photo.path);
      story.photo.contentType = photo.type;
    }
    await story.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      story,
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


