const gulp = require("gulp"),
  plug = require("gulp-load-plugins")()
;(system = require("node-notifier")),
  (tasks = ["cache", "icon", "watch"].map(task => require(`./gulp/${task}`)))

tasks.forEach(task => task(gulp, plug))

gulp.task("default", ["watch"], () => {
  system.notify({
    title: "Gulp",
    message: "Tarefas aguardando por atualizações...",
    sound: "Pop"
  })
})
