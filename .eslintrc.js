module.exports = {
    extends: [
        '@socifi',
    ],
    env: {
        serviceworker: true,
    },
    rules: {
        'array-func/prefer-array-from': 0,
        'no-restricted-globals': 0,
    },
    settings: {
        polyfills: [
            'fetch',
            'promises',
        ],
    },
    globals: {
        self: true,
    },
};
