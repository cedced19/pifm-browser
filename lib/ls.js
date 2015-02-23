#!/usr/bin/env node
'use strict';
var fs = require('fs');
var join = require('path').join;
var getShiny = function (name) {
  name = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
  name = name.replace('.wav', '');
  name = name.replace(/-/g, ' ');
  return name;
};
var getUnShiny = function (name) {
  name = name.toLowerCase();
  name = name.replace(/ /g, '-');
  name = name.replace(/_/g, '-');
  return name;
};
module.exports = function () {
  var root = process.cwd(),
  result = [],
  queue = ['/'];
  while (queue.length) {
    var d = queue.shift();
    fs.readdirSync(join(root, d)).sort().forEach(function (entry) {
      var f = join(root, d, entry);
      var stat = fs.statSync(f);
      if (stat.isDirectory() && entry != 'node_modules') {
        queue.push(join(d, entry));
      } else {
        if (/.wav/.test(entry)) {
          var filename = getUnShiny(entry);
          fs.renameSync(f, join(root, d, filename));
          if (d == '/') {
            result.push({
                uri: process.cwd() + d + filename,
                name: getShiny(entry)
            });
          } else {
            result.push({
                uri: process.cwd() + d + '/' + filename,
                name: getShiny(entry)
            });
          }
        }
      }
    });
  }
  return result;
};