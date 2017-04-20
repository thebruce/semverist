'use strict';

const requireDirectory = require('require-directory');
const path = require('path');

// Require supers directory.
const supers = requireDirectory(module, './supers');
// Require plugins directory.
const plugins = requireDirectory(module, './plugins');
// The molotov class we will extend.
const Molotov = require('molotov/molotov');

const modulePath = path.dirname(__dirname);
const molotovNameSpace = 'semverist';
const molotovPath = path.join(modulePath);

module.exports = class extends Molotov {
  constructor() {
    super(molotovPath, molotovNameSpace, supers, plugins);
  }
};
