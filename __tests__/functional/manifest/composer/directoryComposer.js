'use strict';

const manifestFactory = require('../../../../lib/manifest/manifest');
const nestedConfig = require('../../../__helpers__/nestedConfig.json');
const path = require('path');
const fs = require('fs-extra');
const temp = require('temp').track();
const _ = require('lodash');

const semverishPath = path.join(
  __dirname,
  '../../../../',
  '__tests__/__helpers__/semverishObject'
);

let tmpMocks = [];

describe('Directory Composer', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    temp.cleanupSync();
  });

  test('write composition.', () => {
    expect.assertions(1);
    const tmpConfig = _.cloneDeep(nestedConfig.semverist);

    const mkDirAsPromise = (filePath) => // eslint-disable-line
      new Promise((resolve, reject) =>
        temp.mkdir(filePath, (err, data) => // eslint-disable-line
          err ? reject(err) : resolve(data)));

    return mkDirAsPromise('semverist')
        .then((dirPath) => {
          _.set(tmpConfig, 'semverImpliedOrchestraDirectory.composer.destination', dirPath);
          return manifestFactory(
            'composer',
            'semverImpliedOrchestraDirectory',
            tmpConfig
          );
        })
        .then(ManifestClass => Promise.all(
          [
            ManifestClass.createConverter(semverishPath),
            ManifestClass
          ]))
        .then((manifestIngredients) => {
          const ManifestClass = manifestIngredients[1];
          const converter = manifestIngredients[0][0];
          const converterClass = manifestIngredients[0][1];
          const schoenberg = new ManifestClass(converter, converterClass);
          schoenberg.init();
          schoenberg.writeComposition();
          return schoenberg;
        })
        .then(schoen => fs.readJsonSync(`${schoen.getCompositionDestination()}/1/1/1/clarinet.json`))
        .then(obj => expect(obj).toEqual({
          fromClarinet: 'this is from 1.1.1',
          fromDefault: 'this is from 1',
          fromWinds: 'this is from 1',
          toItem: 'clarinet'
        }));
  });
});
