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
        return res.status(200).json({ email: existUser.email });
      }

      const newUser = await userModel.create({ email });
      await mailService.sendOtp(newUser.email);
      res.status(200).json({ email: newUser.email });
    } catch (error) {
      next(error);
    }
  }

  async verify(req, res, next) {
    try {
      const { email, otp } = req.body;
      const result = await mailService.verifyOtp(email, otp);

      if (result) {
        const user = await userModel.findOneAndUpdate(
          { email },
          { isVerified: true }
        );
        return res.status(200).json({ user });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
