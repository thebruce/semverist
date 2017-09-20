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
  test('semverishLevelBuildWithEntity', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('4.0.0-alpha.0+build124.entity');
      semverishSuper.setSemverishLevel();
      return semverishSuper.getSemverishLevel();
    })).resolves.toEqual('build');
  });

  test('semverishLevelBuildNoEntity', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('4.0.0-alpha.0+build124');
      semverishSuper.setSemverishLevel();
      return semverishSuper.getSemverishLevel();
    })).resolves.toEqual('build');
  });

  test('semverishLevelPrerelease0WithEntity', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('4.0.0-alpha.0.entity');
      semverishSuper.setSemverishLevel();
      return semverishSuper.getSemverishLevel();
    })).resolves.toEqual('prerelease');
  });

  test('semverishLevelPrereleaseWithEntity', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('4.0.0-alpha.entity');
      semverishSuper.setSemverishLevel();
      return semverishSuper.getSemverishLevel();
    })).resolves.toEqual('prerelease');
  });

  test('semverishLevelPrereleaseNoEntity', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('4.0.0-alpha');
      semverishSuper.setSemverishLevel();
      return semverishSuper.getSemverishLevel();
    })).resolves.toEqual('prerelease');
  });

  test('semverishLevelPatchWithEntity', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('4.0.0.entity');
      semverishSuper.setSemverishLevel();
      return semverishSuper.getSemverishLevel();
    })).resolves.toEqual('patch');
  });

  test('semverishLevelPatchNoEntity', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('4.0.0');
      semverishSuper.setSemverishLevel();
      return semverishSuper.getSemverishLevel();
    })).resolves.toEqual('patch');
  });

  test('semverishLevelMinorWithEntity', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('4.0.entity');
      semverishSuper.setSemverishLevel();
      return semverishSuper.getSemverishLevel();
    })).resolves.toEqual('minor');
  });

  test('semverishLevelMinorNoEntity', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('4.0');
      semverishSuper.setSemverishLevel();
      return semverishSuper.getSemverishLevel();
    })).resolves.toEqual('minor');
  });

  test('semverishLevelMajorrWithEntity', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('4.entity');
      semverishSuper.setSemverishLevel();
      return semverishSuper.getSemverishLevel();
    })).resolves.toEqual('major');
  });

  test('semverishLevelMajorNoEntity', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemverish('4');
      semverishSuper.setSemverishLevel();
      return semverishSuper.getSemverishLevel();
    })).resolves.toEqual('major');
  });
});
