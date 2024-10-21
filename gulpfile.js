const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const shelljs = require("shelljs");

let environmentID;
const rootFolderName = "components";
const config = require("./config.json");
const solutionConfig = config.solutionData;
const componentConfig = config.componentData;
const links = {
  "solutionPath": path.join(solutionConfig.solutionName, "bin", "Debug", solutionConfig.solutionName + ".zip"),
  "faqPath": path.join("docs", "common", "faq.md"),
  "manualDeploymentPath": path.join("docs", "common", "deploy-solution-pack-manually.md")
};
const errorFAQLink = {
  "Webresource content size is too big.": ":50",
  "'pac' is not recognized as an internal or external command": ":72"
};

gulp.task("pcf:init", pcfInit);

gulp.task("build:init", buildInit);

gulp.task("build", (done) => {
  if (fs.existsSync(solutionConfig.solutionName)) {
    shelljs.cd(solutionConfig.solutionName);
    build(done);
  } else {
    done(
      `Solution "${solutionConfig.solutionName}" does not exist. \n\nPlease run "gulp build:init" first.\n`
    );
  }
});

gulp.task("update-solution-version", updateSolutionVersion);

gulp.task("pack", gulp.series("build:init", updateSolutionVersion, build));

gulp.task("deploy", async (done) => {
  try {
    validatePacCli(done);
    if (await isAuthRequired(done))
      await childProcessExec(`pac auth create -env "${config.Environment}"`, true);

    let isCustomControlEnabled = (await childProcessExec(`pac env list-settings`)).includes( "iscustomcontrolsincanvasappsenabled               Yes" );
    if (!fs.existsSync(links.solutionPath)) {
      return done(`Solution file not found at path: ${links.solutionPath}`);
    }

    if (!isCustomControlEnabled)
      await childProcessExec( `pac env update-settings -env "${config.Environment}" -n "iscustomcontrolsincanvasappsenabled" -v true`, true );

    console.log( `Importing solution "${solutionConfig.solutionName}" to "${config.Environment}" environment.\n` );
    await childProcessExec(`pac solution import --path "${links.solutionPath}"`, true);
    if (environmentID)
      await openUrl(`https://make.powerapps.com/environments/${environmentID}/solutions\n`);
    else await childProcessExec(`pac tool maker`, true);
    done();
  } catch (error) {
    done(error);
  }
});

/**
 * Checks if authentication is required.
 * @param {function} done - The callback function to be called when the operation is complete.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether authentication is required.
 */
async function isAuthRequired(done) {
  try {
    const isAuthRequired = await childProcessExec("pac admin list");
    if (isAuthRequired.includes("The refresh token has expired due to inactivity.")) {
      console.log("\nAuth token expired. Please login again.\n");
      await childProcessExec(`pac auth clear`);
      return true;
    }

    const authList = fetchAuthList(await childProcessExec("pac auth list"));
    if (authList.length === 0) {
      console.log("\nNo auth found. Please login.\n");
      return true;
    }

    const matchedAuth = authList.find((auth) => auth.Environment === config.Environment);

    if (matchedAuth) {
      matchedAuth.Index = parseInt(matchedAuth.Index.replace(/\[|\]/g, ""), 10);
      await childProcessExec(`pac auth select --index ${matchedAuth.Index}`);
      const environment = fetchAdminList(isAuthRequired).find((env) => env.Environment === config.Environment);
      environmentID = environment ? environment.EnvironmentID : "";
      console.log(`\nAuth found for "${config.Environment}" environment.\n`);
      return false;
    }

    console.log(`\nNo auth found for the "${config.Environment}" environment. Please login.\n`);
    return true;
  } catch (error) {
    done(error);
  }
}

/**
 * Fetches the admin list from the provided output.
 * @param {string} output - The command output.
 * @returns {Object[]} The JSON representation of the command output.
 */
function fetchAdminList(output) {
  const lines = output.split("\r\n").filter((line) => line.trim() !== "");
  if (lines.length < 2) return [];

  const dataLines = lines.slice(2);
  const jsonOutput = dataLines
    .map((line) => {
      const values = line.trim().split(/\s+/);
      if (values.length < 6) return null;

      return {
        Active: values[0],
        Environment: values[1],
        EnvironmentID: values[2],
        EnvironmentUrl: values[3],
        Type: values[4],
        OrganizationID: values[5]
      };
    })
    .filter(Boolean);

  return jsonOutput;
}

/**
 * Fetches the authentication list from the provided output.
 * @param {string} output - The output string containing the authentication list.
 * @returns {Object[]} - An array of JSON objects representing the authentication list.
 */
