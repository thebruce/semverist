const semverishFactory = require('../../../lib/semverish/semverish');
let tmpMocks = [];
let semverah;

describe('Check semverish Level', () => {
  beforeEach(() => {
    semverah = semverishFactory('semverist', 'semverish').then(
      SemverishSuperClass => new SemverishSuperClass()
    );
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('semverishLevelBuildWithEntity', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('4.0.0-alpha.0+build124.entity');
        semverishSuper.setSemverishLevel();
        return semverishSuper.getSemverishLevel();
      })
      .then(obj => expect(obj).toEqual('build'));
  });

  test('semverishLevelBuildNoEntity', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('4.0.0-alpha.0+build124');
        semverishSuper.setSemverishLevel();
        return semverishSuper.getSemverishLevel();
      })
      .then(obj => expect(obj).toEqual('build'));
  });

  test('semverishLevelPrerelease0WithEntity', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('4.0.0-alpha.0.entity');
        semverishSuper.setSemverishLevel();
        return semverishSuper.getSemverishLevel();
      })
      .then(obj => expect(obj).toEqual('prerelease'));
  });

  test('semverishLevelPrereleaseWithEntity', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('4.0.0-alpha.entity');
        semverishSuper.setSemverishLevel();
        return semverishSuper.getSemverishLevel();
      })
      .then(obj => expect(obj).toEqual('prerelease'));
  });

  test('semverishLevelPrereleaseNoEntity', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('4.0.0-alpha');
        semverishSuper.setSemverishLevel();
        return semverishSuper.getSemverishLevel();
      })
      .then(obj => expect(obj).toEqual('prerelease'));
  });

  test('semverishLevelPatchWithEntity', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('4.0.0.entity');
        semverishSuper.setSemverishLevel();
        return semverishSuper.getSemverishLevel();
      })
      .then(obj => expect(obj).toEqual('patch'));
  });

  test('semverishLevelPatchNoEntity', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('4.0.0');
        semverishSuper.setSemverishLevel();
        return semverishSuper.getSemverishLevel();
      })
      .then(obj => expect(obj).toEqual('patch'));
  });

  test('semverishLevelMinorWithEntity', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('4.0.entity');
        semverishSuper.setSemverishLevel();
        return semverishSuper.getSemverishLevel();
      })
      .then(obj => expect(obj).toEqual('minor'));
  });

  test('semverishLevelMinorNoEntity', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('4.0');
        semverishSuper.setSemverishLevel();
        return semverishSuper.getSemverishLevel();
      })
      .then(obj => expect(obj).toEqual('minor'));
  });

  test('semverishLevelMajorrWithEntity', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('4.entity');
        semverishSuper.setSemverishLevel();
        return semverishSuper.getSemverishLevel();
      })
      .then(obj => expect(obj).toEqual('major'));
  });

  test('semverishLevelMajorNoEntity', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('4');
        semverishSuper.setSemverishLevel();
        return semverishSuper.getSemverishLevel();
      })
      .then(obj => expect(obj).toEqual('major'));
  });
});
