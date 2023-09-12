import Subscriber from "../models/subscriberModel.js";

export const postASubscriber = async (req, res) => {
  try {
    const subscriber = new Subscriber(req.body);
    const result = await subscriber.save();
    res.json({
      res: "success",
      result,
    });
  } catch (error) {
    res.send(error.message);
  }
};

export const deleteASubscriber = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: id };
    const result = await Subscriber.deleteOne(query);
    res.json({
      res: "Success",
      result,
    });
  } catch (error) {
    res.send(error.message);
  }
};
