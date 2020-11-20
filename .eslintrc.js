module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript'
  ],
  rules: {
    'jsx-a11y/click-events-have-key-events': 0,
    'react/jsx-props-no-spreading': 0,

    'no-restricted-globals': 0,
    'comma-dangle': ['error', 'never'],
    'no-param-reassign': 0,
  }
}
