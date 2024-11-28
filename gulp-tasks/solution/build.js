const fs = require("fs");
const gulp = require("gulp");
const { logError, logToFile, execShellCommand } = require("../util");
const { SOLUTION_DATA, BUILD_MESSAGE, DOTNET_BUILD_COMMAND } = require("../config");
const { starting_build, solution_package_location } = BUILD_MESSAGE;

/**
 * Gulp task to build the solution project.
 * - Logs the build process and outputs the build result.
 * - On success, logs the location of the solution package.
 * - On failure, logs the error and provides details in a log file.
 */
gulp.task("build", async (done) => {
  const taskDetails = { name: "build" };
  await logToFile(starting_build, taskDetails, "INFO");

  try {
    await execShellCommand(DOTNET_BUILD_COMMAND(SOLUTION_DATA.solutionName), taskDetails, done);

    await logToFile(solution_package_location, taskDetails, "SUCCESS");

    done();
  } catch ({ message }) {
    await logError(message, taskDetails, done);
  }
});
