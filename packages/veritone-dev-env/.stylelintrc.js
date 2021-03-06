module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ],
    'no-eol-whitespace': null,
    'declaration-empty-line-before': null,
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ["import", "include", "mixin", "if"]
    }],
    'declaration-colon-newline-after': null // prettier conflict
  }
};
