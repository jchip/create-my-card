"use strict";

const fs = require("fs-extra");
const Path = require("path");
const Inquirer = require("inquirer");
const validatePackageName = require("validate-npm-package-name");
const ejs = require("ejs");
const chalk = require("chalk");

function renderFile(filename, data, options) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(filename, data, options, (err, str) => {
      if (err) return reject(err);
      return resolve(str);
    });
  });
}

let existUserPkg = {};

function getInput() {
  let existCardInfo = {};
  const prompt = Inquirer.createPromptModule();

  const questions = [
    {
      type: "input",
      name: "name",
      message: "Please enter your name:",
      default: () => existCardInfo.name,
      validate: x => {
        if (x) return true;
        return "Must provide name for your card";
      }
    },
    {
      type: "input",
      name: "handle",
      message: "Please enter your handle:",
      default: () => existCardInfo.handle,
      validate: x => {
        if (x) return true;
        return "Must provide handle for your card";
      }
    },
    {
      type: "input",
      name: "work",
      message: "Please enter your job title:",
      default: () => existCardInfo.work
    },
    {
      type: "input",
      name: "packageName",
      message: "Please enter npm package name for your card:",
      default: answers => existUserPkg.name || existCardInfo.handle || answers.handle,
      validate: x => {
        if (!x) return "Must provide package name for your card";
        const valid = validatePackageName(x);
        if (!valid.validForNewPackages) {
          return (
            "Invalid package name: " +
            chalk.red((valid.errors || valid.warnings || ["unknown error"])[0])
          );
        }
        return true;
      }
    },
    {
      type: "input",
      name: "repoName",
      message: "Please enter git repo name for your card:",
      default: answers => {
        if (existUserPkg.repository && existUserPkg.repository.url) {
          const repo = Path.basename(existUserPkg.repository.url);
          const ix = repo.lastIndexOf(".git");
          if (ix > 0) {
            return repo.substring(0, ix);
          }
        }
        return Path.basename(answers.packageName);
      }
    },
    {
      type: "input",
      name: "npm",
      message: "Please enter your npm id:",
      default: answers => existCardInfo.npm || answers.handle
    },
    {
      type: "input",
      name: "github",
      message: "Please enter your GitHub id:",
      default: answers => existCardInfo.github || answers.handle
    },
    {
      type: "input",
      name: "twitter",
      message: "Please enter your Twitter id:",
      default: answers => existCardInfo.twitter || answers.handle
    },
    {
      type: "input",
      name: "linkedin",
      message: "Please enter your LinkedIn id:",
      default: answers => existCardInfo.linkedin || answers.handle
    },
    {
      type: "input",
      name: "web",
      message: "Please enter your homepage URL:",
      default: () => existCardInfo.web
    }
  ];

  return fs
    .readFile(Path.resolve("package.json"))
    .then(JSON.parse)
    .catch(err => {
      return {};
    })
    .then(x => {
      existUserPkg = (x.myCard && x) || {};
      existCardInfo = Object.assign({}, x.myCard && x.myCard.info);
      return prompt(questions);
    });
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

  const processFile = (filename, out, processor) => {
    out = out || filename;
    filename = Path.join(destDir, filename);
    out = Path.join(destDir, out);
    return renderFile(filename, answers).then(str => {
      if (processor) str = processor(str);
      return fs.writeFile(out, `${str}\n`).then(() => {
        if (filename !== out) {
          return fs.remove(filename);
        }
      });
    });
  };

  const renameFile = (from, to) => {
    return fs.rename(Path.join(destDir, from), Path.join(destDir, to));
  };

  const transferExistPkg = (existPkg, newPkg, fields) => {
    fields.forEach(x => {
      if (existPkg.hasOwnProperty(x)) newPkg[x] = existPkg[x];
    });
  };

  return fs
    .copy(tmplDir, destDir)
    .then(() => processFile("README.md"))
    .then(() => {
      return processFile("_package.json", "package.json", str => {
        const newPkg = JSON.parse(str);
        transferExistPkg(existUserPkg, newPkg, [
          "name",
          "version",
          "author",
          "license",
          "description"
        ]);
        return JSON.stringify(newPkg, null, 2);
      });
    })
    .then(() => renameFile("_gitignore", ".gitignore"))
    .then(() => {
      console.log(`Your npm card is created in ${destDir}`);
    });
}

getInput()
  .then(createCard)
  .catch(err => {
    console.error("Failed creating your npm card\n");
    console.error(err);
  });
