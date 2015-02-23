#!/usr/bin/env node
'use strict';
var colors = require('colors'), 
    config = require('../config.json'),
    time = require('./time'),
    exec = require('child_process').execFile,
    proc = null,
    lastzik = false,
    currentzik = false,
    ls = require('./ls'), 
    list = ls(),
    emitter = require('events').EventEmitter;

var ee = new emitter();

var set = function (zik) {
    lastzik = currentzik;
    currentzik = zik; 
    console.log(colors.cyan('['+ time() + ']') + ' Music ' + colors.green(zik.name) + ' is launched!');
    proc = exec('./pifm', [zik.uri, config.audio.freq, config.audio.rate], null, function() {
        proc = null;
        ee.emit('end');
    });
};

var random = function () {
    var number = Math.floor(Math.random() * list.length);
    if (currentzik != list[number]) {
        set(list[number]);
    } else {
        random();
    }
};

ee.on('start', function () {
    if (proc) return false;
    random();
});

ee.on('refresh', function () {
    list = ls();
});

module.exports = ee;