const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const shelljs = require("shelljs");

/**
 * Gets the absolute path of a given directory relative to the current working directory.
 *
 * @param {string} directory - The directory path to be joined with the current working directory.
 * @returns {string} The absolute path of the given directory.
 */
const getAbsolutePath = (directory) => {
  const getPath = (dir) => path.join(process.cwd(), dir);

  if (Array.isArray(directory)) return getPath(path.join(...directory));
  return getPath(directory);
};

/**
 * Replaces the placeholder "{0}" in the given message with the specified content.
 *
 * @param {string} message - The message containing the placeholder "{0}".
 * @param {string} replaceContent - The content to replace the placeholder with.
 * @returns {string} The message with the placeholder replaced by the specified content.
 */
const rem = (message, replaceContent) => message.replace("{0}", replaceContent);

/**
 * Executes a shell command and handles logging and error reporting.
 *
 * @param {string} command - The shell command to execute.
 * @param {Object} taskDetails - Details about the task being executed.
 * @param {Function} done - Callback function to be called when the task is done.
 * @param {boolean} [logOutput=true] - Whether to log the output to the console.
 * @param {boolean} [logOutputInFile=true] - Whether to log the output to a file.
 * @returns {Promise<Object>} - A promise that resolves with the result of the shell command execution.
 * @throws {Error} - Throws an error if the shell command execution fails.
 */
async function execShellCommand(
  command,
  taskDetails,
  done,
  logOutput = true,
  logOutputInFile = true
) {
  return new Promise((resolve, reject) => {
    taskDetails = { functionName: "execShellCommand", ...taskDetails };
    const result = shelljs.exec(command, { silent: !logOutput });
    const { ERROR_FAQ_REFERENCE, FAQ_MD_PATH, MANUAL_DEPLOYMENT_MD_PATH } = require("./config");

    if (result.code !== 0 || result.stdout.includes("Error:")) {
      const errorMessage = removeDuplicateLines(
        result.stderr.trim() || result.stdout.split("Error:")[1]?.trim() || result.stdout.trim()
      );

      const faqSection = Object.keys(ERROR_FAQ_REFERENCE).find((key) => errorMessage.includes(key));
      const faqLink = faqSection
        ? `Checkout FAQ for common issues: ${FAQ_MD_PATH}${ERROR_FAQ_REFERENCE[faqSection]}`
        : "";
      const manualDeploymentLink =
        taskDetails.name === "deploy"
          ? `If unresolved, try manual deployment: ${MANUAL_DEPLOYMENT_MD_PATH}`
          : "";
      const fullMessage = `${errorMessage}\n\nIssue occurred while executing: ${command}\n${faqLink}\n${manualDeploymentLink}`;

      (async () => {
        await logToFile(fullMessage, taskDetails, "ERROR", false);
        reject(fullMessage);
        done(fullMessage);
      })();
    }

    if (result.stderr) {
      (async () => {
        await logToFile(`stderr: ${result.stderr}`, taskDetails, "ERROR", false);
        reject(`stderr: ${result.stderr}`);
      })();
      return;
    }

    (async () => {
      if (logOutputInFile && result.code === 0)
        await logToFile(result.stdout.trim(), taskDetails, "INFO", false);
      resolve({ exitCode: result.code, stdout: result.stdout, stderr: result.stderr });
    })();
  });
}

/**
 * Removes duplicate lines from a string.
 *
 * @param {string} input - The input string from which to remove duplicate lines.
 * @returns {string} - The input string without duplicate lines.
 */
function removeDuplicateLines(input) {
  const lines = input.split("\n").map((line) => line.trim());
  const uniqueLines = [...new Set(lines)];
  return uniqueLines.join("\n");
}

/**
 * Recursively retrieves files and folders from a directory that match a given pattern,
 * with optional exclusions and inclusions.
 *
 * @param {string} directory - The root directory to start the search from.
 * @param {string} pattern - The regex pattern to match files and folders.
 * @param {string[]} [exclusions=[]] - An array of file or folder names to exclude from the search.
 * @param {string[]} [inclusions=[]] - An array of file or folder names to include in the search, overriding exclusions.
 * @returns {string[]} An array of matched file and folder paths.
 */
