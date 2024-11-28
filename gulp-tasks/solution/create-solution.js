const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const {
  rem,
  logError,
  logToFile,
  updateXmlTag,
  execShellCommand,
  getFilesAndFoldersByPattern
} = require("../util");
const {
  SOLUTION_XML_PATH,
  CODE_COMPONENTS_PATH,
  SOLUTION_CDS_FILE_PATH,
  PAC_SOLUTION_INIT_COMMAND,
  PAC_SOLUTION_ADD_REFERENCE_COMMAND,
  CREATE_SOLUTION_MESSAGE,
  SOLUTION_DATA
} = require("../config");

let {
  solutionName,
  solutionVersion,
  includeComponents,
  excludeComponents,
  publishManagedSolution
} = SOLUTION_DATA;
const { create_solution, solution_exists, adding_to_solution, folder_path_contains_spaces } =
  CREATE_SOLUTION_MESSAGE;

/**
 * Gulp task to create a solution project in the repository.
 *
 * This task performs the following steps:
 * 1. Runs a validation to check whether pac is installed.
 * 2. Checks if a solution already exists; if not, it initializes a new solution.
 * 3. Retrieves paths for all PCF project files, excluding specified folders.
 * 4. Checks for spaces in the project paths and logs an error if any are found.
 * 5. Adds each PCF project path to the solution.
 * 6. Marks the task as done.
 */
gulp.task("create-solution", async (done) => {
  const taskDetails = { name: "create-solution" };
  const exclusionPatterns = ["common", "Sf", "data", "out", "obj", "generated"];

  try {
    await execShellCommand("pac", taskDetails, done, false, false);

    includeComponents = filterDirectories(includeComponents);
    excludeComponents = filterDirectories(excludeComponents);

    if (!fs.existsSync(solutionName)) {
      await logToFile(create_solution, taskDetails, "INFO");
      await execShellCommand(PAC_SOLUTION_INIT_COMMAND, taskDetails, done);
    } else {
      if (excludeComponents.length > 0 || includeComponents.length > 0) {
        await updateXmlTag(
          SOLUTION_CDS_FILE_PATH,
          /<ProjectReference\b[^>]*\/>/g,
          "",
          taskDetails,
          done,
          false
        );
        await updateXmlTag(
          SOLUTION_CDS_FILE_PATH,
          /<ItemGroup>\s*<\/ItemGroup>|<ItemGroup\s*\/>/g,
          "",
          taskDetails,
          done,
          false
        );
      }
      await logToFile(solution_exists, taskDetails, "INFO");
    }

    await updateXmlTag(
      SOLUTION_XML_PATH,
      /<Version>(.*)<\/Version>/,
      `<Version>${solutionVersion}</Version>`,
      taskDetails,
      done
    );

    const excludedFolders = exclusionPatterns.concat(
      excludeComponents.map((comp) => comp.toLowerCase())
    );
    const includedFolders = includeComponents.map((comp) => comp.toLowerCase());
    const pcfProjectPaths = getFilesAndFoldersByPattern(
      CODE_COMPONENTS_PATH,
      /.pcfproj/i,
      excludedFolders,
      includedFolders
    );

    for (const pcfProjectPath of pcfProjectPaths) {
      if (pcfProjectPath.includes(" ")) {
        const errorMessage = rem(folder_path_contains_spaces, pcfProjectPath);
        await logToFile(errorMessage, taskDetails, "ERROR", false);
        return done(errorMessage);
      }

      await logToFile(rem(adding_to_solution, pcfProjectPath), taskDetails, "INFO");
      await execShellCommand(PAC_SOLUTION_ADD_REFERENCE_COMMAND(pcfProjectPath), taskDetails, done);
    }

    await updateXmlTag(
      SOLUTION_CDS_FILE_PATH,
      /<!--\s*<PropertyGroup>[\s\S]*?<\/PropertyGroup>\s*-->/g,
      (match) => match.replace(/<!--|-->/g, ""),
      taskDetails,
      done
    );
    await updateXmlTag(
      SOLUTION_CDS_FILE_PATH,
      /<SolutionPackageType>Managed<\/SolutionPackageType>/g,
      `<SolutionPackageType>${
        publishManagedSolution ? "Managed" : "Unmanaged"
      }</SolutionPackageType>`,
      taskDetails,
      done
    );

    done();
  } catch ({ message }) {
    await logError(message, taskDetails, done);
  }
});

/**
 * Filters an array of items to include only directories.
 *
 * @param {string[]} array - An array of relative paths.
 * @returns {string[]} An array containing only the directories from the input array.
 */
const filterDirectories = (array) => {
  return array.filter((item) => {
    const fullPath = path.join(CODE_COMPONENTS_PATH, item);
    return fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory();
  });
};
