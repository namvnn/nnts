/**
 * A type representing the success variant of {@link Result}.
 *
 * @typeParam V - The type of the success value.
 */
export type Ok<V> = {
    type: "Ok";
    value: V;
};
/**
 * A type representing the error variant of {@link Result}.
 *
 * @typeParam E - The type of the error value.
 */
export type Err<E> = {
    type: "Err";
    error: E;
};

/**
 * A type representing either a success ({@link Ok}) or an error ({@link Err}).
 *
 * @typeParam V - The success value type.
 * @typeParam E - The error value type.
 */
export type Result<V, E> = Ok<V> | Err<E>;

/**
 * Pattern-matching handlers for a {@link Result}.
 *
 * @typeParam V - The success value type.
 * @typeParam E - The error value type.
 * @typeParam R1 - The return type of the `ok` handler.
 * @typeParam R2 - The return type of the `err` handler.
 */
export type Matchers<V, E, R1, R2> = {
    /**
     * Called when the result is {@link Ok}.
     *
     * @param value - The success value.
     */
    ok(value: V): R1;

    /**
     * Called when the result is {@link Err}.
     *
     * @param error - The error value.
     */
    err(error: E): R2;
};

/**
 * Error thrown when attempting to unwrap a {@link Result} that is in the unexpected state.
 *
 * This is thrown by {@link unwrap} or {@link unwrapErr}.
 */
export class PanicResultError extends Error {
    /**
     * Creates a new {@link PanicResultError}.
     *
     * @param message - The error message.
     * @param options - The error options {@link ErrorOptions}.
     */
    public constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "PanicResultError";
    }
}

/**
 * Creates an {@link Ok} variant of {@link Result}.
 *
 * @typeParam V - The success value type.
 *
 * @param value - The success value.
 * @returns An {@link Ok} result.
 */
export const ok = <V>(value: V): Ok<V> => {
    return { type: "Ok", value };
};

/**
 * Creates an {@link Err} variant of {@link Result}.
 *
 * @typeParam E - The error value type.
 *
 * @param error - The error value.
 * @returns An {@link Err} result.
 */
export const err = <E>(error: E): Err<E> => {
    return { type: "Err", error };
};

/**
 * Checks whether a {@link Result} is {@link Ok}.
 *
 * @typeParam V - The success value type.
 * @typeParam E - The error value type.
 *
 * @param result - The result.
 * @returns `true` if the result is {@link Ok}.
 */
export const isOk = <V, E>(result: Result<V, E>): result is Ok<V> => {
    return result.type === "Ok";
};

/**
 * Checks whether a {@link Result} is {@link Err}.
 *
 * @typeParam V - The success value type.
 * @typeParam E - The error value type.
 *
 * @param result - The result.
 * @returns `true` if the result is {@link Err}.
 */
export const isErr = <V, E>(result: Result<V, E>): result is Err<E> => {
    return result.type === "Err";
};

/**
 * Unsafely extracts the success value from a {@link Result}.
 *
 * This function is unsafe. If the provided {@link Result} is {@link Err},
 * a {@link PanicResultError} will be thrown. Prefer using {@link match} when
 * the value is uncertain.
 *
 * @typeParam V - The success value type.
 * @typeParam E - The error value type.
 *
 * @param result - The result to unwrap.
 * @returns The success value.
 *
 * @throws {@link PanicResultError} if the result is {@link Err}.
 */
export const unwrap = <V, E>(result: Result<V, E>): V => {
    if (isOk(result)) {
        return result.value;
    }

    throw new PanicResultError(`Unhandled Err result: ${result.error}`);
};

/**
 * Unsafely extracts the error value from a {@link Result}.
 *
 * This function is unsafe. If the provided {@link Result} is {@link Ok},
 * a {@link PanicResultError} will be thrown. Prefer using {@link match} when
 * the value is uncertain.
 *
 * @typeParam V - The success value type.
 * @typeParam E - The error value type.
 *
 * @param result - The result to unwrap.
 * @returns The error value.
 *
 * @throws {@link PanicResultError} if the result is {@link Ok}.
 */
export const unwrapErr = <V, E>(result: Result<V, E>): E => {
    if (isErr(result)) {
        return result.error;
    }

    throw new PanicResultError(`Unhandled Ok result: ${result.value}`);
};

/**
 * Pattern matches over a {@link Result} and invokes the appropriate handler.
 *
 * @typeParam V - The success value type.
 * @typeParam E - The error value type.
 * @typeParam R1 - Return type of the `ok` handler.
 * @typeParam R2 - Return type of the `err` handler.
 *
 * @param result - The result to match.
 * @param matchers - An object containing handlers for both cases.
 * @returns The return value of the invoked handler.
 */
export const match = <V, E, R1, R2>(
    result: Result<V, E>,
    matchers: Matchers<V, E, R1, R2>,
): R1 | R2 => {
    return isOk(result) ? matchers.ok(result.value) : matchers.err(result.error);
};

/**
 * Executes a synchronous function and captures thrown errors into a {@link Result}.
 *
 * @typeParam V - The return type of the function.
 * @typeParam E - The error type.
 *
 * @param fn - The function to execute.
 * @returns An {@link Ok} containing the return value, or an {@link Err}
 * containing the thrown error.
 */
export const tryCatch = <V, E>(fn: () => V): Result<V, E> => {
    try {
        const value = fn();
        return ok(value);
    } catch (error) {
        return err(error as E);
    }
};

/**
 * Executes an asynchronous function and captures rejected promises
 * or thrown errors into a {@link Result}.
 *
 * @typeParam V - The resolved value type.
 * @typeParam E - The error type.
 *
 * @param fn - The async function to execute.
 * @returns A promise resolving to an {@link Ok} containing the resolved value,
 * or an {@link Err} containing the rejection reason.
 */
export const tryCatchAsync = async <V, E>(fn: () => Promise<V>): Promise<Result<V, E>> => {
    try {
        const value = await fn();
        return ok(value);
    } catch (error) {
        return err(error as E);
    }
};
