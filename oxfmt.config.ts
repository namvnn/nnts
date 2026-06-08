import { defineConfig } from 'oxfmt';

export default defineConfig({
    singleQuote: true,
    printWidth: 80,
    sortPackageJson: {
        sortScripts: true,
    },
    sortImports: {
        customGroups: [
            {
                groupName: 'react',
                elementNamePattern: ['react', 'react-**'],
            },
        ],
        groups: [
            'builtin',
            'react',
            { newlinesBetween: false },
            'external',
            ['internal', 'subpath'],
            ['parent', 'sibling', 'index'],
            'style',
            'unknown',
        ],
    },
    ignorePatterns: ['LICENSE.md', 'pnpm-lock.yaml', 'pnpm-workspace.yaml'],
});
