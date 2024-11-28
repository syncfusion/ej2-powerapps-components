const fs = require("fs");
const gulp = require("gulp");
const { logError, execShellCommand, logToFile } = require("../util");
const {
  PAC_PCF_INIT_COMMAND,
  PCF_COMPONENT_PATH,
  CREATE_PCF_MESSAGE,
  COMPONENT_DATA
} = require("../config");

const { create_control_project, config_values_missing } = CREATE_PCF_MESSAGE;

/**
 * This Gulp task automates the creation of a PCF project by performing the following actions:
 * - Creates a PowerApps solution using the `pac` CLI.
 * - Validates component data and ensures the path does not already exist.
 * - Initializes the PCF component if validations pass, or logs errors if they fail.
 * - Handles and logs any errors that occur during execution.
 */
gulp.task("create-pcf", async (done) => {
  const taskDetails = { name: "create-pcf" };
  const { componentNameSpace, componentName } = COMPONENT_DATA;

  try {
    await execShellCommand("pac", taskDetails, done, false, false);

    if (componentNameSpace && componentName && !fs.existsSync(PCF_COMPONENT_PATH)) {
      await logToFile(create_control_project, taskDetails, "INFO");
      await execShellCommand(PAC_PCF_INIT_COMMAND, taskDetails, done);
    } else {
      await logToFile(config_values_missing, taskDetails, "ERROR", false);
      done();
    }
  } catch (error) {
    await logError(error.message, taskDetails, done);
  }
});
