const path = require("path"),
  util = require("gulp-util")

function logChanges(e) {
  util.log(
    util.colors.green("File " + e.type + ": ") +
      util.colors.magenta(path.basename(e.path))
  )
}

module.exports = function(gulp) {
  gulp.task("watch", ["cache"], done => {
    //Icon
    gulp
      .watch(["src/assets/icons/svg/**/*.svg"], ["iconfont"])
      .on("change", logChanges)
    return done()
  })
}
