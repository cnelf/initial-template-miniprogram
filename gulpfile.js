const gulp = require('gulp');
const path = require('path');
const del = require('del');
const jsonfile = require('jsonfile');
const gulpChanged = require('gulp-changed');
const gulpTs = require('gulp-typescript');
const gulpIf = require('gulp-if');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpLess = require('gulp-less');
const gulpSass = require('gulp-sass');
gulpSass.compiler = require('node-sass');
const px2rpx = require('gulp-px2rpx');
const gulpRename = require('gulp-rename');
const gulpCache = require('gulp-cache');
const gulpMpNpm = require('gulp-mp-npm');
const gulpAlias = require('gulp-wechat-weapp-src-alisa');

const resolve = (...args) => path.resolve(__dirname, ...args);

/* config */
const src = 'src';
const dist = 'dist';

const sourcemap = {
  ts: true, // 是否开启 ts sourcemap
  less: true, // 是否开启 less sourcemap
  sass: true // 是否开启 less sourcemap
};
// options
const srcOptions = { base: src };
const watchOptions = { events: ['add', 'change'] };
// https://github.com/mcc108/gulp-mp-npm/issues/8
const mpNpmOptions = { npmDirname: 'miniprogram_npm', fullExtract: ['@vant/weapp/wxs'] };

const aliasConfig = {
  '@': path.join(process.cwd(), 'src')
};

// 文件匹配路径
const globs = {
  ts: `${src}/**/*.ts`, // 匹配 ts 文件
  js: `${src}/**/*.js`, // 匹配 js 文件
  json: `${src}/**/*.json`, // 匹配 json 文件
  less: `${src}/**/*.less`, // 匹配 less 文件
  sass: `${src}/**/*.scss`, // 匹配 sass 文件
  wxss: `${src}/**/*.wxss`, // 匹配 wxss 文件
  wxml: `${src}/**/*.wxml`, // 匹配 wxml 文件
  image: `${src}/**/*.{png,jpg,jpeg,gif,svg}` // 匹配 image 文件
};
globs.copy = [
  `${src}/**`,
  `!${globs.ts}`,
  `!${globs.js}`,
  `!${globs.json}`,
  `!${globs.less}`,
  `!${globs.sass}`,
  `!${globs.wxss}`,
  `!${globs.wxml}`,
  `!${globs.image}`
]; // 匹配需要拷贝的文件

// 包装 gulp.lastRun, 引入文件 ctime 作为文件变动判断另一标准
// https://github.com/gulpjs/vinyl-fs/issues/226
const since = (task) => (file) => gulp.lastRun(task) > file.stat.ctime ? gulp.lastRun(task) : 0;

/** `gulp clear`
 * 清理文件
 * */
const clear = () => del(dist);

/** `gulp clearCache`
 * 清理缓存
 * */
const clearCache = () => gulpCache.clearAll();

/** `gulp copy`
 * 清理
 * */
const copy = () =>
  gulp
    .src(globs.copy, { ...srcOptions, since: since(copy) })
    .pipe(gulpChanged(dist)) // 过滤掉未改变的文件
    .pipe(gulpAlias(aliasConfig))
    .pipe(gulp.dest(dist));

/** `gulp ts`
 * 编译ts
 * */
const tsProject = gulpTs.createProject(resolve('tsconfig.json'));
const ts = () =>
  gulp
    .src(globs.ts, srcOptions)
    .pipe(gulpIf(sourcemap.ts, gulpSourcemaps.init()))
    .pipe(tsProject()) // 编译ts
    .pipe(gulpAlias(aliasConfig))
    .pipe(gulpMpNpm(mpNpmOptions)) // 分析依赖
    .pipe(gulpIf(sourcemap.ts, gulpSourcemaps.write('.')))
    .pipe(gulp.dest(dist));

/** `gulp js`
 * 解析js
 * */
const js = () =>
  gulp
    .src(globs.js, { ...srcOptions, since: since(js) })
    .pipe(gulpAlias(aliasConfig))
    .pipe(gulpMpNpm(mpNpmOptions)) // 分析依赖
    .pipe(gulp.dest(dist));

/** `gulp json`
 * 解析json
 * */
