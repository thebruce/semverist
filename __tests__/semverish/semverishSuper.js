'use strict';

const semverishFactory = require('../../lib/semverish/semverish');

let tmpMocks = [];
let semverah;

describe('Range tests', () => {
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
  test('setOriginalSemverishValue', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setOriginalSemverishValue('1.0');
      return semverishSuper.getOriginalSemverishValue();
    })).resolves.toEqual('1.0');
  });

  test('setSemver', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0');
      return semverishSuper.getSemver();
    })).resolves.toEqual('1.0.0');
  });

  test('setSemverishElementMinorLevel', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('1.0.episode');
      semverishSuper.setSemveristElement('1.0.episode');
      return semverishSuper.getSemveristElement();
    })).resolves.toEqual('episode');
  });

  test('setSemverishElementMajorLevel', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('1.entity');
      semverishSuper.setSemveristElement('1.entity');
      return semverishSuper.getSemveristElement();
    })).resolves.toEqual('entity');
  });

  test('setSemverishElementPatchLevel', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('1.0.0.entity');
      semverishSuper.setSemveristElement('1.0.0.entity');
      return semverishSuper.getSemveristElement();
    })).resolves.toEqual('entity');
  });

  test('setSemverishElementMajorLevelDeepProperty', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('1.0.0.entity.property');
      semverishSuper.setSemveristElement('1.0.0.episode.property');
      return semverishSuper.getSemveristElement();
    })).resolves.toEqual('episode');
  });

  test('setSemverishElementMajorLevelGetRaw', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('1.0.0.entity.property');
      semverishSuper.setSemveristElement('1.0.0.episode.property');
      return semverishSuper.getRawSemveristElement();
    })).resolves.toEqual([
      'episode',
      'property'
    ]);
  });

  test('setIsPrereleasePath', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0');
      semverishSuper.setSemverParsed('1.0.0');
      semverishSuper.setIsPreReleasePath();
      return semverishSuper.getIsPreReleasePath();
    })).resolves.toEqual(false);
  });

  test('setIsPrereleasePathNoParsed', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0');
      semverishSuper.setIsPreReleasePath();
      return semverishSuper.getIsPreReleasePath();
    })).resolves.toEqual(false);
  });

  test('setIsPrereleaseNoParsedNoSemver', () => {
    semverah.then((semverishSuper) => {
      semverishSuper.setIsPreReleasePath();
    })
    .catch((e) => {
      expect(e.message).toEqual('There is no semver value to check for prerelease.');
    });
  });

  test('init', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.init('4.1.entity');
      return semverishSuper.getSemverishArray();
    })).resolves.toEqual([
      '4',
      '1',
      'entity'
    ]);
  });

  test('init full semver', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.init('4.1.0');
      return semverishSuper.getSemverishArray();
    })).resolves.toEqual([
      '4',
      '1',
      '0'
    ]);
  });

  test('No plugin', () => {
    expect(semverah = semverishFactory('semverist')
    .then(SemverishSuperClass => new SemverishSuperClass())
      .then((semverishSuper) => {
        if (semverishSuper.despecifySemver) {
          return 'exists';
        }
        return 'notExist';
      })
    ).resolves.toEqual('notExist');
  });
});
