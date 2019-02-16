'use strict'

const gulp = require('gulp')
const consolidate = require('gulp-consolidate')
const plug = require('gulp-load-plugins')()
const iconfont = require('gulp-iconfont')
const icons = {
    pref: 'gpicon',
    name: 'gpfont',
    src: 'icons/svg/*.svg',
    css: 'icons/iconfont.css',
    html: 'icons/index.html',
    dest: 'dist',
    formats: ['woff', 'woff2']
}

module.exports = (gulp, plug) => {
    gulp.task('iconfont', () => {
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
            .on('error', error => {
                console.log(error)
                this.emit('end')
            })
            .on('glyphs', (glyphs, options) => {
                gulp
                    .src(icons.css)
                    .pipe(
                        consolidate('underscore', {
                            glyphs: glyphs,
                            fontName: options.fontName,
                            className: options.className,
                            fontDate: new Date().getTime()
                        })
                    )
                    .on('error', error => {
                        console.log(error)
                        this.emit('end')
                    })
                    .pipe(gulp.dest(icons.dest))

                gulp
                    .src(icons.html)
                    .pipe(
                        consolidate('underscore', {
                            glyphs: glyphs,
                            fontName: options.fontName,
                            className: options.className
                        })
                    )
                    .on('error', error => {
                        console.log(error)
                        this.emit('end')
                    })
                    .pipe(gulp.dest(icons.dest))
            })
            .pipe(gulp.dest(icons.dest))
    })

    // Cache
    gulp.task('icons-cache', () => {
        return gulp
            .src('svg/**/*.svg')
            .pipe(plug.cached('icons-cache'))
    })
}