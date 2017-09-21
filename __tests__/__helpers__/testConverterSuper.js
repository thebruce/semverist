'use strict';

const superSemverist = require('../../lib/supers/semverist.js');

const superClass = class extends superSemverist {
  setSemverish() {
    this.semverish = 5;
  }

  setSemveristElement() {
    this.semveristElement = 6;
  }

  setSemverishObject() {
    this.semverishObject = 7;
  }
};

module.exports = superClass;
