const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const { rem, logError, logToFile, getFilesAndFoldersByPattern } = require("../util");
const { CODE_COMPONENTS_PATH, CLEAN_MESSAGE } = require("../config");

const { no_matching_folders, deleting_folder, deletion_success } = CLEAN_MESSAGE;

/**
 * Gulp task to clean specified files and folders.
 * - Deletes build folders (out, obj, generated) by default.
 * - With "-a": Also deletes node_modules and package-lock.json.
 * - Logs the deletion process and results.
 */
gulp.task("clean", async (done) => {
  const taskDetails = { name: "clean" };
  const patterns = {
    defaultPattern: /(out|obj|generated)/i,
    allPattern: /(out|obj|generated|node_modules|package-lock.json)/i
  };
  const exclusionList = ["docs", "gulp-tasks", "log", "data", "common", "Sf"];

  try {
    const matchedPaths = getFilesAndFoldersByPattern(
      CODE_COMPONENTS_PATH,
      process.argv.includes("-a") ? patterns.allPattern : patterns.defaultPattern,
      exclusionList
    );

    if (matchedPaths.length === 0) {
      await logToFile(no_matching_folders, taskDetails, "SUCCESS");
      return done();
    }

    for (const item of matchedPaths) {
      await fs.promises.rm(item, { recursive: true, force: true });
      await logToFile(
        rem(deleting_folder, path.relative(process.cwd(), item)),
        taskDetails,
        "INFO"
      );
    }

    await logToFile(deletion_success, taskDetails, "SUCCESS");
    return done();
  } catch ({ message }) {
    await logError(message, taskDetails, done);
  }
});
