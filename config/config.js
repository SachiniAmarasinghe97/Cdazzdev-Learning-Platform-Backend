require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    storageBucket: process.env.STORAGE_BUCKET,
    email_service: process.env.EMAIL_SERVICE,
    email_user: process.env.EMAIL_USER,
    gmail_app_password: process.env.GMAIL_APP_PASSWORD,
  },
};
