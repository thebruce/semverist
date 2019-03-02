const semverishFactory = require('../../../lib/semverish/semverish');

let tmpMocks = [];
let semverah;

describe('Semverish Super tests.', () => {
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
  test('setOriginalSemverishValue', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setOriginalSemverishValue('1.0');
        return semverishSuper.getOriginalSemverishValue();
      })
      .then(obj => expect(obj).toEqual('1.0'));
  });

  test('setSemver', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemver('1.0.0');
        return semverishSuper.getSemver();
      })
      .then(obj => expect(obj).toEqual('1.0.0'));
  });

  test('setSemverishElementMinorLevel', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('1.0.episode');
        semverishSuper.setSemveristElement('1.0.episode');
        return semverishSuper.getSemveristElement();
      })
      .then(obj => expect(obj).toEqual('episode'));
  });

  test('setSemverishElementMajorLevel', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('1.entity');
        semverishSuper.setSemveristElement('1.entity');
        return semverishSuper.getSemveristElement();
      })
      .then(obj => expect(obj).toEqual('entity'));
  });

  test('setSemverishElementPatchLevel', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('1.0.0.entity');
        semverishSuper.setSemveristElement('1.0.0.entity');
        return semverishSuper.getSemveristElement();
      })
      .then(obj => expect(obj).toEqual('entity'));
  });

  test('setSemverishElementMajorLevelDeepProperty', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('1.0.0.entity.property');
        semverishSuper.setSemveristElement('1.0.0.episode.property');
        return semverishSuper.getSemveristElement();
      })
      .then(obj => expect(obj).toEqual('episode'));
  });

  test('setSemverishElementMajorLevelGetRaw', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('1.0.0.entity.property');
        semverishSuper.setSemveristElement('1.0.0.episode.property');
        return semverishSuper.getRawSemveristElement();
      })
      .then(obj => expect(obj).toEqual(['episode', 'property']));
  });

  test('setIsPrereleasePath', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemver('1.0.0');
        semverishSuper.setSemverParsed('1.0.0');
        semverishSuper.setIsPreReleasePath();
        return semverishSuper.getIsPreReleasePath();
      })
      .then(obj => expect(obj).toEqual(false));
  });

  test('setIsPrereleasePathNoParsed', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemver('1.0.0');
        semverishSuper.setIsPreReleasePath();
        return semverishSuper.getIsPreReleasePath();
      })
      .then(obj => expect(obj).toEqual(false));
  });

  test('setIsPrereleaseNoParsedNoSemver', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setIsPreReleasePath();
      })
      .catch(e => {
        expect(e.message).toEqual(
          'There is no semver value to check for prerelease.'
        );
      });
  });

  test('init', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.init('4.1.entity');
        return semverishSuper.getSemverishArray();
      })
      .then(obj => expect(obj).toEqual(['4', '1', 'entity']));
  });

  test('init full semver', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.init('4.1.0');
        return semverishSuper.getSemverishArray();
      })
      .then(obj => expect(obj).toEqual(['4', '1', '0']));
  });

  test('No plugin', () => {
    expect.assertions(1);
    return semverishFactory('semverist')
      .then(SemverishSuperClass => new SemverishSuperClass())
      .then(semverishSuper => {
        if (semverishSuper.despecifySemver) {
          return 'exists';
        }
        return 'notExist';
      })
      .then(obj => expect(obj).toEqual('notExist'));
  });
});
