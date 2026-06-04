import globals from "globals";
import { defineConfig } from "eslint/config";
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'

export default defineConfig([
  js.configs.recommended,
  { files: ["**/*.js"], 
    languageOptions: { 
      sourceType: "commonjs",
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 4],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
    }, 
  },
  { files: ["**/*.{js,mjs,cjs}"], 
    languageOptions: { 
      globals: globals.node 
    } 
  },
]);
