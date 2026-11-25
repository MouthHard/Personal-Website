module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // 只引入 prettier 的格式冲突消解规则（等价于 eslint-config-prettier）；
    // 不用 plugin:prettier/recommended，因为本项目关闭了 prettier/prettier 检查，
    // 保留插件却关闭其核心规则会造成配置矛盾。格式化由 npm run format 单独负责。
    "prettier",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2022,
    sourceType: "module",
  },
  // 构建产物与覆盖率报告不参与 lint：
  // 本地存在 dist/ 时，`npm run lint` 会把压缩后的产物当成源码检查，产生数千条无意义错误。
  // CI 是干净检出所以看不出问题，但本地会一直红。
  ignorePatterns: ["dist/**", "node_modules/**", "coverage/**"],
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "prettier/prettier": "off",
    // 放宽 Vue 模板格式化
    "vue/max-attributes-per-line": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/first-attribute-linebreak": "off",
    "vue/attribute-hyphenation": "off",
  },
};
