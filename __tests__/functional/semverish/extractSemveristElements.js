const semverishFactory = require('../../../lib/semverish/semverish');

let tmpMocks = [];
let semverah;

describe('Extract semverist Elements.', () => {
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
  test('extractSemveristElementFromPath', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('4.0.0.entity');
        return semverishSuper.extractSemveristElementFromPath('4.0.0.entity');
      })
      .then(obj => expect(obj).toEqual('entity'));
  });

  test('extractSemveristElementBadPath', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('.0.0.entity');
        semverishSuper.extractSemveristElementFromPath('.0.0.entity');
      })
      .catch(e => {
        expect(e.message).toEqual(
          'The semverish value must be able to be converted to a semver value. The semverish value must have atleast a major portion.'
        );
      });
  });

  test('extractSemveristElementBadPath2', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('1.0.0.');
        return semverishSuper.extractSemveristElementFromPath('1.0.0.');
      })
      .then(obj => expect(obj).toEqual(''));
  });

  test('extractSemveristElementDeepPath', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('1.0.0.entity.property');
        return semverishSuper.extractSemveristElementFromPath(
          '1.0.0.entity.property'
        );
      })
      .then(obj => expect(obj).toEqual('entity.property'));
  });

  test('extractSemveristElementDeepPathAlpha', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('1.0.0-deathstar.entity.property');
        return semverishSuper.extractSemveristElementFromPath(
          '1.0.0-deathstar.entity.property'
        );
      })
      .then(obj => expect(obj).toEqual('entity.property'));
  });

  test('extractSemveristElementDeepPathAlpha0', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.setSemverish('1.0.0-deathstar.0.entity');
        return semverishSuper.extractSemveristElementFromPath(
          '1.0.0-deathstar.0.entity'
        );
      })
      .then(obj => expect(obj).toEqual('entity'));
  });

  test('extractSemveristElementNoSemverish', () => {
    expect.assertions(1);
    return semverah
      .then(semverishSuper => {
        semverishSuper.extractSemveristElementFromPath('1.0.0.entity');
      })
      .catch(e => {
        expect(e.message).toEqual(
          'You must have a semverish value set before extracting an element'
        );
      });
  });
});
