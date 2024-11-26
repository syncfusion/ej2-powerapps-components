const fs = require("fs");
const gulp = require("gulp");
const {
  rem,
  logError,
  execShellCommand,
  logToFile,
  getUserInput,
  openUrl,
  generateAdminListFromLog,
  generateAuthListFromLog
} = require("../util");
const {
  ENVIRONMENT,
  SOLUTION_DATA,
  DEPLOY_MESSAGE,
  SOLUTION_ZIP_PATH,
  PAC_ENV_LIST_COMMAND,
  PAC_AUTH_LIST_COMMAND,
  PAC_TOOL_MAKER_COMMAND,
  PAC_ADMIN_LIST_COMMAND,
  PAC_AUTH_CLEAR_COMMAND,
  PAC_AUTH_CREATE_COMMAND,
  PAC_AUTH_SELECT_COMMAND,
  PAC_SOLUTION_LIST_COMMAND,
  PAC_SOLUTION_IMPORT_COMMAND,
  PAC_SOLUTION_DELETE_COMMAND,
  PAC_ENV_UPDATE_CUSTOMCONTROL_COMMAND
} = require("../config");

const {
  auth_found,
  auth_not_found,
  deploying_solution,
  solution_not_found,
  token_expired_error,
  user_input_message,
  solution_already_exists,
  delete_existing_solution,
  solution_already_exists_error,
  token_expired_validation
} = DEPLOY_MESSAGE;
let environmentID;

/**
 * This Gulp task automates the deployment of a PCF project by performing the following actions:
 * - Checks if the solution ZIP file exists.
 * - Executes the `pac` CLI command.
 * - Checks if authentication is required to publish and creates authentication if needed.
 * - Verifies if custom controls are enabled in the environment and updates the environment if necessary.
 * - Validates if the solution exists in PowerApps.
 * - Logs the deployment process and results.
 */
gulp.task("deploy", async (done) => {
  const taskDetails = { name: "deploy" };

  try {
    if (!fs.existsSync(SOLUTION_ZIP_PATH)) {
      await logToFile(solution_not_found, taskDetails, "ERROR", false);
      done(solution_not_found);
    }

    await execShellCommand("pac", taskDetails, done, false, false);

    if (await isAuthRequiredToPublish(taskDetails, done)) {
      await execShellCommand(PAC_AUTH_CREATE_COMMAND, taskDetails, done);
    }

    let isCustomControlEnabled = (
      await execShellCommand(PAC_ENV_LIST_COMMAND, taskDetails, done, false, false)
    ).stdout.includes("iscustomcontrolsincanvasappsenabled               Yes");

    if (!isCustomControlEnabled) {
      await execShellCommand(PAC_ENV_UPDATE_CUSTOMCONTROL_COMMAND(true), taskDetails, done);
    }

    const solutionExist = await validateSolutionExistInPowerApps(taskDetails, done);
    await logToFile(deploying_solution, taskDetails, "INFO");
    await execShellCommand(PAC_SOLUTION_IMPORT_COMMAND(solutionExist), taskDetails, done);

    if (environmentID)
      await openUrl(
        `https://make.powerapps.com/environments/${environmentID}/solutions\n`,
        taskDetails,
        done
      );
    else await execShellCommand(PAC_TOOL_MAKER_COMMAND, taskDetails, done);

    done();
  } catch ({ message }) {
    await logError(message, taskDetails, done);
  }
});

/**
 * Validates if a solution exists in PowerApps and handles user input for deletion if necessary.
 *
 * @param {Object} taskDetails - The details of the task being executed.
 * @param {Function} done - The callback function to be called when the task is done.
 * @returns {Promise<boolean>} - Returns true if the solution exists and matches the publishManagedSolution status, otherwise false.
 * @throws Will throw an error if the validation or deletion process fails.
 */
async function validateSolutionExistInPowerApps(taskDetails, done) {
  taskDetails = { functionName: "validateSolutionExistInPowerApps", ...taskDetails };
  try {
    const { solutionName, publishManagedSolution } = SOLUTION_DATA;
    const solutionListLog = await execShellCommand(
      PAC_SOLUTION_LIST_COMMAND,
      taskDetails,
      done,
      false,
      false
    );

    if (!solutionListLog.stdout.includes(solutionName)) return false;

    const solutionRegex = new RegExp(`${solutionName}\\s+.*\\s+(\\S+)\\s+(True|False)`, "i");
    const match = solutionListLog.stdout.match(solutionRegex);

    if (match && match[2].toLowerCase() === publishManagedSolution.toString().toLowerCase())
      return true;

    await logToFile(
      rem(solution_already_exists, match[2].toLowerCase() === "true" ? "managed" : "unmanaged"),
      taskDetails,
      "INFO"
    );

    const userInput = await getUserInput(
      user_input_message,
      taskDetails,
      (input) => input.startsWith("y") || input.startsWith("n"),
      (output) => output.startsWith("y")
    );

    if (!userInput) await logError(solution_already_exists_error, taskDetails, done);

    await logToFile(delete_existing_solution, taskDetails, "INFO");
    await execShellCommand(PAC_SOLUTION_DELETE_COMMAND, taskDetails, done);

    return false;
  } catch ({ message }) {
    await logError(message, taskDetails, done);
  }
}

/**
 * Determines if authentication is required to publish.
 *
 * This function checks if the authentication token has expired or if there are no valid authentication entries
 * for the specified environment. If authentication is required, it logs the appropriate messages and clears
 * the existing authentication if the token has expired.
 *
 * @param {Object} taskDetails - The details of the task being executed.
 * @param {Function} done - The callback function to be called when the task is complete.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether authentication is required.
 *
 * @throws {Error} - Throws an error if there is an issue executing the shell commands or processing the logs.
 */
async function isAuthRequiredToPublish(taskDetails, done) {
  taskDetails = { functionName: "isAuthRequiredToPublish", ...taskDetails };

  try {
    const adminListLog = await execShellCommand(
      PAC_ADMIN_LIST_COMMAND,
      taskDetails,
      done,
      false,
      false
    );

    if (adminListLog.stdout.includes(token_expired_validation)) {
      await logToFile(token_expired_error, taskDetails, "INFO");
      await execShellCommand(PAC_AUTH_CLEAR_COMMAND, taskDetails, done);
      return true;
    }

    const authListLog = await execShellCommand(
      PAC_AUTH_LIST_COMMAND,
      taskDetails,
      done,
      false,
      false
    );
    const authList = await generateAuthListFromLog(authListLog.stdout, taskDetails, done);

    if (authList.length === 0) {
      await logToFile(auth_not_found, taskDetails, "INFO");
      return true;
    }

    const matchedAuth = authList.find((auth) => auth.environmentName === ENVIRONMENT);

    if (matchedAuth && matchedAuth.entryIndex) {
      await execShellCommand(
        PAC_AUTH_SELECT_COMMAND(matchedAuth.entryIndex),
        taskDetails,
        done,
        false,
        false
      );

      const adminList = await generateAdminListFromLog(adminListLog.stdout, taskDetails, done);
      environmentID = adminList.find((env) => env.environmentName === ENVIRONMENT).environmentId;
      await logToFile(auth_found, taskDetails, "INFO");
      return false;
    }

    await logToFile(auth_not_found, taskDetails, "INFO");
    return true;
  } catch ({ message }) {
    await logError(message, taskDetails, done);
  }
}
