import { AnyFunction } from '../util-types';

export function handlePromise(
  item: unknown,
  errorHandler: AnyFunction,
): Promise<unknown> {
  let promise: AnyFunction | Promise<unknown> | null;
  promise = item instanceof Promise ? item : null;
  if (typeof item === 'function' && !promise) {
    try {
      promise = item();
      if (!(promise instanceof Promise)) {
        return Promise.resolve(promise);
      }
    } catch (err) {
      promise = Promise.reject(err);
    }
  }
  if (promise instanceof Promise) {
    return new Promise<unknown>((resolve) => {
      (promise as Promise<unknown>).then(resolve).catch((err: Error) => {
        errorHandler(err);
        resolve(undefined);
      });
    });
  }
  return Promise.resolve(item);
}
