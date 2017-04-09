'use strict';

// Turn off warnings for folks not using config.
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

const manifest = class manifestSuperBase {

  /**
   * Initializes the manifest class.
   *
   * @param {string} configNameSpace - A namespace in configuration
   *   to draw configuration from for this manifest.
   * @param {semveristBehaviors} configs - A configurtion override
   *   object.
   */
  init(configs) {
    // Bring in nameSpace if Provided.
    this.setConfig(configs);
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
};

module.exports = manifest;
