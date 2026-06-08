import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        projects: ['packages/*'],
        coverage: {
            provider: 'v8',
            include: ['packages/**/*.{ts,tsx}'],
            exclude: [
                '**/*.d.ts',
                '**/*.test.{ts,tsx}',
                'tsdown.config.ts',
                'vitest.config.ts',
                'vite.config.ts',
            ],
            thresholds: {
                'packages/**/*.{ts,tsx}': {
                    '100': true,
                },
            },
        },
    },
});
