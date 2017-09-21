'use strict';

const semverishFactory = require('../../../lib/semverish/semverish');

let tmpMocks = [];
let semverah;

describe('Extract Semverish Parts from semverish.', () => {
  beforeEach(() => {
    semverah = semverishFactory('semverist', 'semverish')
      .then(SemverishSuperClass => new SemverishSuperClass());
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('extractSemverGoodSemver', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => semverishSuper.extractSemverishFromPath('4.1.0')
    )
    .then(obj => expect(obj).toEqual('4.1.0'));
  });

  test('extractSemverMinorSemverOnly', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => semverishSuper.extractSemverishFromPath('4.1'))
      .then(obj => expect(obj).toEqual('4.1'));
  });

  test('extractSemverAlpha', () => {
    expect.assertions(1);
    return semverah
    .then(semverishSuper => semverishSuper.extractSemverishFromPath('4.1.0-alpha'))
    .then(obj => expect(obj).toEqual('4.1.0-alpha'));
  });

  test('extractSemverAlphaDotVersion', () => {
    expect.assertions(1);
    return semverah
    .then(semverishSuper => semverishSuper.extractSemverishFromPath('4.1.0-alpha.1'))
    .then(obj => expect(obj).toEqual('4.1.0-alpha.1'));
  });

  test('extractSemverDeathStar', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => semverishSuper.extractSemverishFromPath('4.1.0-deathstar.1'))
      .then(obj => expect(obj).toEqual('4.1.0-deathstar.1'));
  });

  test('extractWithAttribute', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => semverishSuper.extractSemverishFromPath('4.1.0.entity'))
      .then(obj => expect(obj).toEqual('4.1.0'));
  });

  test('extractParitalWithAttribute', () => {
    expect.assertions(1);
    return semverah.then(semverishSuper => semverishSuper.extractSemverishFromPath('4.1.entity'))
    .then(obj => expect(obj).toEqual('4.1'));
  });

  test('extractMoreParitalWithAttribute', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => semverishSuper.extractSemverishFromPath('4.entity'))
      .then(obj => expect(obj).toEqual('4'));
  });

  test('extractAttributeWithAlpha', () => {
    expect.assertions(1);
    return semverah
    .then((semverishSuper) => {
      semverishSuper.setPreReleasePattern();
      return semverishSuper.extractSemverishFromPath('4.1.0-alpha.entity');
    }).then(obj => expect(obj).toEqual('4.1.0-alpha'));
  });

  test('extractAttributeWithAlpha1', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setPreReleasePattern();
      return semverishSuper.extractSemverishFromPath('4.1.0-alpha.0');
    }).then(obj => expect(obj).toEqual('4.1.0-alpha.0'));
  });

  test('extractAttributeWithAlphaAndNumber', () => {
    expect.assertions(1);
    return semverah.then(semverishSuper => semverishSuper.extractSemverishFromPath('4.1.0-alpha.0.entity'))
    .then(obj => expect(obj).toEqual('4.1.0-alpha.0'));
  });

  test('setSourceBadSourceLeading0', () => {
    expect.assertions(1);
    return semverah.then(semverishSuper => semverishSuper.extractSemverishFromPath('4.1.0-alpha.0entity'))
      .catch((e) => {
        expect(e.message).toEqual('The semverish value must be able to be converted to a semver value.' +
          ' SemveristElement names can not have leading 0s.');
      });
  });

  test('setSourceBadSourceLeading0DeepPath', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.extractSemverishFromPath('4.1.0-alpha.0entity.attribute');
    })
      .catch((e) => {
        expect(e.message).toEqual('The semverish value must be able to be converted to a semver value. SemveristElement names can not have leading 0s.');
      });
  });

  test('setSourceBadSource', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.extractSemverishFromPath('entity');
    })
      .catch((e) => {
        expect(e.message).toEqual('The semverish value must be able to be converted to a semver value.' +
          ' Unable to compare version string: entity');
      });
  });

  test('extractDifferentBadValue', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.extractSemverishFromPath('entity.0');
    })
    .catch((e) => {
      expect(e.message).toEqual('The semverish value must be able to be converted to a semver value. ' +
          'Unable to compare version string: entity.');
    });
  });

  test('extractTooManySemverWithoutPrerelease', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.extractSemverishFromPath('4.0.0.0');
    })
      .catch((e) => {
        expect(e.message).toEqual('The semverish value must be able to be converted to a semver ' +
          'value. Unable to compare version string: 4.0.0.0');
      });
  });


  test('extractSemverPartsFromTooManyPeriods', () => {
    expect.assertions(1);
    return semverah.then(semverishSuper => semverishSuper.extractSemverishFromPath('4.1.'))
    .then(obj => expect(obj).toEqual('4.1'));
  });

  test('extractSemverPartsFromLeadingPeriods', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.extractSemverishFromPath('.1.');
    })
      .catch((e) => {
        expect(e.message).toEqual('The semverish value must be able to be converted to a semver value. ' +
          'The semverish value must have atleast a major portion.');
      });
  });

  test('Very bad semverish', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.extractSemverishFromPath('1.1.entity......1');
    })
      .catch((e) => {
        expect(e.message).toEqual('The semverish value must be able to be converted to a semver value. ' +
          'There was a problem with your semverish path and the regex pattern used ' +
          'to identify your prereleases.');
      });
  });
});
