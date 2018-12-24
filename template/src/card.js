"use strict";

/*
 * Note that it's important that sources are all under a single level of directory
 * like src and webpack bundle output is dist.  That way, all the relative
 * require paths such as `../` continue to work as is.
 */

const xrequire = eval(`require`);
const makeCard = require("./make-card");
const myPkg = xrequire("../package.json");

console.log(makeCard(myPkg).boxenText);
