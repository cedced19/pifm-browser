#!/usr/bin/env node
'use strict';
var hapi = require('hapi'),
    app = new hapi.Server(), 
    path = require('path'), 
    fs = require('fs'), 
    colors = require('colors'), 
    config = require('./config.json'),
    ls = require('./lib/ls'), 
    list = ls('./'),
    exec = require('child_process').execFile,
    proc = null;

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
        list = ls('./');
        reply(list);
    }
});

app.route({
    method: 'GET',
    path: '/api/play/{id}',
    handler: function (request, reply) {
        if (proc) proc.kill();
        list.forEach(function(zik){
            if (request.params.id == zik.id) {
                proc = exec('./pifm', [zik.uri, config.audio.freq, config.audio.rate], null, function() {
                  proc = null;
                });
              }
          });
        reply({statusCode: 200, success: 'Launched'});
    }
});

app.route({
    method: 'GET',
    path: '/api/stop/',
    handler: function (request, reply) {
        proc && proc.kill();
        proc = null;
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
        if (proc) {
            reply.file('false.html');
        } else {
            reply.file('index.html');
        }
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
  console.log('Server running at\n  => ' + colors.green('http://localhost:' + config.port) + '\nCTRL + C to shutdown');
  console.log('Actual config is ' +  colors.green(config.audio.freq) + ' FM and ' + colors.green(config.audio.rate) + ' Hz');
});