function fetchAuthList(output) {
  if (!output) return;
  const lines = output.split("\r\n");
  const columnNames = [
    "Index",
    "Active",
    "Kind",
    "User",
    "Cloud",
    "Type",
    "Environment",
    "EnvironmentUrl"
  ];
  const dataLines = lines.slice(1, -1);
  const jsonOutput = dataLines
    .map((line) => {
      if (line.includes("OperatingSystem")) return;
      const values = line.split(/\s+/).filter(Boolean);
      return values.reduce((jsonObject, value, index) => {
        if (columnNames[index] === "Active" && !line.includes("*")) {
          jsonObject[columnNames[index]] = null;
        } else if (index > 1 && !line.includes("*")) {
          jsonObject[columnNames[index]] = values[index - 1];
        } else {
          jsonObject[columnNames[index]] = value;
        }
        return jsonObject;
      }, {});
    })
    .filter((jsonObject) => jsonObject && Object.keys(jsonObject).length > 0);
  return jsonOutput;
}

/**
 * Executes a command using child_process.exec and returns a promise.
 *
 * @param {string} command - The command to execute.
 * @param {boolean} [logOutput=false] - Whether to log the output to the console.
 * @returns {Promise<string>} A promise that resolves with the command output if successful, or rejects with an error message.
 */
function childProcessExec(command, logOutput = false) {
  return new Promise((resolve, reject) => {
    require("child_process").exec(command, (error, stdout, stderr) => {
      if (error || stdout.includes("Error:")) {
        const errorMessage = error ? error.message : stdout.split("Error:")[1].trim();
        const faqLink = `Checkout FAQ for common issues: ${links.faqPath}${
          getFAQSectionOfError(errorMessage) || ""
        }`;
        const manualDeploymentLink = `If unresolved, try manual deployment: ${links.manualDeploymentPath}`;
        const fullMessage = `${errorMessage}\n\nIssue occurred while executing: ${command}\n${faqLink}\n${manualDeploymentLink}\n`;

        reject(fullMessage);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }
      if (logOutput) {
        console.log(stdout);
      }
      resolve(stdout);
    });
  });
}

/**
 * Retrieves the FAQ section link related to a specific error message.
 *
 * @param {string} errorMessage - The error message to search for in the FAQ links.
 * @returns {string|undefined} The URL fragment of the FAQ section if a match is found, otherwise undefined.
 */
function getFAQSectionOfError(errorMessage) {
  for (const key in errorFAQLink) {
    if (errorMessage.includes(key)) {
      return errorFAQLink[key];
    }
  }
}

/**
 * Opens a URL in the default web browser.
 * @param {string} url - The URL to open.
 */
async function openUrl(url) {
  if (typeof url !== "string" || !url) {
    console.error("Invalid URL");
    return;
  }

  const commands = {
    win32: `start ${url}`,
    darwin: `open ${url}`,
    linux: `xdg-open ${url}`
  };

  const platform = require("os").platform();
  const command = commands[platform];

  if (!command) {
    console.error("Unsupported OS");
    return;
  }

  try {
    await childProcessExec(command);
    console.log(`Opened ${url} in the default browser.`);
  } catch (error) {
    console.error(`Error opening URL: ${error}`);
  }
}

/**
 * Create the new component project in (componentNameSpace/componentName) location using PCF CLI inside the components folder.
 * Update the config.json with new component namespace and name.
 * @param {*} done - Callback to signal completion
 */
function pcfInit(done) {
  validatePacCli(done);
  const componentPath = `./${rootFolderName}/${componentConfig.sampleLocation}`;
  console.log(
    `\nCreating control project using below config,\nComponentNameSpace: ${componentConfig.componentNameSpace}\nComponentName: ${componentConfig.componentName}\nPath: ${componentPath}\n`
  );
  if (
    componentConfig.componentNameSpace &&
    componentConfig.componentName &&
    !fs.existsSync(componentPath)
  ) {
    shelljs.exec(
      `pac pcf init -o ${componentPath} -ns ${componentConfig.componentNameSpace} -n ${componentConfig.componentName} --template dataset -fw react`,
      (code, _, stderr) => {
        if (code === 0) {
          console.log(`\nControl project created successfully at ${componentPath}.\n`);
          done();
        } else {
          done(`Can't create control project:\n${stderr}`);
        }
      }
    );
  } else {
    done(
      `Please update the new control namespace and name in config.json. \nAlso, check whether provided control project already exist.\n`
    );
  }
}

/**
 * Create the solution in root folder and refer the controls in it.
 * Update the config.json with new solution name, publisher prefix and publisher name.
 * @param {*} done - Callback to signal completion
 */
