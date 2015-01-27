#!/usr/bin/env node
'use strict';
var app = require('express')(), 
    serveStatic = require('serve-static'), 
    path = require('path'), 
    fs = require('fs'), 
    colors = require('colors'), 
    pkg = require('./package.json'), 
    ls = require('./lib/ls'), 
    list = ls('./');

app.get('/api', function (req, res) {
  res.json(list);
});

app.get('/api/refresh', function (req, res) {
  list = ls('./');
  res.json(list);
});

app.get('/api/play/:id', function (req, res) {
  list.forEach(function(zik){
      if (req.params.id == zik.id) {
          return;
      }
  });
  res.end();
});

app.get('/api/stop', function (req, res) {
  res.end();
});

app.use(serveStatic(__dirname));

var server = require('http').createServer(app);
server.listen(7775, function () {
  console.log('Server running at\n  => ' + colors.green('http://localhost:7775') + '\nCTRL + C to shutdown');
});