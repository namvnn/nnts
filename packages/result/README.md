# `@nnts/result`

A lightweight `Result` type inspired by Rust.

`Result` represents either:

- `Ok` containing a success value
- `Err` containing an error value

This enables explicit, type-safe error handling without exceptions.

## Usage

### Creating and checking `Result`

```ts
import { ok, err, isOk, isErr, Result } from '@nnts/result';

const success: Result<number, string> = ok(42);
const failure: Result<number, string> = err('Something went wrong');

if (isOk(success)) {
    console.log('Success value:', success.value);
}

if (isErr(failure)) {
    console.log('Error value:', failure.error);
}
```

### Pattern Matching

```ts
import { match } from '@nnts/result';

const result = ok(42);

const message = match(result, {
    ok: (value) => `Got value: ${value}`,
    err: (error) => `Got error: ${error}`,
});

console.log(message);
// Got value: 42
```

### Unwrapping `Result`

`unwrap` and `unwrapErr` are unsafe operations. They throw a `PanicResultError`
when called on the `Err` variant.

```ts
import { ok, err, unwrap, unwrapErr, PanicResultError } from '@nnts/result';

try {
    const value = unwrap(ok(42));
    console.log(value); // 42

    const error = unwrapErr(err('Something went wrong'));
    console.log(error); // Something went wrong
} catch (error) {
    if (error instanceof PanicResultError) {
        console.error(error.message);
    }
}
```

### Capturing sync errors with `tryCatch`

Wrap synchronous operations that may throw.

```ts
import { tryCatch, match } from '@nnts/result';

const result = tryCatch(() => JSON.parse('{"name":"Alice"}'));

match(result, {
    ok: (value) => {
        console.log('Parsed:', value);
    },
    err: (error) => {
        console.error('Parse failed:', error);
    },
});
```

### Capturing async errors with `tryCatchAsync`

Wrap asynchronous operations that may reject or throw.

```ts
import { tryCatchAsync, match } from '@nnts/result';

const result = await tryCatchAsync(async () => {
    const response = await fetch('https://api.example.com/users');
    return response.json();
});

match(result, {
    ok: (data) => {
        console.log('Fetched data:', data);
    },
    err: (error) => {
        console.error('Request failed:', error);
    },
});
```

## Author

Nam Nguyen <https://github.com/namvnn>

## License

[MIT](../../LICENSE)
