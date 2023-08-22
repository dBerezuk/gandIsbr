const { src, dest, watch, parallel, series }  = require('gulp');

const less          = require('gulp-less');
const path          = require('path');
const minifyCSS     = require('gulp-minify-css');
const concat        = require('gulp-concat');
const browserSync   = require('browser-sync').create();
const uglify        = require('gulp-uglify-es').default;
const autoprefixer  = require('gulp-autoprefixer');
const imagemin      = require('gulp-imagemin');
const del           = require('del');
const rename        = require('gulp-rename');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app',
        }
        // proxy: "http://localhost:8888",
        // port: 8888,
        // open: true,
        // notify: false
    });
}

function cleanDist() {
    return del('dist')
}

function images() {
    return src('app/images/**/*')
        .pipe(imagemin(
            [
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [
                        { removeViewBox: true },
                        { cleanupIDs: false }
                    ]
                })
            ]
        ))
        .pipe(dest('dist/images'))
}

function scripts() {
    return src([
        'app/js/main.js'
    ])
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}
function scripts__libs() {
    return src([
        'node_modules/jquery/dist/jquery.js',
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}


function styles() {
    return src('app/less/style.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ],
            outputStyle: 'compressed'
        }))
        .pipe(minifyCSS())
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}
// function styles__libs(){
//     return src([
//         ''
//     ])
//         .pipe(concat('_libs.less'))
//         .pipe(dest('app/less'))
//         .pipe(browserSync.stream())
// }

function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/**/*.min.js',
        'app/js/libs.min.js',
        'app/*.html'
    ], {base: 'app'})
        .pipe(dest('dist'))
}

function watching() {
    watch(['app/less/**/*.less'], styles);
    watch(['app/js/**/*.js', '!app/js/**/*.min.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
// exports.styles__libs = styles__libs;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.scripts__libs = scripts__libs;
exports.images = images;
exports.cleanDist = cleanDist;


exports.build = series(cleanDist, images, build);
exports.default = parallel(styles ,scripts__libs ,scripts ,browsersync, watching);

