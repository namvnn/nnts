import type { Err, Ok, Result } from './index';
import {
    ok,
    err,
    isOk,
    isErr,
    tryCatch,
    tryCatchAsync,
    unwrap,
    PanicResultError,
    unwrapErr,
    match,
} from './index';

describe('ok', () => {
    it('creates an Ok result', () => {
        const result = ok(42);

        expectTypeOf(result).toEqualTypeOf<Ok<number>>();
        expect(result).toEqual({ type: 'Ok', value: 42 });
    });
});

describe('err', () => {
    it('creates an Err result', () => {
        const result = err('failure');

        expectTypeOf(result).toEqualTypeOf<Err<string>>();
        expect(result).toEqual({ type: 'Err', error: 'failure' });
    });
});

describe('isOk', () => {
    it('returns true for Ok', () => {
        const result: Result<number, string> = ok(1);

        expect(isOk(result)).toBe(true);
    });

    it('returns false for Err', () => {
        const result: Result<number, string> = err('nope');

        expect(isOk(result)).toBe(false);
    });
});

describe('isErr', () => {
    it('returns true for Err', () => {
        const result: Result<number, string> = err('nope');

        expect(isErr(result)).toBe(true);
    });

    it('returns false for Ok', () => {
        const result: Result<number, string> = ok(1);

        expect(isErr(result)).toBe(false);
    });
});

describe('unwrap', () => {
    it('returns value when Ok', () => {
        const result = ok('success');

        expect(unwrap(result)).toBe('success');
    });

    it('throws PanicResultError when Err', () => {
        const result = err('boom');

        expect(() => unwrap(result)).toThrow(PanicResultError);
        expect(() => unwrap(result)).toThrow('Unhandled Err result: boom');
    });
});

describe('unwrap_err', () => {
    it('returns error when Err', () => {
        const result = err('failure');

        expect(unwrapErr(result)).toBe('failure');
    });

    it('throws PanicResultError when Ok', () => {
        const result = ok(123);

        expect(() => unwrapErr(result)).toThrow(PanicResultError);
        expect(() => unwrapErr(result)).toThrow('Unhandled Ok result: 123');
    });
});

describe('match', () => {
    it('calls ok matcher when Ok', () => {
        const result = ok(5);

        const output = match(result, {
            ok: (value) => value * 2,
            err: () => 0,
        });

        expect(output).toBe(10);
    });

    it('calls err matcher when Err', () => {
        const result = err('nope');

        const output = match(result, {
            ok: () => 'ok',
            err: (error) => `error: ${error}`,
        });

        expect(output).toBe('error: nope');
    });
});

describe('tryCatch', () => {
    it('returns Ok when function succeeds', () => {
        const result = tryCatch(() => 123);

        expectTypeOf(result).toEqualTypeOf<Result<number, Error>>();
        expect(isOk(result)).toBe(true);
        expect((result as Ok<number>).value).toBe(123);
    });

    it('returns Err when function throws', () => {
        const result = tryCatch(() => {
            throw new Error('boom');
        });

        expectTypeOf(result).toEqualTypeOf<Result<never, Error>>();
        expect(isErr(result)).toBe(true);
        expect((result as Err<Error>).error).toBeInstanceOf(Error);
        expect((result as Err<Error>).error.message).toBe('boom');
    });
});

describe('tryCatchAsync', () => {
    it('returns Ok when promise resolves', async () => {
        const result = await tryCatchAsync(async () => Promise.resolve(123));

        expectTypeOf(result).toEqualTypeOf<Result<number, Error>>();
        expect(isOk(result)).toBe(true);
        expect((result as Ok<number>).value).toBe(123);
    });

    it('returns Err when promise rejects', async () => {
        const result = await tryCatchAsync(async () =>
            Promise.reject(new Error('async boom')),
        );

        expectTypeOf(result).toEqualTypeOf<Result<never, Error>>();
        expect(isErr(result)).toBe(true);
        expect((result as Err<Error>).error).toBeInstanceOf(Error);
        expect((result as Err<Error>).error.message).toBe('async boom');
    });
});
