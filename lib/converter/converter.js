'use strict';

const _ = require('lodash');
const semveristSuperBase = require('../supers/semverist');

/**
 * sourceConverter superClass.
 */
module.exports = class sourceConverter extends semveristSuperBase {
  constructor() {
    super();
    this.setConverter(
      {
        default: {},
        groups: {},
        attributes: {}
      });
  }

  /**
   * assembleViaTraversal()
   *   Traverses the source object to assemble the raw converter object.
   */
  assembleViaTraversal() {
    // For dir objects this would be what happens with klaw .on('read')

    // NOTE 3/18  --
    //  We want to assemble items and process ranges at the furthest branch
    // in the semver for any satisfying range.
    // Dig down into children, solve the range, then go up to parents
    //

    this.thing = 'fake';
    // Call a function to identify whether the path is semverish.
    // if only semver -> we move on.
    // if not semver we then try to identify what this is.

    // confirm that the item is either default, a group, or
    // an attribute // I guess?
    // any way about it we'll add this to the converter object like
    // ${attributeName}.push(path)

    // mainly we just want to make sure it is one of these
  }

  /**
   * populateConverter
   *   Populates the converter object from the source.
   */
  populateConverter() {
    // call traverse.
    this.converter = 'fake';
    // With traversed object call assembleConverterComposition.
  }


  /**
   *
   * @param {string} attributeType
   *   An attribute Type such as (attribute || group || default)
   * @param {string} attributeKey
   *   A key within an attribute Type
   * @param {any} attributeValue - A value for that attribute Key.
   */
  addConverterAttribute(attributeType, attributeKey, attributeValue) {
    if (!_.has(this.converter[attributeType], `${attributeKey}`)) {
      this.converter[attributeType][attributeKey] = [];
    }
    this.converter[attributeType][`${attributeKey}`].push(attributeValue);
  }

  /**
   * getConverterAttribute
   *   Gets an attribute from the converter object.
   *
   * @param {string} attribute
   *   The name of a converter attribute.
   * @param {string} value
   *   The name of a key within a converter attribute.
   *
   * @returns {any} value
   *   The value for the passed converter object key and value key.
   */
  getConverterAttribute(attributeType, attributeKey) {
    return this.converter[`${attributeType}`][`${attributeKey}`];
  }

  /**
   * identifySourceAttributeType()
   *   Takes a source attribute, what kind of attribute is it?
   */
  identifySourceAttributeType(pather) {
    // run
    if (pather.length() === this.extractSemverFromPath().length()) {
      return 'semver';
    }
    const tempType = this.extractSemveristElementFromPath(pather);
    return this.determineSemveristElementType(tempType);
  }

  /**
   * assembleConverterComponents.
   *   Take the raw converter object and reconcile the ordering of the object
   *   based on inheritence and lazySemver.  Modify the component.
   */
  assembleConverterComposition() {
    this.coverter = 'fake';
    // break down the raw component item into processed converter.
  }

  /**
   * setConverter.
   *   Set the converter object to the passed value. Converter objects
   *   are a set of assembly
   *   instructions based on:
   *     1) The contents of the source semverist object.
   *     2) The inheritence type of the semverist config.
   *     3) The lazy semver settings in semverist config.
   *   These instructions store information on how an attribute should be
   *   represented in semver through structured inheritence of attributes
   *   (groups/defaults/attributes) in semver leavesxs
   *   and the order of those elements.
   * @param {obj} converter
   *   A converter object.
   */
  setConverter(converter) {
    this.converter = converter;
  }

  /**
   * getConverter.
   *
   * @returns {obj}
   */
  getConverter() {
    return this.converter;
  }
};
