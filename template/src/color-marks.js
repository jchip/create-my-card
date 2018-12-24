"use strict";

const get = require("lodash.get");
const chalk = require("chalk");

//
// convert color markers in a string to terminal color codes with chalk
// color marker format is "<red>red text</red><blue.bold>blue bold text</blue.bold>"
// the end marker can simply be "</>" also
// the marker is converted to chalk methods directly, for example:
// - chalk.red is called for "<red>"
// - chalk.blue.bold is called for "<blue.bold>"
//
function format(s) {
  return s.replace(/<([a-z.]+)>([^<]+)($|<\/[^>]*>)/g, (a, b, c) => {
    return get(chalk, b)(c);
  });
}

// remove the color marker like <red>text</> from strings
function remove(s) {
  return s.replace(/<[^>]*>/g, "").trim();
}

module.exports = {
  format,
  remove
};
