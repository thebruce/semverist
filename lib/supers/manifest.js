'use strict';

// Turn off warnings for folks not using config.
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
const semver = require('semver');
const _ = require('lodash');

const manifest = class manifestSuperBase {
  /**
   * Initializes the manifest class.
   *
   * @param {string} configNameSpace - A namespace in configuration
   *   to draw configuration from for this manifest.
   * @param {semveristBehaviors} configs - A configurtion override
   *   object.
   */
  constructor(configs) {
    this.manifestCapability = [];
    // Bring in nameSpace if Provided.
    this.setConfig(configs);
  }

  init() {
    // Call get manifest components.
    this.setManifestComponents();
  }

  /**
   * Set the configuration namespace for this manifest.
   *
   * @param {string} configNameSpace - The namespace of
   *   the configuration for this manifest.
   */
  setConfigNameSpace(configNameSpace) {
    this.configNameSpace = configNameSpace;
  }

  /**
   * Returns the config namespae key for this manifest.
   *
   * @returns {string} - The config name space we use for
   *   this manifest, its ranges and semverish components.
   */
  getConfigNameSpace() {
    return this.configNameSpace;
  }

  /**
   * Sets configuration for this manifest.
   *
   * @param {semveristBehaviors} manifestConfig - a config object.
   */
  setConfig(manifestConfig) {
    this.config = manifestConfig;
  }

  getConfig() {
    return this.config;
  }

  setManifestComponents() {
    this.manifestComponents = {};
    // Get semveristRealizations from converter.
    const semverRealizations = this.getConverter().semverRealizations;
    const attributeKeys = Object.keys(this.getConverter().attribute);


    // For each semver
    semverRealizations.forEach((semverItem) => {
      // For each semverist attribute.
      attributeKeys.forEach((attKey) => {
        // See if there is a range response.
        const attributeRangeKeys = Object.keys(this.getConverter().attribute[attKey]);
        const isAttributeActualized = attributeRangeKeys.filter(
          keyInQuestion => semver.satisfies(
            semverItem,
            keyInQuestion
          )
        );
        // If there is a length here, we have a satisfying range.

        if (isAttributeActualized.length) {
          // Yes. We should add an item to the manifest if not there.
          this.addManifestComponent(attKey);
          // We should add this instance to that item.
          this.addManifestComponentItem(attKey, semverItem);
          // We should call alters.
          this.addItemAlters(
            semverItem,
            this.getConverter().attribute[attKey][isAttributeActualized[0]]
          );
        }
      });
    }, this);
  }

  getManifestComponents() {
    return this.manifestComponents;
  }

  addManifestComponent(componentName) {
    if (!_.has(this.getManifestComponents(), componentName)) {
      this.manifestComponents[componentName] = {
        items: {}
      };
    }
  }

  addManifestComponentItem(componentName, itemName, item) {
    if (!_.has(this.getManifestComponents()[componentName], itemName)) {
      this.manifestComponents[componentName][itemName] = {
        components: []
      };
    }
    else {
      this.manifestComponents[componentName][itemName].components.push(item);
    }
  }

  addItemAlters(semverValue, converterItem) {
    this.addManifestComponentItem(
      converterItem.semveristElement,
      semverValue,
      `${converterItem.semverishValue}.${converterItem.semveristElement}`
    );
  }

  /**
   * Sets a converter Object or this manifest.
   *
   * @param {} converter
   */
  setConverter(converter) {
    this.converter = converter;
  }

  /**
   * Gets the manifest's conveter.
   *
   * @returns {Object} converter - A converter object.
   */
  getConverter() {
    return this.converter;
  }
  setManifestCapabilities() {
    // Populate the defaults from the converter object.
    this.manifestCapability.push('attribute');
  }
  getManifestCapabilities() {
    return this.manifestCapability;
  }
};

module.exports = manifest;
