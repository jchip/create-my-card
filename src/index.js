"use strict";

const fs = require("fs-extra");
const Path = require("path");
const Inquirer = require("inquirer");
const validatePackageName = require("validate-npm-package-name");
const ejs = require("ejs");

function renderFile(filename, data, options) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(filename, data, options, (err, str) => {
      if (err) return reject(err);
      return resolve(str);
    });
  });
}

function getInput() {
  const prompt = Inquirer.createPromptModule();

  const questions = [
    {
      type: "input",
      name: "name",
      message: "Please enter your name:",
      validate: x => {
        if (x) return true;
        return "Must provide name for your card";
      }
    },
    {
      type: "input",
      name: "handle",
      message: "Please enter your handle:",
      validate: x => {
        if (x) return true;
        return "Must provide handle for your card";
      }
    },
    {
      type: "input",
      name: "work",
      message: "Please enter your job title:"
    },
    {
      type: "input",
      name: "packageName",
      message: "Please enter npm package name for your card:",
      default: answers => answers.handle,
      validate: x => {
        if (!x) return "Must provide package name for your card";
        const valid = validatePackageName(x);
        if (!valid.validForNewPackages || !valid.validForOldPackages) {
          return "Must provide a valid package name for your card";
        }
        return true;
      }
    },
    {
      type: "input",
      name: "repoName",
      message: "Please enter git repo name for your card:",
      default: answers => Path.basename(answers.packageName)
    },
    {
      type: "input",
      name: "npm",
      message: "Please enter your npm id:",
      default: answers => answers.handle
    },
    {
      type: "input",
      name: "github",
      message: "Please enter your GitHub id:",
      default: answers => answers.handle
    },
    {
      type: "input",
      name: "twitter",
      message: "Please enter your Twitter id:",
      default: answers => answers.handle
    },
    {
      type: "input",
      name: "linkedin",
      message: "Please enter your LinkedIn id:",
      default: answers => answers.handle
    },
    {
      type: "input",
      name: "web",
      message: "Please enter your homepage URL:"
    }
  ];
  return prompt(questions);
}

function createCard(answers) {
  answers = Object.assign({ unscopePkgName: Path.basename(answers.packageName) }, answers);
  const cwd = process.cwd();
  const dirName = Path.basename(cwd);
  const tmplDir = Path.join(__dirname, "../template");

  let destDir;

  if (dirName === answers.repoName) {
    destDir = cwd;
  } else {
    destDir = Path.resolve(answers.repoName);
  }

  const processFile = (filename, processor) => {
    filename = Path.join(destDir, filename);
    return renderFile(filename, answers).then(str => {
      if (processor) str = processor(str);
      return fs.writeFile(filename, `${str}\n`);
    });
  };

  const renameFile = (from, to) => {
    return fs.rename(Path.join(destDir, from), Path.join(destDir, to));
  };

  return fs
    .copy(tmplDir, destDir)
    .then(() => processFile("README.md"))
    .then(() => processFile("package.json", str => JSON.stringify(JSON.parse(str), null, 2)))
    .then(() => renameFile("_gitignore", ".gitignore"))
    .then(() => {
      console.log(`Your npm card is created in ${destDir}`);
    })
    .catch(err => {
      console.log(err);
    });
}

getInput().then(createCard);