function getFilesAndFoldersByPattern(directory, pattern, exclusions = [], inclusions = []) {
  const matchedItems = [];
  const inclusionsSet = new Set(inclusions);
  const exclusionsSet = new Set(exclusions);
  const regexPattern = new RegExp(pattern);
  inclusions.forEach((inclusion) => exclusionsSet.delete(inclusion));

  function traverseDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const relativePath = path.relative(directory, filePath);
      const fileNameWithoutExtension = path.parse(file).name;

      if (exclusionsSet.has(fileNameWithoutExtension)) return;

      const stat = fs.statSync(filePath);

      if (
        regexPattern.test(relativePath) &&
        (inclusions.length === 0 || inclusionsSet.has(fileNameWithoutExtension))
      ) {
        matchedItems.push(filePath);
      } else if (
        stat.isDirectory() &&
        !filePath.includes("node_modules") &&
        !path.basename(filePath).startsWith(".")
      ) {
        traverseDirectory(filePath);
      }
    });
  }

  if (fs.existsSync(directory)) traverseDirectory(directory);
  return matchedItems;
}

/**
 * Prompts the user for input and processes the response.
 *
 * @param {string} promptMessage - The message to display to the user.
 * @param {Object} [taskDetails] - Additional details about the task for logging purposes.
 * @param {Function} [isValid=() => true] - A function to validate the user's input. Should return a boolean.
 * @param {Function} [processOutput=(response) => response] - A function to process the user's input before resolving the promise.
 * @returns {Promise<string>} A promise that resolves with the processed user input if valid, or rejects with an error message if invalid.
 */
function getUserInput(
  promptMessage,
  taskDetails,
  isValid = () => true,
  processOutput = (response) => response
) {
  return new Promise((resolve, reject) => {
    taskDetails = { functionName: "getUserInput", ...taskDetails };
    const rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`${promptMessage}: `, async (answer) => {
      const response = answer.trim();

      if (isValid(response)) {
        const processedOutput = processOutput(response);
        rl.close();
        resolve(processedOutput);
      } else {
        await logToFile(`Invalid input. ${promptMessage}.`, taskDetails, "ERROR", false);
        rl.close();
        reject(`Invalid input. ${promptMessage}.`);
      }
    });
  });
}

/**
 * Extracts the tag name from a given regular expression.
 *
 * @param {RegExp} tagRegex - The regular expression to extract the tag name from.
 * @returns {string|null} The extracted tag name, or null if no match is found.
 */
function getTagDataFromRegex(tagPattern, xmlContent = "") {
  const tagPatternStr = tagPattern instanceof RegExp ? tagPattern.source : tagPattern;
  const tagNameMatch = tagPatternStr.match(/<(\w+)\b/);
  const tagName = tagNameMatch ? tagNameMatch[1] : null;

  if (!tagName) return { tagName: null, tagValues: "" };

  const match = new RegExp(tagPatternStr, "g").exec(xmlContent);
  const tagValue = match ? match[1] : "";
  return { tagName, tagValue };
}

