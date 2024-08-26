const bcrypt = require("bcrypt");

const resetPassword = (password, user) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    user.password = hashedPassword;
    user.opt = null;
    user.otpExpiration = null;
    return user;
}

module.exports = resetPassword;