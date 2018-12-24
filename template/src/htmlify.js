"use strict";

/*
 * Note that it's important that sources are all under a single level of directory
 * like src and webpack bundle output is dist.  That way, all the relative
 * require paths such as `../` continue to work as is.
 */

process.env.FORCE_COLOR = 1;

const Path = require("path");
const xrequire = eval(`require`);
const makeCard = require("./make-card");
const AnsiToHtml = require("ansi-to-html");
const myPkg = xrequire("../package.json");
const Fs = require("fs");
const colorMarks = require("./color-marks");
const get = require("lodash.get");

function makeHtmlCard(pkg) {
  const myCard = pkg.myCard;
  const info = Object.assign({ _packageName: pkg.name }, myCard.info);
  // replace {{token}} in string with info[token]
  const processString = str => str.replace(/{{([^}]+)}}/g, (a, b) => get(info, b, ""));

  pkg.myCard.data = pkg.myCard.data.map(l => {
    if (typeof l !== "string") {
      if (l.hasOwnProperty("link")) {
        l._link = processString(l.link);
      } else {
        const link = processString(colorMarks.remove(l.text));
        if (link.indexOf("http") >= 0) {
          l._link = link;
        }
      }
    }
    return l;
  });

  const card = makeCard(pkg);
  const ansi = new AnsiToHtml();
  const html = card.cardLines.map(l => ansi.toHtml(l)).join("\n");
  const template = Fs.readFileSync(Path.join(__dirname, "card.html")).toString();

  Fs.writeFileSync(
    "index.html",
    template.replace("{{ cardTitle }}", `${info.name} (@${info.handle})`).replace(
      "{{ card }}",
      `<pre>
${html}
</pre>`
    )
  );
}

makeHtmlCard(myPkg);
