'use strict';

const composer = require('./manifest/composer');
const defaultManifestComponents = require('./manifest/defaultManifestComponents');
const defaultPriority = require('./manifest/defaultPriority');
const directoryWriter = require('./manifest/directoryWriter');
const groupManifestComponents = require('./manifest/groupManifestComponents');
const inspector = require('./manifest/inspector');
const manifestSortArray = require('./manifest/manifestSortArray');
const mergeStrategy = require('./manifest/mergeStrategy');
const objectWriter = require('./manifest/objectWriter');

const directoryToSemverishObject = require('./semverist/directoryToSemverishObject');
const parseSemverUtils = require('./semverist/parseSemverUtils');
const semverAdjacent = require('./semverist/semverAdjacent');
const semverishElement = require('./semverist/semverishElement');
const semverishLevel = require('./semverist/semverishLevel');
const semverishValue = require('./semverist/semverishValue');
const semveristElementType = require('./semverist/semveristElementType');
const sortRangeArray = require('./semverist/sortRangeArray');
const toCaretRange = require('./semverist/toCaretRange');
const toTildeRange = require('./semverist/toTildeRange');

module.exports = {
  manifest: {
    composer,
    defaultManifestComponents,
    defaultPriority,
    directoryWriter,
    groupManifestComponents,
    inspector,
    manifestSortArray,
    mergeStrategy,
    objectWriter,
  },
  semverist: {
    directoryToSemverishObject,
    parseSemverUtils,
    semverAdjacent,
    semverishElement,
    semverishLevel,
    semverishValue,
    semveristElementType,
    sortRangeArray,
    toCaretRange,
    toTildeRange,
  },
};
