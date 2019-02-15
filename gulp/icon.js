"use strict"

let gulp = require("gulp"),
  consolidate = require("gulp-consolidate"),
  plug = require("gulp-load-plugins")(),
  iconfont = require("gulp-iconfont"),
  icons = {
    pref: "gpicon",
    name: "gpfont",
    src: "src/assets/icons/svg/*.svg",
    css: "src/assets/icons/iconfont.css",
    html: "src/assets/icons/index.html",
    dest: "src/assets/font",
    formats: ["woff", "woff2"]
  }
module.exports = function(gulp, plug) {
  gulp.task("iconfont", function() {
    gulp
      .src(icons.src)
      .pipe(
        iconfont({
          fontName: icons.name,
          className: icons.pref,
          formats: icons.formats,
          appendCodepoints: true,
          appendUnicode: false,
          normalize: true,
          fontHeight: 1000,
          centerHorizontally: true
        })
      )
      .on("error", function(error) {
        console.log(error)
        this.emit("end")
      })
      .on("glyphs", function(glyphs, options) {
        gulp
          .src(icons.css)
          .pipe(
            consolidate("underscore", {
              glyphs: glyphs,
              fontName: options.fontName,
              className: options.className,
              fontDate: new Date().getTime()
            })
          )
          .on("error", function(error) {
            console.log(error)
            this.emit("end")
          })
          .pipe(gulp.dest(icons.dest))

        gulp
          .src(icons.html)
          .pipe(
            consolidate("underscore", {
              glyphs: glyphs,
              fontName: options.fontName,
              className: options.className
            })
          )
          .on("error", function(error) {
            console.log(error)
            this.emit("end")
          })
          .pipe(gulp.dest(icons.dest))
      })
      .pipe(gulp.dest(icons.dest))
  })

  // Cache
  gulp.task("icons-cache", () => {
    return gulp
      .src("src/assets/icons/svg/**/*.svg")
      .pipe(plug.cached("icons-cache"))
  })
}
