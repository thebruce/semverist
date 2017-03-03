'use strict';

const requireDirectory = require('require-directory');

// Require supers directory.
const supers = requireDirectory(module, './lib/supers');
// Require plugins directory.
const plugins = requireDirectory(module, '/lib/plugins');
// The molotov class we will extend.
const Molotov = require('molotov/molotov');

const molotovNameSpace = 'semverist';
const molotovPath = './';

module.exports = class extends Molotov {
  constructor() {
    super(molotovPath, molotovNameSpace, supers, plugins);
  }
};