/**
 * Updates or removes an XML tag in the specified XML file.
 *
 * @param {string} xmlFilePath - The path to the XML file.
 * @param {RegExp} tagRegex - The regular expression to match the XML tag.
 * @param {string} newValueToUpdate - The new value to update the XML tag with.
 * @param {Object} taskDetails - Additional details about the task.
 * @param {Function} done - Callback function to be called upon completion.
 * @param {boolean} [isReplace=true] - Flag indicating whether to replace the tag value or remove the tag.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
async function updateXmlTag(
  xmlFilePath,
  tagRegex,
  newValueToUpdate,
  taskDetails,
  done,
  isReplace = true
) {
  const { tagName, tagValue } = getTagDataFromRegex(tagRegex, newValueToUpdate);
  taskDetails = { functionName: "updateXmlTag", ...taskDetails };

  try {
    if (!newValueToUpdate && isReplace) {
      const errorMsg = `Value not provided for ${tagName} XML tag in ${taskDetails.name} task to update.`;
      await logError(errorMsg, taskDetails, done);
      return;
    }

    if (!fs.existsSync(xmlFilePath)) {
      const errorMsg = `XML file not found at path: ${xmlFilePath}`;
      await logError(errorMsg, taskDetails, false);
      return;
    }

    const xmlContent = await fsPromises.readFile(xmlFilePath, "utf8");
    const currentValueMatch = xmlContent.match(tagRegex);

    if (isReplace && currentValueMatch && currentValueMatch[1] === newValueToUpdate) {
      const infoMsg = `The value is already up to date: ${tagValue}`;
      await logToFile(infoMsg, taskDetails, "INFO");
      return;
    }

    const updatedXmlContent = xmlContent
      .replace(tagRegex, newValueToUpdate)
      .replace(/\n\s*\n/g, "\n");

    await fsPromises.writeFile(xmlFilePath, updatedXmlContent);
    let updateMessage = "updated";
    if (tagValue) {
      updateMessage += ` to ${tagValue}`;
    }
    const successMsg = `\n${tagName} is ${
      isReplace ? updateMessage : "removed"
    } in solution project.`;
    await logToFile(successMsg, taskDetails, "INFO");
  } catch ({ message }) {
    await logError(message, taskDetails, done);
  }
}

/**
 * Generates a list of admin information from the provided log content.
 *
 * @async
 * @function generateAdminListFromLog
 * @param {string} logContent - The content of the log file.
 * @param {Object} taskDetails - Additional details about the task.
 * @param {Function} done - Callback function to be called when the task is done.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of admin information objects.
 * @throws Will throw an error if there is an issue processing the log content.
 */
async function generateAdminListFromLog(logContent, taskDetails, done) {
  taskDetails = { functionName: "generateAdminListFromLog", ...taskDetails };

  try {
    if (!logContent) return;

    const logEntries = logContent.trim().split("\n").slice(4);
    const adminList = [];

    logEntries.forEach((entry) => {
      const segments = entry.trim().match(/\[.*?\]|\S+/g);
      const lastIndex = segments.length - 1;

      const adminInfo = {
        isActive: entry.includes("*"),
        environmentName: segments.slice(entry.includes("*") ? 1 : 0, lastIndex - 3).join(" "),
        environmentId: segments[lastIndex - 3],
        environmentUrl: segments[lastIndex - 2],
        userType: segments[lastIndex - 1],
        organizationId: segments[lastIndex]
      };

      adminList.push(adminInfo);
    });

    return adminList;
  } catch ({ message }) {
    await logError(message, taskDetails, done);
  }
}

/**
 * Generates an authorization list from the provided log content.
 *
 * @async
 * @function generateAuthListFromLog
 * @param {string} logContent - The content of the log file.
 * @param {Object} taskDetails - Details about the task being performed.
 * @param {Function} done - Callback function to be called when the task is done.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of authorization information objects.
 * @throws Will throw an error if there is an issue processing the log content.
 */
async function generateAuthListFromLog(logContent, taskDetails, done) {
  taskDetails = { functionName: "generateAuthListFromLog", ...taskDetails };

  try {
    if (!logContent) return;

    const logEntries = logContent.trim().split("\n").slice(1);
    const authList = [];

    logEntries.forEach((entry) => {
      if (entry.includes("OperatingSystem")) return;

      const segments = entry.match(/\[.*?\]|\S+/g);
      const isActiveEntry = segments[1] === "*";
      const offset = isActiveEntry ? 0 : 1;

      const authInfo = {
        entryIndex: parseInt(segments[0].replace(/\[|\]/g, ""), 10),
        isActive: isActiveEntry,
        kind: segments[2 - offset],
        user: segments[3 - offset],
        cloud: segments[4 - offset],
        type: segments[5 - offset],
        environmentName: segments.slice(6 - offset, segments.length - 1).join(" "),
        environmentUrl: segments[segments.length - 1]
      };

      authList.push(authInfo);
    });

    return authList;
  } catch ({ message }) {
    await logError(message, taskDetails, done);
  }
}

