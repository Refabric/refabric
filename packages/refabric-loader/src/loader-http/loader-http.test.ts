import { LoaderHTTP } from './loader-http';

describe('Loader HTTP', () => {
  test('should list content with http request', () => {
    const loader = new LoaderHTTP();
    return expect(
      loader.listContent('https://jsonplaceholder.typicode.com/posts'),
    ).resolves.toBeInstanceOf(Array);
  });

  test('should list content with custom request', () => {
    // Necessary for the test.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const loader = new LoaderHTTP(null, async () => ['hello']);
    return expect(loader.listContent('test')).resolves.toEqual(['hello']);
  });

  test('should load files with custom request', () => {
    const loader = new LoaderHTTP(
      (loaded) => ({ loaded }),
      async () => ['hello'],
    );
    return expect(
      loader.listContent('test').then((list) => loader.loadContent(list)),
    ).resolves.toEqual([{ loaded: 'hello' }]);
  });

  test('should load files with http request', () => {
    const loader = new LoaderHTTP((loaded) => ({ loaded }));
    return expect(
      loader
        .listContent('https://jsonplaceholder.typicode.com/posts')
        .then((list) => loader.loadContent(list))
        .then((list) => {
          expect(list.length).toBeGreaterThan(0);
          return list[0];
        }),
    ).resolves.toHaveProperty('loaded');
  });

  test('should throw an error if missing URL', () => {
    const loader = new LoaderHTTP();
    return expect(loader.listContent('')).rejects.toThrowError(
      /URL not provided/,
    );
  });

  test("should throw an error if request doesn't return an array", () => {
    // Necessary for the test.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const loader = new LoaderHTTP(null, async () => 'hello');
    return expect(loader.listContent('test')).rejects.toThrowError(
      /did not return an array/,
    );
  });
});
