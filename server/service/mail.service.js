const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const otpModel = require('../model/otp.model');
const BaseError = require('../errors/base.errors');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendOtp(to) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);

    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    await otpModel.create({
      email: to,
      otp: hashedOtp,
      expireAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Telegram Verification Code`,
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; line-height: 1.6; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #ddd;">
      <div style="text-align: center; padding: 10px 0; border-bottom: 1px solid #ddd;">
        <h1 style="color: #3B82F6; margin: 0;">Telegram Verification</h1>
        <p style="font-size: 14px; color: #555; margin: 5px 0;">Secure your account</p>
      </div>
      <div style="padding: 20px 0; text-align: center;">
        <p style="font-size: 16px; color: #333; margin-bottom: 10px;">Your One-Time Password (OTP) for verification is:</p>
        <p style="font-size: 24px; color: #3B82F6; font-weight: bold; margin: 0;">${otp}</p>
      </div>
      <div style="padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
        <p style="font-size: 12px; color: #999; margin: 0;">This code is valid for 5 minutes.</p>
      </div>
    </div>
  `,
    });
  }

  async verifyOtp(email, otp) {
    const otpData = await otpModel.find({ email });
    if (!otpData) throw BaseError.BadRequest('Otp not found');

    const currentOtp = otpData[otpData.length - 1];
    if (!currentOtp) throw BaseError.BadRequest('Otp not found');

    if (currentOtp.expireAt < new Date()) {
      throw BaseError.BadRequest('Your otp is expired');
    }

    const isValid = await bcrypt.compare(otp.toString(), currentOtp.otp);
    if (!isValid) throw BaseError.BadRequest('Invalid otp entered');

    await otpModel.deleteMany({ email });
    return true;
  }
}

module.exports = new MailService();
