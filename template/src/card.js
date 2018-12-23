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

const myPkg = xrequire("../package.json");
const cardStyle = require("./style.js");

function showCard(pkg) {
  // remove the color marker like <red>text</> from strings
  const removeColors = x => x.replace(/<[^>]*>/g, "").trim();

  // get myCard info from package
  const myCard = pkg.myCard;
  const data = myCard.data;
  const fields = Object.keys(data);

  // find the longest label string and its corresponding URL
  // for later padding of spaces to do alignment
  const maxLens = fields.reduce(
    (a, x) => {
      // ignore label for line if it starts with .
      if (x.startsWith(".")) return a;
      const value = removeColors(data[x]);
      x = removeColors(x);
      a.field = Math.max(a.field, x.length);
      a.value = Math.max(a.value, value.length);
      return a;
    },
    { field: 0, value: 0 }
  );

  const defaultLabel = cardStyle._default;

  // generate heading using name and handle
  const heading = [cardStyle.title(formatColors(myCard.name), formatColors(myCard.handle))];

  const cardText = heading.concat(
    // add each label and corresponding URL

    fields.reduce((a, x) => {
      // get label literal without any color markers
      const label = removeColors(x);

      // get style for the label
      const style = Object.assign(
        {},
        defaultLabel,
        cardStyle[label] || cardStyle[label.toLowerCase()]
      );

      let pad = "";
      let line;

      if (x.startsWith(".")) {
        // ignore label for line if it starts with .
        line = style.value(formatColors(data[x]));
      } else {
        // add leading spaces for alignment
        pad = new Array(maxLens.field - label.length + 1).join(" ");
        // generate the label and corresponding URL value
        line = style.label(formatColors(x)) + style.value(formatColors(data[x]));
      }

      a.push(pad + line);

      return a;
    }, [])
  );

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
