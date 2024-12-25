const BaseError = require('../errors/base.errors');
const userModel = require('../model/user.model');
const mailService = require('../service/mail.service');

class AuthController {
  async login(req, res, next) {
    try {
      const { email } = req.body;
      const existUser = await userModel.findOne({ email });

      if (existUser) {
        await mailService.sendOtp(existUser.email);
        return res.status(200).json({ message: 'existing_user' });
      }

      const newUser = await userModel.create({ email });
      await mailService.sendOtp(newUser.email);
      res.status(200).json({ message: 'new_user' });
    } catch (error) {
      next(error);
    }
  }

  async verify(req, res, next) {
    const { email, otp } = req.body;

    res.json({ email, otp });
  }
}

module.exports = new AuthController();
