const { CONST } = require('../lib/constants');
const messageModel = require('../model/message.model');

class UserController {
  // [GET]
  async getMessages(req, res, next) {
    try {
      const user = '676bbe1c4b9c1aae71d0cdb6';
      const { contactId } = req.params;

      const messages = await messageModel
        .find({
          $or: [
            { sender: user, receiver: contactId },
            { sender: contactId, receiver: user },
          ],
        })
        .populate({
          path: 'sender',
          select: 'email',
        })
        .populate({
          path: 'receiver',
          select: 'email',
        });

      await messageModel.updateMany(
        { sender: contactId, receiver: user, status: CONST.SENT },
        { status: CONST.READ }
      );

      res.status(200).json({ messages });
    } catch (error) {
      next(error);
    }
  }
  // [POST]
  async createMessage(req, res, next) {
    try {
      const newMessage = await messageModel.create(req.body);
      const currentMessage = await messageModel
        .findById(newMessage._id)
        .populate({
          path: 'sender',
          select: 'email',
        })
        .populate({
          path: 'receiver',
          select: 'email',
        });

      res.status(201).json({ newMessage: currentMessage });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new UserController();
