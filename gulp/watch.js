const path = require('path')
const util = require('gulp-util')


function logChanges(e) {
    util.log(
        util.colors.green('File ' + e.type + ': ') +
        util.colors.magenta(path.basename(e.path))
    )
}

module.exports = gulp => {
    gulp.task('watch', ['cache'], done => {
        //Icon
        gulp.watch(['icons/svg/**/*.svg'], ['iconfont']).on('change', logChanges)
        return done()
    })
}