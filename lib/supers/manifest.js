

const semver = require('semver');
const _ = require('lodash');

const manifest = class manifestSuperBase {
  /**
   * Initializes the manifest class.
   *
   * @param {semveristBehaviors} configs - A configurtion override
   *   object.
   */
  constructor(configs) {
    this.manifestCapability = [];
    // Bring in nameSpace if Provided.
    this.setConfig(configs);
  }

  /**
   * An initialization for this class.
   *
   * @returns {void}
   */
  init() {
    // Call get manifest components.
    this.setManifestComponents();
  }

  /**
   * Set the configuration namespace for this manifest.
   *
   * @param {string} configNameSpace - The namespace of
   *   the configuration for this manifest.
   * @returns {void}
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
   * @returns {void}
   */
  setConfig(manifestConfig) {
    this.config = manifestConfig;
  }

  /**
   * Gets the config for this manifest.
   *
   * @returns {Object}
   *   Return the config object for this manifest.
   */
  getConfig() {
    return this.config;
  }

  /**
   *
   * @returns {void}
   */
  setManifestComponents() {
    this.manifestComponents = {};
    // Get semveristRealizations from converter.
    const { semverRealizations } = this.getConverter();
    const attributeKeys = Object.keys(this.getConverter().attribute);


    // For each semver
    semverRealizations.forEach((semverItem) => {
      // For each semverist attribute.
      attributeKeys.forEach((attKey) => {
        // See if there is a range response.
        const attributeRangeKeys = Object.keys(this.getConverter().attribute[attKey]);
        const isAttributeActualized = attributeRangeKeys.filter(keyInQuestion => semver.satisfies(
          semverItem,
          keyInQuestion
        ));
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

  /**
   * Gets the manifest components for this manifest.
   *
   * @returns {Object}
   *   A manifest components object.
   */
  getManifestComponents() {
    return this.manifestComponents;
  }

  /**
   * Add a new componentName key to this.manifestComponents object.
   *
   * @param {string} componentName
   *   Adds a component name to this manifest's manifestComponents.
   * @returns {void}
   */
  addManifestComponent(componentName) {
    if (!_.has(this.getManifestComponents(), componentName)) {
      this.manifestComponents[componentName] = {
        items: {},
      };
    }
  }

  /**
   *
   *
   * @param {string} componentName
   *   The componentName key where we will add the itemname key and item value.
   * @param {string} itemName
   *   The key of the item within the manifestComponents[componentName]
   * @param {any} item
   *   A component
   * @returns {void}
   */
  addManifestComponentItem(componentName, itemName, item) {
    if (!_.has(this.getManifestComponents()[componentName], itemName)) {
      this.manifestComponents[componentName][itemName] = {
        components: [],
      };
    }
    else {
      this.manifestComponents[componentName][itemName].components.push(item);
    }
  }

  /**
   * Add item alters.
   *
   * @param {string} semverValue
   *   A semver value.
   * @param {object} converterItem
   *   A converter item.
   * @returns {void}
   */
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
   * @param {Converter} converter
   *   A converter object
   *
   * @returns {void}
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

  /**
   *
   * @returns {void}
   */
  setManifestCapabilities() {
    // Populate the defaults from the converter object.
    this.manifestCapability.push('attribute');
  }

  /**
   * Returns the manifest capability Array.
   *
   * @returns {Arrays}
   *   Returns the manifest capability array.
   */
  getManifestCapabilities() {
    return this.manifestCapability;
  }
  /**
   * Returns an array of the semverString split.
   *
   * @param {string} semverishString
   *   A semverish string.
   * @returns {array}
   *   An array of semverish values.
   */
  splitStringNoEmpties(semverishString) { // eslint-disable-line class-methods-use-this
    return semverishString.split('.').filter(v => v);
  }
};

module.exports = manifest;