const json = () =>
  gulp
    .src(globs.json, { ...srcOptions, since: since(json) })
    .pipe(gulpMpNpm(mpNpmOptions)) // 分析依赖
    .pipe(gulp.dest(dist));

/** `gulp less`
 * 编译less
 * */
const less = () =>
  gulp
    .src(globs.less, { ...srcOptions, since: since(less) })
    .pipe(gulpIf(sourcemap.less, gulpSourcemaps.init()))
    .pipe(gulpLess()) // 编译less
    .pipe(
      px2rpx({
        screenWidth: 375,
        wxappScreenWidth: 750
      })
    )
    .pipe(gulpRename({ extname: '.wxss' }))
    .pipe(gulpAlias(aliasConfig))
    .pipe(gulpMpNpm(mpNpmOptions)) // 分析依赖
    .pipe(gulpIf(sourcemap.less, gulpSourcemaps.write('.')))
    .pipe(gulp.dest(dist));

/** `gulp sass`
 * 编译sass
 * */
const sass = () =>
  gulp
    .src(globs.sass, { ...srcOptions, since: since(sass) })
    .pipe(gulpIf(sourcemap.sass, gulpSourcemaps.init()))
    .pipe(gulpSass()) // 编译sass
    .pipe(
      px2rpx({
        screenWidth: 375,
        wxappScreenWidth: 750
      })
    )
    .pipe(gulpRename({ extname: '.wxss' }))
    .pipe(gulpAlias(aliasConfig))
    .pipe(gulpMpNpm(mpNpmOptions)) // 分析依赖
    .pipe(gulpIf(sourcemap.sass, gulpSourcemaps.write('.')))
    .pipe(gulp.dest(dist));

/** `gulp wxss`
 * 解析wxss
 * */
const wxss = () =>
  gulp
    .src(globs.wxss, { ...srcOptions, since: since(wxss) })
    .pipe(gulpAlias(aliasConfig))
    .pipe(gulpMpNpm(mpNpmOptions)) // 分析依赖
    .pipe(gulp.dest(dist));

/** `gulp wxml`
 * 解析wxml
 * */
const wxml = () =>
  gulp
    .src(globs.wxml, { ...srcOptions, since: since(wxml) })
    .pipe(
      px2rpx({
        screenWidth: 375,
        wxappScreenWidth: 750
      })
    )
    .pipe(gulpAlias(aliasConfig))
    .pipe(gulp.dest(dist));

/** `gulp image`
 * 处理图片
 * */
const image = () => gulp.src(globs.image, { ...srcOptions, since: since(image) }).pipe(gulp.dest(dist));

// 不清理 dist 的构建
const _build = gulp.parallel(copy, ts, js, json, less, sass, wxss, wxml, image);

// 将 miniprogramRoot 配置修改为 dist 路径
const config = async () => {
  const projectFile = resolve('project.config.json');
  const project = jsonfile.readFileSync(projectFile, { throws: false });
  if (project) {
    project.miniprogramRoot = path.relative(path.dirname(projectFile), dist);
    jsonfile.writeFileSync(resolve('project.config.json'), project, { spaces: 2 });
    project.miniprogramRoot = '/';
    jsonfile.writeFileSync(resolve(dist, 'project.config.json'), project, { spaces: 2 });
  }
};

/** `gulp build`
 * 构建
 * */
const build = gulp.series(
  gulp.parallel(
    clear
    // clearCache
  ),
  _build,
  config
);

/** `gulp watch`
 * 监听
 * */
const watch = () => {
  gulp.watch(globs.copy, watchOptions, copy);
  gulp.watch(globs.ts, watchOptions, ts);
  gulp.watch(globs.js, watchOptions, js);
  gulp.watch(globs.json, watchOptions, json);
  gulp.watch(globs.less, watchOptions, less);
  gulp.watch(globs.sass, watchOptions, sass);
  gulp.watch(globs.wxss, watchOptions, wxss);
  gulp.watch(globs.wxml, watchOptions, wxml);
  gulp.watch(globs.image, watchOptions, image);
};

/** `gulp` or `gulp dev`
 * 构建并监听
 * */
const dev = gulp.series(clear, _build, config, watch);

// `gulp --tasks` list tasks
module.exports = {
  clear,
  clearCache,
  copy,
  ts,
  less,
  sass,
  image,
  build,
  watch,
  dev,
  default: dev
};
