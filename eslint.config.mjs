import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import html from "eslint-plugin-html";

export default defineConfig([
  {
    files: ["www/**/*.html"],
    plugins: {
      html
    }
  },
  { files: ["www/js/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser }},
  { ignores: ["www/js/sqlite/**", "www/lib/**"] }
]);
