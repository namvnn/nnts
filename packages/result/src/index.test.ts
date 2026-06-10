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
        const result: Result<number, string> = ok(42);

        expect(result).toEqual({ type: 'Ok', value: 42 });
    });
});

describe('err', () => {
    it('creates an Err result', () => {
        const result: Result<number, string> = err('failure');

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
        const result: Result<number, string> = ok(123);

        const output = unwrap(result);

        expectTypeOf(output).toEqualTypeOf<number>();
        expect(output).toBe(123);
    });

    it('throws PanicResultError when Err', () => {
        const result: Result<number, string> = err('boom');

        expect(() => unwrap(result)).toThrow(PanicResultError);
        expect(() => unwrap(result)).toThrow('Unhandled Err result: boom');
    });
});

describe('unwrapErr', () => {
    it('returns error when Err', () => {
        const result: Result<number, string> = err('failure');

        const output = unwrapErr(result);

        expectTypeOf(output).toEqualTypeOf<string>();
        expect(output).toBe('failure');
    });

    it('throws PanicResultError when Ok', () => {
        const result: Result<number, string> = ok(123);

        expect(() => unwrapErr(result)).toThrow(PanicResultError);
        expect(() => unwrapErr(result)).toThrow('Unhandled Ok result: 123');
    });
});

describe('match', () => {
    it('calls ok matcher when Ok', () => {
        const result: Result<number, string> = ok(5);

        const output = match(result, {
            ok: (value) => value * 2,
            err: () => 'error',
        });

        expectTypeOf(output).toEqualTypeOf<number | string>();
        expect(output).toBe(10);
    });

    it('calls err matcher when Err', () => {
        const result: Result<number, string> = err('nope');

        const output = match(result, {
            ok: () => 1,
            err: (error) => `error: ${error}`,
        });

        expectTypeOf(output).toEqualTypeOf<number | string>();
        expect(output).toBe('error: nope');
    });
});

describe('tryCatch', () => {
    it('returns Ok when function succeeds', () => {
        const result = tryCatch<number, Error>(() => 123);

        expectTypeOf(result).toEqualTypeOf<Result<number, Error>>();
        expect(isOk(result)).toBe(true);
        expect((result as Ok<number>).value).toBe(123);
    });

    it('returns Err when function throws', () => {
        const result = tryCatch<number, Error>(() => {
            throw new Error('boom');
        });

        expectTypeOf(result).toEqualTypeOf<Result<number, Error>>();
        expect(isErr(result)).toBe(true);
        expect((result as Err<Error>).error).toBeInstanceOf(Error);
        expect((result as Err<Error>).error.message).toBe('boom');
    });
});

describe('tryCatchAsync', () => {
    it('returns Ok when promise resolves', async () => {
        const result = await tryCatchAsync<number, Error>(async () =>
            Promise.resolve(123),
        );

        expectTypeOf(result).toEqualTypeOf<Result<number, Error>>();
        expect(isOk(result)).toBe(true);
        expect((result as Ok<number>).value).toBe(123);
    });

    it('returns Err when promise rejects', async () => {
        const result = await tryCatchAsync<string, Error>(async () =>
            Promise.reject(new Error('async boom')),
        );

        expectTypeOf(result).toEqualTypeOf<Result<string, Error>>();
        expect(isErr(result)).toBe(true);
        expect((result as Err<Error>).error).toBeInstanceOf(Error);
        expect((result as Err<Error>).error.message).toBe('async boom');
    });
});