function buildInit(done) {
  validatePacCli(done);
  const controls = getAllProjFiles(rootFolderName, ".pcfproj");

  if (!fs.existsSync(solutionConfig.solutionName)) {
    console.log(`\nCreating solution "${solutionConfig.solutionName}".\n`);
    const solutionResult = shelljs.exec(
      `pac solution init -o ${solutionConfig.solutionName} -pp ${solutionConfig.publisherPrefix} -pn ${solutionConfig.publisherName}`
    );

    if (solutionResult.code === 0) {
      console.log(`\nSolution "${solutionConfig.solutionName}" created successfully.`);
    } else {
      done(`Can't create solution: ${solutionResult.stderr}.`);
    }
  } else {
    console.log(`\nSolution "${solutionConfig.solutionName}" already exists.\n`);
  }

  shelljs.cd(solutionConfig.solutionName);

  for (const control of controls) {
    if (control.includes(" ")) {
      done(
        `Ensure that the entire folder path of PowerApps repository does not contain spaces.\n Current Path: "${control}".\n`
      );
    }

    console.log(`\nAdding "${control}" to solution.\n`);
    const addReferenceResult = shelljs.exec(`pac solution add-reference -p ${control}`);

    if (addReferenceResult.code !== 0) {
      done(`Can't add control reference to the solution: ${addReferenceResult.stderr}.`);
    }
  }
  done();
}

/**
 * Build the solution to generate the zip file.
 * @param {*} done - Callback to signal completion
 */
function build(done) {
  console.log(`\nBuilding the solution...\n`);
  shelljs.exec("dotnet build", (code, _, stderr) => {
    if (code === 0) {
      console.log(`\nBuild completed successfully at "${links.solutionPath}\n`);
      done();
    } else {
      done(`Can't generate build: ${stderr}`);
    }
  });
}

/**
 * Update the solution package version in the Solution.xml file.
 * @param {Function} done - Callback to signal completion
 */
function updateSolutionVersion(done) {
  try {
    if (!solutionConfig.solutionVersion) {
      return done("Solution version is not provided in the config.json file.");
    }
    
    const solutionXmlPath = path.join(
      !process.cwd().includes(solutionConfig.solutionName) ? solutionConfig.solutionName : "",
      "src",
      "Other",
      "Solution.xml"
    );

    if (!fs.existsSync(solutionXmlPath)) {
      return done(`Solution.xml file not found in the solution path: ${solutionXmlPath}`);
    }

    const solutionXml = fs.readFileSync(solutionXmlPath, "utf8");
    const currentVersionMatch = solutionXml.match(/<Version>(.*)<\/Version>/);

    if (currentVersionMatch && currentVersionMatch[1] === solutionConfig.solutionVersion) {
      console.log(`The solution version is already up to date: ${solutionConfig.solutionVersion}`);
      return done();
    }

    const updatedSolutionXml = solutionXml.replace(
      /<Version>.*<\/Version>/,
      `<Version>${solutionConfig.solutionVersion}</Version>`
    );

    fs.writeFileSync(solutionXmlPath, updatedSolutionXml);
    console.log(`\nSolution version updated to ${solutionConfig.solutionVersion}.\n`);
    done();
  } catch (error) {
    done(`Error updating solution version: ${error.message}`);
  }
}

/**
 * Get all the proj files inside the root folder using the file extension.
 * @param {*} rootFolderName - Root folder name
 * @param {*} fileExtension - File extension to be searched
 * @returns - List of pcfproj files
 */
function getAllProjFiles(rootFolderName, fileExtension) {
  const pcfprojFiles = [];
  function traverseDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    files.forEach((file) => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Check if the directory is in the exclusion list
        if (!solutionConfig.excludeComponentsFolderInSolutionBundle.includes(file)) {
          traverseDirectory(filePath);
        }
      } else if (filePath.endsWith(fileExtension)) {
        pcfprojFiles.push(filePath);
      }
    });
  }
  traverseDirectory(path.resolve(rootFolderName));
  return pcfprojFiles;
}

/**
 * Validates the presence of the Pac CLI by executing the "pac" command.
 * If the command fails, it provides a link to the FAQ for common issues.
 *
 * @param {Function} done - Callback function to be called after validation.
 *                          If validation fails, an error message is passed to this function.
 */
function validatePacCli(done) {
  try {
    const result = shelljs.exec("pac", { silent: true });
    if (result.code !== 0) {
      const faqLink = `Checkout FAQ for common issues: ${links.faqPath}${
        getFAQSectionOfError(result.stderr) || ""
      }`;
      done(`${result.stderr}\n${faqLink}\n`);
    }
  } catch (error) {
    done(error);
  }
}
