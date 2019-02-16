'use strict'

const gulp = require('gulp')
const consolidate = require('gulp-consolidate')
const underscore = require('underscore')
const plug = require('gulp-load-plugins')()
const iconfont = require('gulp-iconfont')
const fs = require('fs')
let icons = {
    pref: 'gpicon',
    name: 'gpfont',
    src: 'icons/svg/*.svg',
    svg: 'icons/svg/build/*.svg',
    css: 'icons/iconfont.css',
    html: 'icons/index.html',
    dest: 'dist',
    formats: ['woff', 'woff2'],
    json: []
},
icontags = path => {
    let tags = path.basename.match(/(\[)(.+)(\])/),
        name = tags ? path.basename.replace(tags[0], '') : path.basename,
        cats = name.split('-'),
        list = tags ? cats.concat(tags[2].split(',')) : cats

    icons.json.push({
        font: icons.name,
        id: name,
        ctype: 'number',
        tags: list,
        filter: list.join(' '),
        className: [icons.pref, name].join('-')
    })

    path.basename = name
    return path
},
saveJSON = (obj, file, done) => {
    let json = JSON.stringify(obj),
        path = `dist/${file}.json`
    fs.writeFileSync(path, json)
    return done ? done() : 1
}

module.exports = (gulp, plug) => {

    gulp.task('icondel', done => {
        fs.readdir('icons/svg/build', (e, files) => {
            if (!e && files.length)
                files.forEach(file => fs.unlinkSync(`icons/svg/build/${file}`))
            return done()
        })
    })

    gulp.task('icontags', ['icondel'], done => {
        gulp.src(icons.src)
            .pipe(plug.rename(icontags))
            .pipe(gulp.dest('icons/svg/build'))
            .on('end', done)
    })

    gulp.task('iconfont', ['icontags'], done => {
        gulp
            .src(icons.svg)
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
                glyphs.forEach(glyph => {
                    let icon = icons.json.find(i => i.id === glyph.name)
                    icon.code = glyph.unicode[0].charCodeAt(0)
                })

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

                    gulp
                        .src(icons.css)
                        .pipe(
                            consolidate('underscore', {
                                glyphs,
                                fontName: options.fontName,
                                className: options.className,
                                fontDate: new Date().getTime()
                            })
                        )
                        .pipe(gulp.dest(icons.dest))
            })
            .on('end', () => {
                gulp.src(icons.css.replace('Imagens', 'CSS'))
                    .pipe(gulp.dest(icons.dest))
                    .on('end', () => saveJSON(icons.json, 'iconfont', done))
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