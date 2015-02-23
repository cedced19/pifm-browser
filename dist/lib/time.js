#!/usr/bin/env node
'use strict';
module.exports = function (){
    var date = new Date(),
    h = date.getHours(),
    m = date.getMinutes();
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
};