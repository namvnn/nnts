import { hello } from './index';

test('returns a greeting with the provided name', () => {
    expect(hello('World')).toBe('Hello World!');
});
