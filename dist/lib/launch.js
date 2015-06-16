#!/usr/bin/env node
'use strict';
var colors = require('colors'),
    config = require('../config.json'),
    exec = require('child_process').execFile,
    list = [],
    pifm = process.cwd() + '/lib/pifm',
    lastzik = false,
    currentzik = false,
    Emitter = require('events').EventEmitter;

var ee = new Emitter();

var set = function (zik) {
    lastzik = currentzik;
    currentzik = zik;
    ee.emit('new', currentzik);
    exec(pifm, [zik.uri, config.audio.freq, config.audio.rate], null, function() {
        random();
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

ee.on('start', function (data) {
    list = data;
    random();
});


ee.on('refresh', function (data) {
     list = data;
});

module.exports = ee;
