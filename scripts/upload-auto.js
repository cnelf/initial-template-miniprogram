const path = require('path');
const ci = require('miniprogram-ci');
const dayjs = require('dayjs');

async function upload() {
  const project = new ci.Project({
    appid: '',
    type: 'miniProgram',
    projectPath: path.resolve(__dirname, '../dist'),
    privateKeyPath: path.resolve(__dirname, './upload.key'),
    ignores: ['node_modules/**/*']
  });
  try {
    await ci.upload({
      project,
      version: dayjs().format('YYMMDDTHH'),
      desc: dayjs().format('YYMMDDTHH'),
      robot: 1,
      setting: {
        es6: true,
        es7: true,
        minify: true,
        autoPrefixWXSS: true
      },
      onProgressUpdate: console.log,
    })
  } catch (err) {
    process.exit(1);
  }
}

upload();
