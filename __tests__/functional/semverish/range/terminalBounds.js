const rangeFactory = require('../../../../lib/semverish/range');
let tmpMocks = [];
let ranger;

describe('Terminal Bounds tests', () => {
  beforeEach(() => {
    ranger = rangeFactory('semverist', 'range');
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('terminalBounds', () => {
    expect.assertions(1);
    return ranger
      .then(RangeClass => {
        const rangeClass = new RangeClass();
        rangeClass.setLowerBounds('0.0.1');
        rangeClass.setTerminalBounds('0.0.9');
        return rangeClass.getTerminalBounds();
      })
      .then(obj => expect(obj).toEqual('0.0.9'));
  });

  test('terminalBoundsRange', () => {
    expect.assertions(1);
    return ranger
      .then(RangeClass => {
        const rangeClass = new RangeClass();
        rangeClass.setLowerBounds('0.0.1');
        rangeClass.setTerminalBounds('<0.0.9');
        return rangeClass.getTerminalBounds();
      })
      .then(obj => expect(obj).toEqual('<0.0.9'));
  });

  test('terminalBoundsInvalidRange', () => {
    expect.assertions(1);
    return ranger
      .then(RangeClass => {
        const rangeClass = new RangeClass();
        rangeClass.setLowerBounds('0.0.1');
        rangeClass.setTerminalBounds('1.R');
      })
      .catch(e => {
        expect(e.message).toEqual(
          'The passed range is not a valid semver range.'
        );
      });
  });
});
