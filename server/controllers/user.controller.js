const BaseError = require('../errors/base.errors');
const { CONST } = require('../lib/constants');
const messageModel = require('../model/message.model');
const userModel = require('../model/user.model');

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

  async getContact(req, res, next) {
    try {
      
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

  async createContact(req, res, next) {
    try {
      const { email } = req.body;
      const userId = '676bbe0c4b9c1aae71d0cdb1';

      const user = await userModel.findById(userId);

      const contact = await userModel.findOne({ email });

      if (!contact)
        throw BaseError.BadRequest('User with this email not exist');

      if (user.email === contact.email)
        throw BaseError.BadRequest('You can not add yourself as a contact');

      if (user.contacts.includes(contact._id))
        throw BaseError.BadRequest('Contact already exist');

      user.contacts.push(contact._id);
      contact.contacts.push(userId);

      await user.save();
      await contact.save();

      res.status(201).json({ message: 'Contact added successfully', contact });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new UserController();
// 5:07
