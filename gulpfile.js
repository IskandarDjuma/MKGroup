const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require ("gulp-webp");
const del = require("del");
const svgstore = require("gulp-svgstore");
const sync = require("browser-sync").create();


// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(gulp.dest("build/css"))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// HTML

const html = () => {
  return gulp.src("source/**/*.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
}

exports.htmlmin = html;

// Scripts

const scripts = () => {
  return gulp.src("source/js/*.js")
  .pipe(terser())
  .pipe(rename("script.min.js"))
  .pipe(gulp.dest("build/js"))
  .pipe(sync.stream());
}

exports.scripts = scripts;

// Images

const optimizeImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin ( [
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"))
}

exports.images = optimizeImages;

const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(gulp.dest("build/img"))
}
exports.images = copyImages;

// WebP

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// Sprite
const sprite = () => {
  return gulp.src("source/img/icons/*.svg")
  .pipe(svgstore ({
    inLineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

// Copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/*.webmanifest",
    "source/**/*.svg",
    "!source/img/icons/*.svg",
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy

// CLean

const clean = () => {
  return del("build");
};

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/*.js", gulp.series("scripts"));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

// Build

const build = gulp.series (
  clean,
  copy,
  optimizeImages,
  gulp.parallel (
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
);

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.series (
    styles,
    html,
    scripts,
    sprite,
    optimizeImages
  ),
  gulp.series (
    server,
    watcher
  ));
