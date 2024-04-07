module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    "@nuxt/eslint-config",
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "standard"
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    "arrow-parens": 0,
    "comma-dangle": ["error", "only-multiline"],
    "generator-star-spacing": 0,
    quotes: ["error", "double"],
    "space-before-function-paren": "off",
    "vue/multi-word-component-names": "off"
  }
}
