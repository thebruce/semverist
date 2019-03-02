const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  parser: 'babel-eslint',
  env: { node: true },
  plugins: ['prettier'],
  extends: ['problems', 'plugin:prettier/recommended'],
  overrides: [
    {
      files: [
        'lib/operations/**.test.js',
        'lib/operations/helpers/**.test.js',
        '**/*.mock.js',
        '__test__/**/*.js',
        'jest.setup.js',
      ],
      env: { jest: true },
    },
  ],
};
