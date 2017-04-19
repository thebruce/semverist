'use strict';


const _ = require('lodash');

/**
 * This is a semverist plugin for set/geting the semverist element.
 * It is self-contained.
 *
 * Mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  init() {
    this.setCompositionType();
    this.setCompositionDestination();
    super.init();
  }

  /**
   * Assembles the composition based on the manifest.
   *
   */
  assembleManifest() {
    // calls to write composition - handled in plugins
    // chained from object writer to directory writer (if directory)
    this.writeComposition();
  }

  /**
   * Sets the composition for this manifest.
   *
   * @param {Object} draft - A semver shaped hierarchy with elements at the
   *   patch or lower levels based on the semverish object that the manifest
   *   was built upon.
   */
  setComposition(draft) {
    this.composition = draft;
  }

  /**
   * Returns the composition
   *
   * @returns {Object} - A semver shaped hierarchy keyed by semver strings
   *   with element attributes of fully formed elements created from semverist
   *   elements contained in the semverish object the manifest was built upon.
   */
  getComposition() {
    return this.composition;
  }

  /**
   * Sets the composition type from config.
   *   This can be default (object) or directory and influences the out
   *   put of the composer to either an object in this.composition or
   *   an object in this.composition and a series of files and directories
   *   written to composer.destination.
   */
  setCompositionType() {
    // Sets the composition type according to configuration passed to manifest.
    this.compositionType = _.get(this.getConfig(), 'composer.composerType', 'default');
  }

  /**
   * Returns the composition type for this manifest.
   *
   * @returns {string} - The composition type.
   */
  getCompositionType() {
    return this.compositionType;
  }

  /**
   * Sets the composition destination, a path. The path will be an object path
   *   in the case of a default composition type or a directory path in the
   *   case of a directory composition type.
   *
   */
  setCompositionDestination() {
    // Sets the composition destination according to configuration
    // passed to manifest.
    this.compositionDestination = _.get(this.getConfig(), 'composer.destination', null);
    if (this.getCompositionType() === 'directory' && !this.compositionDestination) {
      throw new Error('If the composition type is directory there must be a destination path');
    }
  }

  /**
   * Returns the composition destination.
   *
   * @returns {string} - the composition destination.
   */
  getCompositionDestination() {
    return this.compositionDestination;
  }

  /**
   * Revises the path to handle any special cases.
   *   Can be a place for super overrides to modify
   *   the path for special prereleases and the like.
   *
   * @static
   * @param {Object} parsedPath - A semver utils parsed
   *   path.
   * @returns {string} - A valid object path.
   */
  static pathBuildImprovement(parsedPath) {
    return parsedPath;
  }
};
