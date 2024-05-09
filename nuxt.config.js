import { defineNuxtConfig } from "nuxt/config"
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify"

export default defineNuxtConfig({
  aos: {
    duration: 800,
    easing: "ease-in-out",
    mirror: false,
    offset: 100,
    once: true
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" }
  },
  build: {
    transpile: [ "vuetify" ],
  },
  css: [ "~/assets/styles/main.scss" ],
  device: {
    refreshOnResize: true
  },
  devtools: {
    enabled: true,
    telemetry: false,
    timeline: { enabled: true }
  },
  eslint: {
    config: {
      stylistic: {
        "array-bracket-newline": [ "error", { multiline: true }],
        "array-bracket-spacing": [ "error", "always", { objectsInArrays: false, arraysInArrays: false }],
        "array-element-newline": [ "error", "consistent" ],
        "arrow-parens": [ "error", "always" ],
        "arrow-spacing": [ "error", { before: true, after: true }],
        "block-spacing": [ "error", "always" ],
        "brace-style": [ "error", "1tbs", { allowSingleLine: true }],
        "commaDangle": [ "error", "only-multiline" ],
        "comma-spacing": [ "error", { before: false, after: true }],
        "comma-style": [ "error", "last" ],
        "computed-property-spacing": [ "error", "never" ],
        "dot-location": [ "error", "property" ],
        "eol-last": [ "error", "always" ],
        "function-call-argument-newline": [ "error", "consistent" ],
        "function-call-spacing": [ "error", "never" ],
        "function-paren-newline": [ "error", "multiline" ],
        "generator-star-spacing": [ "error", { before: true, after: false }],
        "implicit-arrow-linebreak": [ "error", "beside" ],
        "indent": [ "error", 2, { SwitchCase: 1, VariableDeclarator: "first", outerIIFEBody: 1, MemberExpression: 1, FunctionDeclaration: { parameters: "first", body: 1 }, FunctionExpression: { parameters: "first", body: 1 }, StaticBlock: { body: 1 }, CallExpression: { arguments: "first" }, ArrayExpression: "first", ObjectExpression: "first", ImportDeclaration: "first", flatTernaryExpressions: false, offsetTernaryExpressions: true, ignoreComments: true }],
        "indent-binary-ops": [ "error", 2 ],
        "key-spacing": [ "error", { beforeColon: false, afterColon: true, mode: "strict" }],
        "keyword-spacing": [ "error", { before: true, after: true }],
        "linebreak-style": [ "error", "unix" ],
        "line-comment-position": [ "error", { position: "above" }],
        "lines-around-comment": [ "error", { beforeBlockComment: true, afterBlockComment: false, beforeLineComment: false, afterLineComment: false, allowBlockStart: true, allowBlockEnd: false, allowObjectStart: true, allowObjectEnd: false, allowArrayStart: true, allowArrayEnd: false, allowClassStart: true, allowClassEnd: false }],
        "lines-between-class-members": [ "error", "always", { exceptAfterSingleLine: true }],
        "multi-line-comment-style": [ "error", "starred-block" ],
        "multiline-ternary": [ "error", "always-multiline" ],
        "new-parens": [ "error", "always" ],
        "newline-per-chained-call": [ "error", { ignoreChainWithDepth: 3 }],
        "no-confusing-arrow": [ "error", { allowParens: true }],
        "no-floating-decimal": "error",
        "no-mixed-operators": "error",
        "no-mixed-spaces-and-tabs": "error",
        "no-multi-spaces": "error",
        "no-multiple-empty-lines": [ "error", { max: 2, maxEOF: 1, maxBOF: 0 }],
        "no-tabs": "error",
        "no-trailing-spaces": "error",
        "no-whitespace-before-property": "error",
        "object-curly-spacing": [ "error", "always" ],
        "operator-linebreak": [ "error", "before" ],
        "padded-blocks": [ "error", "never" ],
        "padding-line-between-statements": [
          "error",
          { blankLine: "always", prev: "*", next: [ "throw", "return" ] },
          { blankLine: "always", prev: [ "const", "let", "var" ], next: "*" },
          { blankLine: "any", prev: [ "const", "let", "var" ], next: [ "const", "let", "var" ] },
          { blankLine: "always", prev: "*", next: [ "if", "for", "function", "class", "switch", "while", "with" ] }
        ],
        "quote-props": [ "error", "consistent-as-needed" ],
        "quotes": [ "error", "double" ],
        "rest-spread-spacing": [ "error", "never" ],
        "semi": [ "error", "never" ],
        "space-before-blocks": [ "error", "always" ],
        "space-before-function-paren": [ "error", { anonymous: "always", named: "never", asyncArrow: "always" }],
        "space-in-parens": [ "error", "never" ],
        "space-infix-ops": "error",
        "space-unary-ops": [ "error", { words: true, nonwords: false }],
        "spaced-comment": [ "error", "always" ],
        "switch-colon-spacing": [ "error", { after: true, before: false }],
        "template-curly-spacing": [ "error", "never" ],
        "template-tag-spacing": [ "error", "never" ],
        "type-annotation-spacing": [ "error", { before: false, after: true }],
        "type-generic-spacing": "error",
        "wrap-iife": [ "error", "outside" ],
        "wrap-regex": "error",
        "yield-star-spacing": [ "error", "before" ]
      }
    }
  },
  googleFonts: {
    display: "swap",
    download: true,
    families: {
      "Fira+Code": true,
      "Inter": true,
      "Nunito": true
    },
    inject: true,
    preconnect: true,
    prefetch: true
  },
  i18n: {
    defaultLocale: "fr",
    detectBrowserLanguage: {
      cookieKey: "i18n_lang",
      fallbackLocale: "fr",
      useCookie: true
    },
    locales: [ "en", "fr" ],
    strategy: "no_prefix"
  },
  image: {
    format: [ "webp", "png", "gif" ],
    quality: 100
  },
  linkChecker: {
    failOnError: false,
    report: {
      html: true,
      markdown: true
    },
    runOnBuild: true,
    showLiveInspections: true
  },
  lodash: {
    prefix: "ldsh",
    prefixSkip: false,
    upperAfterPrefix: true
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    "@nuxt/devtools",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/device",
    "@nuxtjs/google-fonts",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
    "@vueuse/nuxt",
    "nuxt-aos",
    "nuxt-icon",
    "nuxt-link-checker",
    "nuxt-lodash",
    // "nuxt-mail"
  ],
  nitro: {
    esbuild: {
      options: {
        target: "esnext"
      }
    }
  },
  plugins: [
    {
      src: "~/plugins/vuetify"
    }
  ],
  ssr: false,
  telemetry: false,
  vite: {
    vue: {
      template: { transformAssetUrls }
    }
  }
})
