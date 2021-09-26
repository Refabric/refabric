import { handlePromise } from './handler-promise';

describe('Promises handler', () => {
  test('should resolve result', () => {
    return expect(
      handlePromise(
        () => Promise.resolve(1),
        () => {},
      ),
    ).resolves.toBe(1);
  });

  test('should resolve result for promise already pending', () => {
    return expect(handlePromise(Promise.resolve(1), () => {})).resolves.toBe(1);
  });

  test('should resolve sync result', () => {
    return expect(
      handlePromise(
        () => 1,
        () => {},
      ),
    ).resolves.toBe(1);
  });

  test('should handle error', (done) => {
    let handled = false;
    const handleError = () => (handled = true);
    handlePromise(() => Promise.reject(0), handleError)
      .then((res) => {
        expect(res).toEqual(undefined);
        expect(handled).toEqual(true);
      })
      .finally(done);
  });

  test('should handle raw value', () => {
    return expect(handlePromise(1, () => {})).resolves.toBe(1);
  });

  test('should handle undefined', () => {
    return expect(handlePromise(undefined, () => {})).resolves.toBe(undefined);
  });

  test('should handle non function/promise argument', (done) => {
    let handled = false;
    const handleError = () => (handled = true);
    handlePromise(() => {
      throw new Error('Expected error');
    }, handleError)
      .then((res) => {
        expect(res).toEqual(undefined);
        expect(handled).toEqual(true);
      })
      .finally(done);
  });
});
