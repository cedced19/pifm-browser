#!/usr/bin/env node
'use strict';
var app = require('express')(), 
    serveStatic = require('serve-static'), 
    path = require('path'), 
    fs = require('fs'), 
    colors = require('colors'), 
    config = require('./config.json'),
    ls = require('./lib/ls'), 
    list = ls('./'),
    exec = require('child_process').execFile,
    proc = null;

app.get('/api', function (req, res) {
  res.json(list);
});

app.use(serveStatic(__dirname));

var server = require('http').createServer(app);
server.listen(config.port, function () {
  console.log('Server running at\n  => ' + colors.green('http://localhost:' + config.port) + '\nCTRL + C to shutdown');
});
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
    socket.on('play', function(id){
        list.forEach(function(zik){
          if (id == zik.id) {
              if (proc) proc.kill();
              proc = exec('./pifm', [zik.uri, config.audio.freq, config.audio.rate], null, function() {
                proc = null;
                socket.emit('random');
              });
          }
      });
    });
    
    socket.on('pause', function(id){
        proc && proc.kill();
        proc = null;
    });
    
    socket.on('refresh', function(){
        list = ls('./');
        io.sockets.emit('refresh', list);
    });
});