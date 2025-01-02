const BaseError = require('../errors/base.errors');
const { CONST } = require('../lib/constants');
const messageModel = require('../model/message.model');
const userModel = require('../model/user.model');
const mailService = require('../service/mail.service');

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
      const userId = '676bbe1c4b9c1aae71d0cdb6';

      const contacts = await userModel.findById(userId).populate('contacts');
      const allContacts = contacts.contacts.map(contact => contact.toObject());

      for (const contact of allContacts) {
        const lastMessage = await messageModel
          .findOne({
            $or: [
              { sender: userId, receiver: contact._id },
              { sender: contact._id, receiver: userId },
            ],
          })
          .populate({ path: 'sender' })
          .populate({ path: 'receiver' })
          .sort({ createdAt: -1 });

        contact.lastMessage = lastMessage;
      }

      return res.status(200).json({ contacts: allContacts });
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

  async createReaction(req, res, next) {
    try {
      const { messageId, reaction } = req.body;
      const updatedMessage = await messageModel.findByIdAndUpdate(
        messageId,
        {
          reaction,
        },
        { new: true }
      );

      res.status(201).json({ updatedMessage });
    } catch (error) {
      next(error);
    }
  }

  async sendOTP(req, res, next) {
    try {
      const { email } = req.body;
      const existingUser = await userModel.findOne({ email });
      if (existingUser)
        throw BaseError.BadRequest('User with this email already exist');

      await mailService.sendOtp(email);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      next(error);
    }
  }

  async readMessage(req, res, next) {
    try {
      const { messages } = req.body;
      const allMessages = [];

      for (const message of messages) {
        const updatedMessage = await messageModel.findByIdAndUpdate(
          message._id,
          { status: CONST.READ },
          { new: true }
        );
        allMessages.push(updatedMessage);
      }

      res.status(200).json({ messages: allMessages });
    } catch (error) {
      next(error);
    }
  }

  // PUT
  async updateMessage(req, res, next) {
    try {
      const { messageId } = req.params;
      const { text } = req.body;

      const updatedMessage = await messageModel.findByIdAndUpdate(
        messageId,
        { text },
        { new: true }
      );

      res.status(200).json({ updatedMessage });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { userId, ...payload } = req.body;
      await userModel.findByIdAndUpdate(userId, payload);
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateEmail(req, res, next) {
    try {
      const { email, otp } = req.body;
      const result = await mailService.verifyOtp(email, otp);
      if (result) {
        const userId = '676bbe1c4b9c1aae71d0cdb6';
        const user = await userModel.findByIdAndUpdate(
          userId,
          { email },
          {
            new: true,
          }
        );
        res.status(200).json({ user });
      }
    } catch (error) {
      next(error);
    }
  }

  // DELETE
  async deleteMessage(req, res, next) {
    try {
      const { messageId } = req.params;
      await messageModel.findByIdAndDelete(messageId);
      res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const userId = '6766edb6da474eba62d6d486';
      await userModel.findByIdAndDelete(userId);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new UserController();
// 5:07
