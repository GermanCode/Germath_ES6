"use strict";

function atan(z) {
  return 2 / (1 + Math.exp(-2 * z)) - 1;
}

module.exports = atan;