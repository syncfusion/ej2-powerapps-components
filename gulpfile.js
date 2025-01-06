const gulp = require("gulp");

require("./gulp-tasks/pcf/clean");
require("./gulp-tasks/pcf/create-pcf");

require("./gulp-tasks/solution/build");
require("./gulp-tasks/solution/deploy");
require("./gulp-tasks/solution/create-solution");

require("./gulp-tasks/update-version");

gulp.task("pack", gulp.series("create-solution", "update-version", "build"));
