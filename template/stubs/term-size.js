"use strict";

const xrequire = eval(`require`);

try {
  module.exports = xrequire("term-size");
} catch {
  module.exports = function() {
    return {
      rows: 24,
      columns: 80
    };
  };
}
