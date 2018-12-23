"use strict";

const chalk = require("chalk");

module.exports = {
  // style for creating card title from name and handle
  title: (name, handle) => {
    if (handle) {
      handle = `${chalk.cyan(handle)}`;
    } else {
      handle = "";
    }
    return `${name}${handle}`;
  },
  // style override for Work label
  work: {
    value: x => chalk.white(x)
  },
  // style override for Card label
  card: {
    value: x => chalk.white(x)
  },
  // any label without a style defined will use this
  _default: {
    label: x => chalk.white.bold(x + ": "),
    value: x => chalk.gray(x)
  },
  // options for boxen
  _boxen: {
    padding: 1,
    margin: 1,
    borderColor: "green",
    borderStyle: "round"
  }
};
