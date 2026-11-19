module.exports = {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['use', 'forward', 'tailwind'] }],
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    // Vue scoped 样式使用的 :deep() / :global() 是编译期伪类，交由 Vue 处理，stylelint 不应报错
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['deep', 'global'] }],
    // 颜色写法：源码已统一为现代 rgb(r g b / a) 形式。
    // 该 stylelint 版本下 color-function-notation 与 alpha-value-notation 的 autofix 目标互相冲突
    // （一个产出小数 alpha、一个要求百分比），会导致 --fix 反复震荡、每次都产生数百条无法收敛的告警。
    // 关闭这两条可自动修复但互相打架的格式规则，保留实际有意义的语义类规则。
    'color-function-alias-notation': null,
    'color-function-notation': null,
    'alpha-value-notation': null,
    // keyframes 采用驼峰命名，与既有动画名保持一致
    'keyframes-name-pattern': null,
    // 装饰性 SCSS 中允许单行多声明以保持视觉层级紧凑
    'declaration-block-single-line-max-declarations': null,
  },
};