const path = require("path");
const { solutionData, Environment, componentData } = require("../config.json");
const { solutionName, publisherPrefix, publisherName, publishManagedSolution } = solutionData;
const { componentNameSpace, componentName } = componentData;
const { getAbsolutePath } = require("./util");

// -------------------------------
// PATHS
// -------------------------------

/** Paths to various directories and files. */
exports.LOG_FILE_PATH = getAbsolutePath(["gulp-activity.log"]);
exports.CODE_COMPONENTS_PATH = getAbsolutePath("components");
exports.PCF_COMPONENT_PATH = getAbsolutePath(["components", componentData.sampleLocation]);
exports.SOLUTION_PATH = getAbsolutePath(solutionName);
exports.SOLUTION_BIN_PATH = getAbsolutePath([solutionName, "bin"]);
exports.SOLUTION_XML_PATH = getAbsolutePath([solutionName, "src", "Other", "Solution.xml"]);
/** Path to the solution zip file.
 * - Debug - created when the solution is built using without -c release flag.
 * - release - created when the solution is built using -c release flag.
 */
exports.SOLUTION_ZIP_PATH = getAbsolutePath([
  solutionName,
  "bin",
  publishManagedSolution &&
  require("fs").existsSync(getAbsolutePath([solutionName, "bin", "release"]))
    ? "release"
    : "Debug",
  `${solutionName}.zip`
]);
exports.SOLUTION_CDS_FILE_PATH = getAbsolutePath([solutionName, `${solutionName}.cdsproj`]);
exports.FAQ_MD_PATH = getAbsolutePath(["docs", "common", "faq.md"]);
exports.MANUAL_DEPLOYMENT_MD_PATH = getAbsolutePath([
  "docs",
  "common",
  "deploy-solution-pack-manually.md"
]);

// -------------------------------
// COMMANDS
// -------------------------------

/** Commands for various operations. */
exports.PAC_SOLUTION_INIT_COMMAND = `pac solution init -o ${solutionName} -pp ${publisherPrefix} -pn ${publisherName}`;
exports.PAC_SOLUTION_LIST_COMMAND = `pac solution list`;
exports.PAC_SOLUTION_DELETE_COMMAND = `pac solution delete -sn ${solutionName}`;
exports.PAC_SOLUTION_ADD_REFERENCE_COMMAND = (path) =>
  `cd ${solutionName} && pac solution add-reference ${path ? "--path " + path : ""}`;
exports.DOTNET_BUILD_COMMAND = (projectPath) =>
  `dotnet build ./${path.basename(projectPath)}${publishManagedSolution ? " -c release" : ""}`;
exports.PAC_PCF_INIT_COMMAND = `pac pcf init -o ${exports.PCF_COMPONENT_PATH} -ns ${componentNameSpace} -n ${componentName} --template dataset -fw react`;
exports.PAC_ADMIN_LIST_COMMAND = "pac admin list";
exports.PAC_TOOL_MAKER_COMMAND = `pac tool maker`;
exports.PAC_ENV_LIST_COMMAND = "pac env list-settings";
exports.PAC_ENV_UPDATE_CUSTOMCONTROL_COMMAND = (isEnable) =>
  `pac env update-settings -env "${Environment}"  -n "iscustomcontrolsincanvasappsenabled" -v ${isEnable}`;
exports.PAC_AUTH_CREATE_COMMAND = `pac auth create -env "${Environment}"`;
exports.PAC_AUTH_LIST_COMMAND = "pac auth list";
exports.PAC_AUTH_CLEAR_COMMAND = "pac auth clear";
exports.PAC_AUTH_SELECT_COMMAND = (index) => `pac auth select ${index ? "--index " + index : ""}`;
exports.PAC_SOLUTION_IMPORT_COMMAND = (isSolutionExist) =>
  `pac solution import -cm -f -pc ${isSolutionExist ? "-up" : ""} --path ${
    exports.SOLUTION_ZIP_PATH
  }`;

// -------------------------------
// MESSAGES
// -------------------------------

/** Diagnostics message for user guidance. */
exports.CREATE_SOLUTION_MESSAGE = {
  create_solution: `\n🛠️\u0020 Creating the solution ${solutionName}.`,
  solution_exists: `\n⚠️\u0020 Solution ${solutionName} already exists.`,
  adding_to_solution: `\n➕\u0020 Adding {0} to the solution.`,
  folder_path_contains_spaces: `🚫\u0020 Ensure that the entire folder path of PowerApps repository does not contain spaces.\n Current Path: {0}`
};

exports.CREATE_PCF_MESSAGE = {
  create_control_project: `\n🛠️\u0020 Creating control project with the following config:\nComponentNameSpace: ${componentData.componentNameSpace}\nComponentName: ${componentData.componentName}\nPath: ${exports.PCF_COMPONENT_PATH}`,
  config_values_missing: `\n❌\u0020 Please update the control namespace and name in config.json.\nAlso, ensure that the control project does not already exist at the specified path.`
};

exports.BUILD_MESSAGE = {
  starting_build: "🚀\u0020 Starting the build process...",
  solution_package_location: `📦\u0020 The solution package is located at: ${exports.SOLUTION_ZIP_PATH}`
};

exports.CLEAN_MESSAGE = {
  no_matching_folders: "🧹\u0020 No matching folders or files found.",
  deleting_folder: "🗑️\u0020 Deleting: {0}",
  deletion_success: "✅\u0020 Files and folders deleted successfully."
};

exports.DEPLOY_MESSAGE = {
  user_input_message: `\n🗑️\u0020 Do you want to delete the existing solution "${solutionName}"? (y/n)`,
  token_expired_validation: `The refresh token has expired due to inactivity.`,
  token_expired_error: `\n❌\u0020 The token has expired. Please authenticate again.\n`,
  auth_not_found: `\n❌\u0020 No authentication found. Please authenticate first.\n`,
  auth_found: `\n✅\u0020 Authentication found for the environment "${Environment}".`,
  solution_not_found: `\n⚠️\u0020 Solution zip file not found.\nPath: ${this.SOLUTION_ZIP_PATH}\n`,
  solution_already_exists: `\n⚠️\u0020 Solution already exists in the environment as {0}.\n`,
  solution_already_exists_error: `\n❌\u0020 Solution manifest import: FAILURE: The solution is already installed on this system as an unmanaged solution and the package supplied is attempting to install it in managed mode. Import can only update solutions when the modes match. Uninstall the current solution and try again.\n`,
  deploying_solution: `\n🚀\u0020 Deploying the solution "${solutionName}" to "${Environment}" environment...\n`,
  delete_existing_solution: `\n🗑️\u0020 Deleting existing solution "${solutionName}" from "${Environment}" environment...\n`,
  solution_deployed: `\n✅\u0020 Solution ${solutionName} deployed successfully.`
};

exports.UPDATE_VERSION_MESSAGE = {
  starting_update_version: "🔄\u0020 Updating the version number...",
  version_update_success: "✅\u0020 Version number updated successfully."
}

// -------------------------------
// FAQ REFERENCE
// -------------------------------

/** Error codes for FAQ reference. */
exports.ERROR_FAQ_REFERENCE = {
  "Webresource content size is too big.": ":50",
  "'pac' is not recognized as an internal or external command": ":72"
};

// -------------------------------
// CONFIGURATION DATA
// -------------------------------

/** Solution, component, and environment data. */
exports.ENVIRONMENT = Environment;
exports.SOLUTION_DATA = solutionData;
exports.COMPONENT_DATA = componentData;
