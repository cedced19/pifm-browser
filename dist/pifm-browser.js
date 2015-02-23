#!/usr/bin/env node
'use strict';
var hapi = require('hapi'),
    app = new hapi.Server(), 
    path = require('path'), 
    fs = require('fs'), 
    colors = require('colors'), 
    config = require('./config.json'),
    time = require('./lib/time'),
    ls = require('./lib/ls'),
    list = ls(),
    launch = require('./lib/launch'),
    stop = false;

app.connection({ port: config.port });

app.route({
    method: 'GET',
    path: '/api/',
    handler: function (request, reply) {
        reply(list);
    }
});

app.route({
    method: 'GET',
    path: '/api/refresh/',
    handler: function (request, reply) {
        launch.emit('refresh');
        list = ls();
        reply(list);
    }
});

app.route({
    method: 'GET',
    path: '/api/start/',
    handler: function (request, reply) {
        launch.emit('start');
        reply({statusCode: 200, success: 'Launched'});
    }
});

app.route({
    method: 'GET',
    path: '/api/stop/',
    handler: function (request, reply) {
        stop = true;
        reply({statusCode: 200, success: 'Stopped'});
    }
});

app.route({
    method: 'GET',
    path: '/vendor/{param*}',
    handler: {
        directory: {
            path: './vendor/'
        }
    }
});

app.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.file('index.html');
    }
});

app.route({
    method: 'GET',
    path: '/favicon.ico',
    handler: function (request, reply) {
        reply.file('favicon.ico');
    }
});

app.start(function () {
  console.log(colors.cyan('['+ time() + ']') +' Server running at\n  => ' + colors.green('http://localhost:' + config.port) + '\nCTRL + C to shutdown');
  console.log(colors.cyan('['+ time() + ']') + ' Actual config is ' +  colors.green(config.audio.freq) + ' FM and ' + colors.green(config.audio.rate) + ' Hz');
  launch.emit('start');
  var pkg = require('./package.json');
  require('check-update-github')({
      name: pkg.name,
      currentVersion: pkg.version,
      user: 'cedced19'
  }, function (err, lastestVersion, defaultMessage) {
      if (!err) {
        console.log(colors.cyan('['+ time() + '] ') + defaultMessage);
      }
  });
});

launch.on('end', function() {
    if (stop){
        stop = false;
    } else {
        launch.emit('start');
    }
});