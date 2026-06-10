import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: ['packages/*'],
        coverage: {
            provider: 'v8',
            include: ['packages/**/*.{ts,tsx}'],
            exclude: [
                '**/*.d.ts',
                '**/*.{test,test-d}.{ts,tsx}',
                '**/dist/**',
                '**/node_modules/**',
                '**/tsdown.config.ts',
                '**/vite.config.ts',
                '**/vitest.config.ts',
            ],
            thresholds: {
                'packages/**/*.{ts,tsx}': {
                    '100': true,
                },
            },
        },
    },
});
