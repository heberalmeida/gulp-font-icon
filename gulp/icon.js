const system = require('node-notifier'),
    fs = require('fs'),
    icons = {
        pref: 'gpicon',
        name: 'gpfont',
        src: 'icons/svg/*.svg',
        svg: 'icons/svg/build/*.svg',
        css: 'icons/iconfont.css',
        html: 'icons/index.html',
        dest: 'dist',
        formats: ['woff', 'woff2'],
        json: []
    }

function icontags(path) {
    const tags = path.basename.match(/(\[)(.+)(\])/),
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
}

function saveJSON(obj, file, done) {
    const json = JSON.stringify(obj),
        path = `dist/${file}.json`
    fs.writeFile(path, json, done)
}

module.exports = function (gulp, plug) {
    gulp.task('iconfont', ['iconfont'], () => {
        return system.notify({
            title: 'Gulp',
            message: 'Ícones processados com sucesso',
            sound: 'Pop'
        })
    })

    gulp.task('icondel', done => {
        fs.readdir('icons/svg/build', (e, files) => {
            if (!e && files.length)
                files.forEach(file => fs.unlinkSync(`icons/svg/build/${file}`))
            return done()
        })
    })

    gulp.task('icontags', ['icondel'], done => {
        icons.json = []
        gulp.src(icons.src)
            .pipe(plug.rename(icontags))
            .pipe(gulp.dest('icons/svg/build'))
            .on('end', done)
    })

    gulp.task('iconfont', ['icontags'], done => {
        gulp.src(icons.svg)
            .pipe(plug.iconfont({
                fontName: icons.name,
                className: icons.pref,
                formats: icons.formats,
                appendCodepoints: true,
                appendUnicode: false,
                normalize: true,
                fontHeight: 1000,
                centerHorizontally: true
            }))
            .on('glyphs', (glyphs, options) => {
                glyphs.forEach(glyph => {
                    let icon = icons.json.find(i => i.id === glyph.name)
                    icon.code = glyph.unicode[0].charCodeAt(0)
                })

                gulp.src(icons.css)
                    .pipe(plug.consolidate('underscore', {
                        glyphs: glyphs,
                        fontName: options.fontName,
                        className: options.className,
                        fontDate: Date.now()
                    }))
                    .pipe(gulp.dest(icons.dest))

                gulp.src(icons.html)
                    .pipe(plug.consolidate('underscore', {
                        glyphs: glyphs,
                        fontName: options.fontName,
                        className: options.className
                    }))
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
        return gulp.src('icons/svg/*.svg').pipe(plug.cached('icons-cache'))
    })
}