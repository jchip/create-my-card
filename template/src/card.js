"use strict";

/*
 * Note that it's important that sources are all under a single level of directory
 * like src and webpack bundle output is dist.  That way, all the relative
 * require paths such as `../` continue to work as is.
 */

const xrequire = eval(`require`);
const boxen = require("boxen");
const chalk = require("chalk");
const formatColors = require("./format-colors");
const get = require("lodash.get");

const myPkg = xrequire("../package.json");
const cardStyle = require("./style.js");

function showCard(pkg) {
  // remove the color marker like <red>text</> from strings
  const removeColors = x => x.replace(/<[^>]*>/g, "").trim();

  // get myCard info from package
  const myCard = pkg.myCard;
  const info = Object.assign({ _packageName: pkg.name }, myCard.info);
  const data = myCard.data;

  // replace {{token}} in string with info[token]
  const processString = str => str.replace(/{{([^}]+)}}/g, (a, b) => get(info, b, ""));

  // find the longest label string and its corresponding URL
  // for later padding of spaces to do alignment
  const maxLens = data.reduce(
    (a, x) => {
      // if line is a literal string or has no label, skip
      if (typeof x === "string" || !x.hasOwnProperty("label")) return a;
      a.label = Math.max(a.label, removeColors(x.label).length);
      a.text = Math.max(a.text, removeColors(x.text).length);
      return a;
    },
    { label: 0, text: 0 }
  );

  const defaultStyle = Object.assign({ label: x => x, text: x => x }, cardStyle._default);

  const cardText = data.reduce((a, x) => {
    let line;

    // line has when field and it's empty, so skip it
    if (x.when && processString(x.when).trim() === "") {
      return a;
    }

    // line has only text and no label, so take it as literal string
    if (!x.hasOwnProperty("label") && x.hasOwnProperty("text")) {
      x = x.text || "";
    }

    if (typeof x === "string") {
      // process a string literal line directly
      line = defaultStyle.text(formatColors(processString(x)));
    } else {
      // replace any info token in label and text
      const xLabel = processString(x.label);
      const xText = processString(x.text);
      // get label literal without any color markers
      const label = removeColors(xLabel);
      // get style for the label
      const style = Object.assign(
        {},
        defaultStyle,
        cardStyle[label] || cardStyle[label.toLowerCase()]
      );
      // add leading spaces for alignment
      const pad = x.hasOwnProperty("pad")
        ? x.pad
        : new Array(maxLens.label - label.length + 1).join(" ");
      line = pad + style.label(formatColors(xLabel)) + style.text(formatColors(xText));
    }

    a.push(line);

    return a;
  }, []);

  // join all the text lines into a single string with newline
  const cardOuput = cardText.join("\n");

  // get options for boxen
  const boxenStyle = cardStyle._boxen || {
    padding: 1,
    margin: 1,
    borderColor: "green",
    borderStyle: "round"
  };

  console.log(boxen(cardOuput, boxenStyle));
}

showCard(myPkg);
