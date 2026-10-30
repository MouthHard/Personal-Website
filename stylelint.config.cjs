module.exports = {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['use', 'forward', 'tailwind'] }],
    'selector-class-pattern': null,
    'no-descending-specificity': null,
  },
};