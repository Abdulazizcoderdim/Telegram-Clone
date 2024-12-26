const messageModel = require('../model/message.model');

class UserController {
  // [POST] /user/create-message
  async createMessage(req, res, next) {
    try {
      const newMessage = await messageModel.create(req.body);
      const currentMessage = await messageModel
        .findById(newMessage._id)
        .populate('sender')
        .populate('receiver');

      res.status(201).json({ newMessage: currentMessage });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new UserController();
