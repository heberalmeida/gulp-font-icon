const gulp = require('gulp')
const plug = require('gulp-load-plugins')()
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const system = require('node-notifier')
const tasks = ['cache', 'icon', 'watch'].map(task => require(`./gulp/${task}`))

tasks.forEach(task => task(gulp, plug))

gulp.task('default', ['serve', 'watch'], () => {
  system.notify({
    title: 'Gulp',
    message: 'Tarefas aguardando por atualizações...',
    sound: 'Pop'
  })
})

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })
  gulp.watch('dist/*.html').on('change', reload)
})