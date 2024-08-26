const config = require("../../config/config");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const firebaseConfig = require("../../config/firebase-config");

// PostgreSQL configuration
const PG_USER = config.development.username;
const PG_DATABASE = config.development.database;
const PG_PASSWORD = config.development.password;
const BACKUP_DIR = path.join(__dirname, "dbDumps");

const { bucket } = firebaseConfig;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

// Function to perform the backup
exports.performBackup = () => {
  const backupFileName = `${PG_DATABASE}-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}.sql`;
  const backupFilePath = path.join(BACKUP_DIR, backupFileName);

  const pgDumpPath = '"C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe"'; // Path to pg_dump.exe
  const command = `cross-env PGPASSWORD=${PG_PASSWORD} ${pgDumpPath} -U ${PG_USER} -d ${PG_DATABASE} -f "${backupFilePath}"`;

  // Execute the pg_dump command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup failed: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Backup stderr: ${stderr}`);
      return;
    }
    console.log(`Backup successful: ${stdout}`);

    // Upload to Firebase
    const fileUpload = bucket.file(`database-backups/${backupFileName}`);

    fs.createReadStream(backupFilePath)
      .pipe(
        fileUpload.createWriteStream({
          metadata: {
            contentType: "application/sql",
          },
        })
      )
      .on("error", (err) => {
        console.error("Upload error:", err);
      })
      .on("finish", () => {
        console.log(
          `Backup uploaded to Firebase successfully. Public URL: ${fileUpload.publicUrl()}`
        );
      });
  });
};