/**
 * Opens the specified URL in the default web browser for the current platform.
 *
 * @param {string} url - The URL to open.
 * @param {Object} taskDetails - Additional details about the task.
 * @param {Function} done - Callback function to be called when the operation is complete.
 * @returns {Promise<void>} A promise that resolves when the URL is opened or an error occurs.
 *
 * @throws Will throw an error if the URL is invalid or the platform is unsupported.
 */
async function openUrl(url, taskDetails, done) {
  taskDetails = { functionName: "openUrl", ...taskDetails };

  if (!url || typeof url !== "string") {
    await logToFile("Invalid URL", taskDetails, "ERROR", false);
    done("Invalid URL");
  }

  const platformCommands = {
    win32: `start ${url}`,
    darwin: `open ${url}`,
    linux: `xdg-open ${url}`
  };

  const command = platformCommands[require("os").platform()];
  if (!command) {
    await logToFile("Unsupported platform", taskDetails, "ERROR", false);
    done("Unsupported platform");
  }

  try {
    await execShellCommand(command, taskDetails, done, false, false);
    await logToFile(`Opening URL: ${url}`, taskDetails, "INFO");
  } catch ({ message }) {
    await logError(message, taskDetails, done);
  }
}

/**
 * Logs an error message to a file and completes the task with an error message.
 *
 * @param {string} message - The error message to log.
 * @param {Object} taskDetails - The details of the task that failed.
 * @param {Function} done - The callback function to call when done.
 * @returns {Promise<void>} A promise that resolves when the error has been logged and the task is completed.
 */
const logError = async (message, taskDetails, done) => {
  taskDetails = { functionName: "logError", ...taskDetails };
  const errorMessage = `⚠️\u0020 ${taskDetails.name} task failed: ${message}`;
  await logToFile(errorMessage, taskDetails, "ERROR", false);
  done(
    `${errorMessage}\n\nCheckout log file for more details: ${require("./config").LOG_FILE_PATH}`
  );
};

/**
 * Logs a message to a file and optionally prints it to the console.
 *
 * @param {string} message - The message to log.
 * @param {Object} taskDetails - Details of the task.
 * @param {string} taskDetails.name - The name of the task.
 * @param {string} [taskDetails.functionName] - The name of the function (optional).
 * @param {string} [logLevel="INFO"] - The log level (default is "INFO").
 * @param {boolean} [printLog=true] - Whether to print the log to the console (default is true).
 * @returns {Promise<void>} A promise that resolves when the log has been written.
 */
async function logToFile(message, taskDetails, logLevel = "INFO", printLog = true) {
  const { name, functionName } = taskDetails;
  if (printLog) console.log(message);
  if (message) message = message.replace(/\u0020 /g, "\u0020");

  const logFilePath = require("./config").LOG_FILE_PATH;
  const timestamp = new Date().toLocaleString();
  const logMessage = `[${timestamp}] [gulp "${name}"]${
    functionName && logLevel === "ERROR" ? ` [FN: ${functionName}]` : ""
  } [${logLevel}] ${message.trim()}\n`;

  try {
    await fsPromises.appendFile(logFilePath, logMessage, { encoding: "utf8" });
  } catch (err) {
    console.error(`Error writing to log file: ${err.message}`);
  }
}

module.exports = {
  rem,
  openUrl,
  logError,
  logToFile,
  getUserInput,
  updateXmlTag,
  getAbsolutePath,
  execShellCommand,
  generateAuthListFromLog,
  generateAdminListFromLog,
  getFilesAndFoldersByPattern
};
