const userModel = require('../model/user.model');

class AuthController {
  async login(req, res, next) {
    try {
      const { email } = req.body;
      const createdUser = await userModel.create({ email });
      res.status(201).json(createdUser);
    } catch (error) {
      res
        .status(500)
        .json({
          message:
            error.message || 'An error occurred while creating the user.',
        });
    }
  }

  async verify(req, res, next) {
    const { email, otp } = req.body;

    res.json({ email, otp });
  }
}

module.exports = new AuthController();
