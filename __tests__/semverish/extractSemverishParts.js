'use strict';

const semverishFactory = require('../../lib/semverish/semverish');

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
    expect(semverah.then((semverishSuper) => {
      return semverishSuper.extractSemverishFromPath('4.1.0');
    })).resolves.toEqual('4.1.0');
  });

  test('extractSemverMinorSemverOnly', () => {
    expect(semverah.then((semverishSuper) => {
      return semverishSuper.extractSemverishFromPath('4.1');
    })).resolves.toEqual('4.1');
  });

  test('extractSemverAlpha', () => {
    expect(semverah.then((semverishSuper) => {
      return semverishSuper.extractSemverishFromPath('4.1.0-alpha');
    })).resolves.toEqual('4.1.0-alpha');
  });

  test('extractSemverAlphaDotVersion', () => {
    expect(semverah.then((semverishSuper) => {
      return semverishSuper.extractSemverishFromPath('4.1.0-alpha.1');
    })).resolves.toEqual('4.1.0-alpha.1');
  });

  test('extractSemverDeathStar', () => {
    expect(semverah.then((semverishSuper) => {
      return semverishSuper.extractSemverishFromPath('4.1.0-deathstar.1');
    })).resolves.toEqual('4.1.0-deathstar.1');
  });

  test('extractWithAttribute', () => {
    expect(semverah.then((semverishSuper) => {
      return semverishSuper.extractSemverishFromPath('4.1.0.entity');
    })).resolves.toEqual('4.1.0');
  });

  test('extractParitalWithAttribute', () => {
    expect(semverah.then((semverishSuper) => {
      return semverishSuper.extractSemverishFromPath('4.1.entity');
    })).resolves.toEqual('4.1');
  });

  test('extractMoreParitalWithAttribute', () => {
    expect(semverah.then((semverishSuper) => {
      return semverishSuper.extractSemverishFromPath('4.entity');
    })).resolves.toEqual('4');
  });

  test('extractAttributeWithAlpha', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setPreReleasePattern();
      return semverishSuper.extractSemverishFromPath('4.1.0-alpha.entity');
    })).resolves.toEqual('4.1.0-alpha');
  });

  test('extractAttributeWithAlpha1', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setPreReleasePattern();
      return semverishSuper.extractSemverishFromPath('4.1.0-alpha.0');
    })).resolves.toEqual('4.1.0-alpha.0');
  });

  test('extractAttributeWithAlphaAndNumber', () => {
    expect(semverah.then((semverishSuper) => {
      return semverishSuper.extractSemverishFromPath('4.1.0-alpha.0.entity');
    })).resolves.toEqual('4.1.0-alpha.0');
  });

  test('setSourceBadSourceLeading0', () => {
    semverah.then(semverishSuper => semverishSuper.extractSemverishFromPath('4.1.0-alpha.0entity'))
      .catch((e) => {
        expect(e.message).toEqual('The semverish value must be able to be converted to a semver value.' +
          ' SemveristElement names can not have leading 0s.');
      });
  });

  test('setSourceBadSourceLeading0DeepPath', () => {
    semverah.then((semverishSuper) => {
      semverishSuper.extractSemverishFromPath('4.1.0-alpha.0entity.attribute');
    })
      .catch((e) => {
        expect(e.message).toEqual('The semverish value must be able to be converted to a semver value. SemveristElement names can not have leading 0s.');
      });
  });

  test('setSourceBadSource', () => {
    semverah.then((semverishSuper) => {
      semverishSuper.extractSemverishFromPath('entity');
    })
      .catch((e) => {
        expect(e.message).toEqual('The semverish value must be able to be converted to a semver value.' +
          ' Unable to compare version string: entity');
      });
  });

  test('extractDifferentBadValue', () => {
    semverah.then((semverishSuper) => {
      semverishSuper.extractSemverishFromPath('entity.0');
    })
    .catch((e) => {
      expect(e.message).toEqual('The semverish value must be able to be converted to a semver value. ' +
          'Unable to compare version string: entity.');
    });
  });

  test('extractTooManySemverWithoutPrerelease', () => {
    semverah.then((semverishSuper) => {
      semverishSuper.extractSemverishFromPath('4.0.0.0');
    })
      .catch((e) => {
        expect(e.message).toEqual('The semverish value must be able to be converted to a semver ' +
          'value. Unable to compare version string: 4.0.0.0');
      });
  });


  test('extractSemverPartsFromTooManyPeriods', () => {
    expect(semverah.then((semverishSuper) => {
      return semverishSuper.extractSemverishFromPath('4.1.');
    })).resolves.toEqual('4.1');
  });

  test('extractSemverPartsFromLeadingPeriods', () => {
    semverah.then((semverishSuper) => {
      semverishSuper.extractSemverishFromPath('.1.');
    })
      .catch((e) => {
        expect(e.message).toEqual('The semverish value must be able to be converted to a semver value. ' +
          'The semverish value must have atleast a major portion.');
      });
  });

  test('Very bad semverish', () => {
    semverah.then((semverishSuper) => {
      semverishSuper.extractSemverishFromPath('1.1.entity......1');
    })
      .catch((e) => {
        expect(e.message).toEqual('The semverish value must be able to be converted to a semver value. ' +
          'There was a problem with your semverish path and the regex pattern used ' +
          'to identify your prereleases.');
      });
  });
});