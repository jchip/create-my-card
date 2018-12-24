"use strict";

const chalk = require("chalk");

const linkify = (text, link) => {
  return link ? `<a href="${link}">${text}</a>` : text;
};

module.exports = {
  // style override for Work label
  work: {
    text: x => chalk.white(x)
  },
  // style override for Card label
  card: {
    text: x => chalk.white(x)
  },
  // any label without a style defined will use this
  _default: {
    label: x => (x && chalk.white.bold(x + ": ")) || "  ",
    text: (x, link) => linkify(chalk.white(x), link)
  },
  // options for boxen
  _boxen: {
    padding: 1,
    margin: 1,
    borderColor: "green",
    borderStyle: "round"
  }
};
