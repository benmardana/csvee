module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'prettier', 'react-hooks', '@typescript-eslint'],
  rules: {
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': [
      'error',
      {
        js: 'never',
        actions: 'always',
        graphql: 'always',
        png: 'always',
        css: 'always',
        scss: 'always',
        svg: 'always',
      },
    ],
    'import/no-named-as-default': 'off',
    '@typescript-eslint/no-unused-vars': [
      2,
      {
        args: 'none',
        ignoreRestSiblings: true,
      },
    ],
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.tsx'] },
    ],
    'react/no-array-index-key': 0,
    'no-unused-expressions': ['off'],
    'no-unused-vars': ['off'],
    '@typescript-eslint/no-unused-expressions': [
      'error',
      { allowShortCircuit: true },
    ],
    'react/require-default-props': 'off',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-undef': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': ['error'],
  },
};
