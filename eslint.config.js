import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


export default [
    {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
    {languageOptions: 
        { globals: 
        { ...globals.browser, ...globals.node} 
        }
    },
    {settings: {
            react: {
                version: "detect", // Automatically pick the version you have installed
            },
        }
    },
    {rules: {
        "@typescript-eslint/no-unused-expressions": "off", // Disables the rule globally
      }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
];