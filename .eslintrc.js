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
    'comma-dangle': ['error', 'never'],
    'no-param-reassign': 0,
  }
}
