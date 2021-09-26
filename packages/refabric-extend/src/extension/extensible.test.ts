import { Extensible } from './extensible';

describe('Extensible Class', () => {
  test('should process sync extensions', () => {
    class ExtensibleChild extends Extensible {}
    const testObj = new ExtensibleChild();
    const context = { count: 0 };
    testObj.extend((ctx: any) => ctx.count++);
    expect(context.count).toEqual(0);
    testObj.processExtensions(context);
    expect(context.count).toEqual(1);
  });

  test('should process async extensions', () => {
    class ExtensibleChild extends Extensible {}
    const testObj = new ExtensibleChild();
    const context = { count: 0 };
    testObj.extend((ctx: any) => Promise.resolve(ctx.count++));
    expect(context.count).toEqual(0);
    testObj.processExtensions(context);
    expect(context.count).toEqual(1);
  });

  test("shouldn't break with zero extensions", () => {
    class ExtensibleChild extends Extensible {}
    const testObj = new ExtensibleChild();
    const context = { count: 0 };
    expect(context.count).toEqual(0);
    testObj.processExtensions(context);
    expect(context.count).toEqual(0);
  });

  test('should throw error if sync extension fails', () => {
    class ExtensibleChild extends Extensible {}
    const testObj = new ExtensibleChild();
    const context = {};

    testObj.extend(() => {
      throw new Error('Expected error');
    });

    return expect(testObj.processExtensions(context)).rejects.toThrowError(
      /Expected error/,
    );
  });

  test('should throw error if async extension fails', () => {
    class ExtensibleChild extends Extensible {}
    const testObj = new ExtensibleChild();
    const context = {};

    testObj.extend(() => {
      return Promise.reject('Expected error');
    });

    return expect(testObj.processExtensions(context)).rejects.toThrowError(
      /Expected error/,
    );
  });
});
