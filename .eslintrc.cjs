module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "@nuxt/eslint-config",
    "eslint:recommended",
    "plugin:vuetify/base",
    "plugin:vue/vue3-essential",
    "standard"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "arrow-parens": 0,
    "generator-star-spacing": 0,
    "space-before-function-paren": "off",
    "vue/multi-word-component-names": "off"
  }
}
