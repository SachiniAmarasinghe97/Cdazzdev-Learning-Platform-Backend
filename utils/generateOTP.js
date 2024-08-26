const crypto = require('crypto');

const generateOTP = (user) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpiration = Date.now() + 3600000; // OTP valid for 1 hour
  return user;
}

module.exports = generateOTP;