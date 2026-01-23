module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react', 'react-refresh', 'unused-imports'],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
            "warn",
            { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
        ],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-empty-interface": "warn",
        "@typescript-eslint/no-inferrable-types": "warn",
        "prefer-const": "warn",
        "@typescript-eslint/ban-ts-comment": "warn",
        "@typescript-eslint/no-require-imports": "warn",
        "react/prop-types": "off",
        "react/no-unescaped-entities": "warn",
        "react/no-unknown-property": "warn"
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
}
