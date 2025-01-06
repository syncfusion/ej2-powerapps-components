const gulp = require("gulp");
const { logError, logToFile, updateFileContent, getFilesAndFoldersByPattern } = require("./util");
const { SOLUTION_DATA, SOLUTION_XML_PATH, UPDATE_VERSION_MESSAGE } = require("./config");
const { starting_update_version, version_update_success } = UPDATE_VERSION_MESSAGE;
const { solutionVersion } = SOLUTION_DATA;

/**
 * Gulp task to update the version in various files.
 *
 * This task performs the following steps:
 * 1. Logs the start of the version update process.
 * 2. Retrieves a list of files matching the specified patterns.
 * 3. Iterates over the list of files and updates the version based on the file type.
 * 4. Logs the success of the version update process.
 * 5. Handles any errors that occur during the process.
 */
gulp.task("update-version", async (done) => {
  const taskDetails = { name: "update-version" };
  const versionRegex = /ControlManifest(\.Input)?\.xml$|.*\.1033\.resx$/;
  const versionPatterns = [
    { pattern: /"version":\s*"\d+\.\d+\.\d+"/, replacement: `"version": "${solutionVersion}"` },
    { pattern: /version="(\d+\.\d+\.\d+)"/, replacement: `version="${solutionVersion}"` },
    { pattern: /\(\d+\.\d+\.\d+\)/, replacement: `(${solutionVersion})` },
    { pattern: /<Version>(.*)<\/Version>/, replacement: `<Version>${solutionVersion}</Version>` }
  ];

  let filePaths = ["package.json", SOLUTION_XML_PATH];

  try {
    await logToFile(starting_update_version, taskDetails, "INFO");
    filePaths = [...filePaths, ...getFilesAndFoldersByPattern("./", versionRegex)];

    for (const filePath of filePaths) {
      let patternIndex = 0;

      if (filePath.endsWith("Solution.xml")) patternIndex = 3;
      else if (filePath.endsWith(".resx")) patternIndex = 2;
      else if (filePath.endsWith(".xml")) patternIndex = 1;

      const { pattern, replacement } = versionPatterns[patternIndex];
      await updateFileContent(filePath, pattern, replacement, taskDetails, done, true);
    }

    await logToFile(version_update_success, taskDetails, "SUCCESS");
    done();
  } catch (error) {
    await logError(error.message, taskDetails, done);
  }
});
