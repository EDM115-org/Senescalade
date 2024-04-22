import globals from "globals"
import js from "@eslint/js"
import pluginVue from "eslint-plugin-vue"
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt(
  js.configs.recommended,
  pluginVue.configs["flat/recommended"],
  {
    ignores: ["**/node_modules/*", ".nuxt/*", ".output/*"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node
      }
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
)
