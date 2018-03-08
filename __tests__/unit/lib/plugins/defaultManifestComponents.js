

class manifestBase {
  getConverterGroups() {}
  addManifestCompinentItem() {}
  manifestCapability() {}
  getConfig() {}
  getConverter() {}
  addItemAlters() {}
}

const DefaultManifestComponents = require('../../../../lib/mixins/manifest/defaultManifestComponents');

let tmpMocks = [];

describe('Default manifest components', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
  });

  test('getItemGAlters Defaults', () => {
    expect.assertions(1);
    tmpMocks.push(jest.spyOn(manifestBase.prototype, 'getConverter').mockReturnValue({ default: {} }));
    tmpMocks.push(jest.spyOn(manifestBase.prototype, 'addItemAlters'));
    const group = new (DefaultManifestComponents(manifestBase))();
    group.addItemAlters('1.0.0', { semveristElement: 'item' });
    expect(manifestBase.prototype.addItemAlters).toHaveBeenCalled();
  });
});
