module.exports = {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['use', 'forward', 'tailwind'] }],
    'selector-class-pattern': null,
    // App.vue 里的页面骨架 id（#mainPage / #curPageName / #tabContainer）是 camelCase 且被 JS 直接引用，
    // 不能为了规则改名，因此这里允许 camelCase 而非默认的 kebab-case。
    'selector-id-pattern': '^[a-z][a-zA-Z0-9-]*$',
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
    // 项目没有接入 autoprefixer，-webkit-/-moz- 前缀是手写的兼容层（Safari 的 backdrop-filter、
    // mask、line-clamp 等仍依赖它们）。开启该规则会 --fix 掉前缀，直接造成线上效果回退，故关闭。
    'property-no-vendor-prefix': null,
    // `(max-width: 768px)` 是当前项目统一的书写风格，改成 `(width <= 768px)` 只是语法换皮，
    // 对产出体积与兼容性无收益，且会制造数百处无意义 diff，故关闭。
    'media-feature-range-notation': null,
  },
};