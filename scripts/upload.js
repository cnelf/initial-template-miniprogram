const inquirer = require('inquirer');
const ora = require('ora');
const path = require('path');
const chalk = require('chalk');
const ci = require('miniprogram-ci');
const dayjs = require('dayjs');

const questions = [
  {
    type: 'input',
    name: 'version',
    message: '版本号',
    default: dayjs().format('YYMMDDTHH')
  },
  {
    type: 'input',
    name: 'desc',
    message: '描述',
    default: dayjs().format('YYMMDDTHH')
  },
];
const spinner = ora('building...');

async function upload() {
  const { version, desc } = await inquirer.prompt(questions);
  spinner.start();
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
      version,
      desc,
      robot: 1,
      setting: {
        es6: true,
        es7: true,
        minify: true,
        autoPrefixWXSS: true
      },
      onProgressUpdate: console.log,
    });
    console.log(chalk.green('\n上传成功！'));
  } catch (err) {
    console.log(chalk.red('\n上传失败!'));
  }
  process.exit(0);
}

upload().finally(() => spinner.stop());
