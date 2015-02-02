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
    path: '/{param*}',
    handler: {
        directory: {
            path: './'
        }
    }
});

app.start(function () {
  console.log('Server running at\n  => ' + colors.green('http://localhost:' + config.port) + '\nCTRL + C to shutdown');
});

var io = require('socket.io').listen(app.listener);
io.sockets.on('connection', function(socket){
    if (!proc) {
        socket.emit('random');
    }
    
    socket.on('play', function(id){
        list.forEach(function(zik){
          if (id == zik.id) {
              socket.broadcast.emit('info', zik.id);
              if (proc) proc.kill();
              proc = exec('./pifm', [zik.uri, config.audio.freq, config.audio.rate], null, function() {
                proc = null;
                socket.emit('random');
              });
          }
      });
    });
    
    socket.on('stop', function(id){
        proc && proc.kill();
        proc = null;
    });
    
    socket.on('refresh', function(){
        list = ls('./');
        io.emit('refresh', list);
    });
});